from database import db
from datetime import datetime

class CheckoutLock(db.Model):
    __tablename__ = 'checkout_locks'
    
    lock_id = db.Column(db.Integer, primary_key=True)
    coupon_code = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.String(100), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
