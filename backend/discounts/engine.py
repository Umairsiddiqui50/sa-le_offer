
from models import Promotion, PromotionRule, Coupon, Product
from discounts.compatibility import filter_compatible_promotions
from discounts.waterfall import apply_promotions_waterfall
from services.eligibility_service import is_eligible
from safety.floor_price import enforce_floor_price
from safety.proration import distribute_discount

def process_calculation(payload):
    items_payload = payload.get('items', [])
    coupon_code = payload.get('coupon_code')
    bank_name = payload.get('bank_name')
    disabled_offers = payload.get('disabled_offers', [])
    
    # 1. Normalize Cart
    cart = {
        "items": [],
        "gross_total": 0,
        "floor_price_total": 0,
        "running_total": 0,
        "total_discount": 0,
        "cashback": 0,
        "final_payable": 0,
        "applied_offers": [],
        "rejected_offers": [],
        "notes": [],
        "bank_name": bank_name
    }
    
    for ip in items_payload:
        prod = Product.query.get(ip.get('product_id', 0))
        if prod or ip.get('is_custom'):
            qty = ip.get('quantity', 1)
            price = ip.get('price') if ip.get('is_custom') else (prod.selling_price if prod else 0)
            floor = ip.get('floor_price') if ip.get('is_custom') else (prod.floor_price if prod else 0)
            brand = ip.get('brand', 'TEST') if ip.get('is_custom') else (prod.brand if prod else '')
            category = ip.get('category', 'TEST') if ip.get('is_custom') else (prod.category if prod else '')
            name = ip.get('name', 'Custom Item') if ip.get('is_custom') else (prod.name if prod else '')
            
            cart['items'].append({
                "product_id": ip.get('product_id', 999),
                "name": name,
                "brand": brand,
                "category": category,
                "price": price,
                "quantity": qty,
                "discount_amount": 0
            })
            cart['gross_total'] += price * qty
            cart['floor_price_total'] += floor * qty
            
    cart['running_total'] = cart['gross_total']
    
    # 2. Fetch Active Promotions
    all_promotions = Promotion.query.filter_by(status='ACTIVE').all()
    
    # Handle Coupon
    coupon_promo_id = None
    if coupon_code:
        coupon = Coupon.query.filter_by(coupon_code=coupon_code, is_active=True).first()
        if coupon:
            if coupon.total_limit > 0 and coupon.used_count >= coupon.total_limit:
                cart['rejected_offers'].append({"title": coupon_code, "reason": "Coupon usage limit reached."})
            else:
                coupon_promo_id = coupon.promotion_id
        else:
            cart['rejected_offers'].append({"title": coupon_code, "reason": "Invalid or expired coupon."})
            
    eligible = []
    
    for promo in all_promotions:
        # If it's a coupon promotion, only process if the code matches
        # For our demo, promotion 105 is the coupon one
        if promo.promotion_id == 105 and promo.promotion_id != coupon_promo_id:
            continue 
            
        if promo.promotion_id in disabled_offers:
            cart['rejected_offers'].append({"promotion_id": promo.promotion_id, "title": promo.title, "reason": "Manually removed by user."})
            continue
            
        rules = PromotionRule.query.filter_by(promotion_id=promo.promotion_id).all()
        ok, reason = is_eligible(promo, cart, rules)
        if ok:
            eligible.append(promo)
        else:
            # Don't clutter rejected with irrelevant offers, but add if it's the coupon
            if promo.promotion_id == coupon_promo_id:
                cart['rejected_offers'].append({"title": promo.title, "reason": reason})

    # 3. Compatibility
    selected, rejected = filter_compatible_promotions(eligible)
    cart['rejected_offers'].extend(rejected)
    
    # 4. Waterfall
    apply_promotions_waterfall(cart, selected)
    
    # 5. Floor Price & Proration
    enforce_floor_price(cart)
    distribute_discount(cart['items'], cart['total_discount'])
    
    cart['total_savings'] = cart['total_discount']
    
    return cart
