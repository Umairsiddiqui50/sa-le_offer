from database import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = 'orders'
    
    order_id = db.Column(db.String(100), primary_key=True)
    user_id = db.Column(db.String(100), nullable=False)
    subtotal = db.Column(db.Float, nullable=False)
    total_discount = db.Column(db.Float, nullable=False)
    final_amount = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String(50), default='PENDING') # PENDING, SUCCESS, FAILED
    order_status = db.Column(db.String(50), default='CREATED') # CREATED, CONFIRMED, CANCELLED
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
