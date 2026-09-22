
import uuid
from flask import Blueprint, request, jsonify
from services.product_service import get_all_products
from discounts.engine import process_calculation
from services.order_service import create_order
from ledger.coupon_counter import increment_coupon_usage
from ledger.usage_ledger import insert_ledger_record
from services.checkout_lock import acquire_lock, release_lock
from models import Order, Promotion, Coupon, db

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/products', methods=['GET'])
def get_products():
    products = get_all_products()
    return jsonify([
        {
            "product_id": p.product_id,
            "name": p.name,
            "category": p.category,
            "brand": p.brand,
            "price": p.selling_price,
            "mrp": p.mrp,
            "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
        } for p in products
    ])

@api_bp.route('/promotions', methods=['GET'])
def get_promotions():
    promos = Promotion.query.filter_by(status='ACTIVE').all()
    return jsonify([
        {
            "promotion_id": p.promotion_id,
            "title": p.title,
            "description": p.description,
            "type": p.discount_type,
            "stackable": p.is_stackable
        } for p in promos
    ])

@api_bp.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    result = process_calculation(data)
    return jsonify(result)

@api_bp.route('/orders', methods=['POST'])
def place_order():
    data = request.json
    cart = process_calculation(data)
    
    if "Coupon usage limit reached." in [r['reason'] for r in cart['rejected_offers']]:
        return jsonify({"error": "Coupon limit reached during checkout."}), 400
        
    order_id = create_order(data.get('user_id', 'GUEST'), cart)
    
    # Generate payment intent (Dummy)
    payment_intent_id = f"PAY_TEST_{order_id}"
    
    # 15-Minute Checkout Lock
    coupon_code = data.get('coupon_code')
    if coupon_code:
        locked = acquire_lock(coupon_code, data.get('user_id', 'GUEST'))
        if not locked:
            return jsonify({"error": "Coupon is currently locked by another checkout session."}), 423
            
    return jsonify({"order_id": order_id, "amount": cart['final_payable'], "cart": cart, "payment_intent": payment_intent_id})

@api_bp.route('/payment/simulate-success', methods=['POST'])
def payment_success():
    data = request.json
    order_id = data.get('order_id')
    coupon_code = data.get('coupon_code')
    cart_data = data.get('cart')
    
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404
        
    try:
        coupon_id = None
        if coupon_code:
            coupon = Coupon.query.filter_by(coupon_code=coupon_code).first()
            if coupon:
                success = increment_coupon_usage(coupon_code)
                if not success:
                    db.session.rollback()
                    return jsonify({"error": "Coupon limit reached before payment completion."}), 400
                coupon_id = coupon.coupon_id
                release_lock(coupon_code)
                
        if cart_data and 'applied_offers' in cart_data:
            for offer in cart_data['applied_offers']:
                insert_ledger_record(order_id, order.user_id, offer['promotion_id'], coupon_id if coupon_code else None, offer['discount'], 'SUCCESS')
                
        order.payment_status = 'SUCCESS'
        order.order_status = 'CONFIRMED'
        db.session.commit()
        return jsonify({"payment_status": "SUCCESS", "order_status": "CONFIRMED", "message": "Dummy payment successful"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api_bp.route('/payment/simulate-failure', methods=['POST'])
def payment_failure():
    data = request.json
    order_id = data.get('order_id')
    coupon_code = data.get('coupon_code')
    
    order = Order.query.get(order_id)
    if order:
        order.payment_status = 'FAILED'
        order.order_status = 'CANCELLED'
        db.session.commit()
        
    if coupon_code:
        release_lock(coupon_code)
        
    return jsonify({"payment_status": "FAILED", "message": "Dummy payment failed. Coupon lock released."})

@api_bp.route('/admin/offer-engine/test', methods=['POST'])
def admin_offer_tester():
    data = request.json
    # This just runs calculation and returns EVERYTHING
    result = process_calculation(data)
    
    # Attach profit margin info for admin
    gross = result['gross_total']
    discount = result['total_discount']
    floor = result['floor_price_total']
    
    result['admin_diagnostics'] = {
        "is_profitable": (gross - discount) > floor,
        "margin": (gross - discount) - floor,
        "floor_enforced": result['final_payable'] == floor,
        "cashback_liability": result['cashback']
    }
    
    return jsonify(result)
