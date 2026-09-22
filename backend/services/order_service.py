
import uuid
from models import Order, OrderItem
from database import db

def create_order(user_id, cart_result):
    order_id = "ORD_" + str(uuid.uuid4()).split('-')[0].upper()
    
    order = Order(
        order_id=order_id,
        user_id=user_id,
        subtotal=cart_result['gross_total'],
        total_discount=cart_result['total_discount'],
        final_amount=cart_result['final_payable'],
        payment_status='PENDING',
        order_status='CREATED'
    )
    db.session.add(order)
    
    for item in cart_result['items']:
        oi = OrderItem(
            order_id=order_id,
            product_id=item['product_id'],
            quantity=item['quantity'],
            unit_price=item['price'],
            discount_amount=item['discount_amount'],
            final_price=(item['price'] * item['quantity']) - item['discount_amount']
        )
        db.session.add(oi)
        
    db.session.commit()
    return order_id
