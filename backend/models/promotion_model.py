from database import db
from datetime import datetime

class Promotion(db.Model):
    __tablename__ = 'promotions'
    
    promotion_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    discount_type = db.Column(db.String(50), nullable=False) # PERCENTAGE, FLAT, BOGO, CASHBACK, QUANTITY, FREE_DELIVERY
    discount_value = db.Column(db.Float, nullable=False)
    max_cap = db.Column(db.Float, default=0.0)
    min_cart_value = db.Column(db.Float, default=0.0)
    is_stackable = db.Column(db.Boolean, default=True)
    priority = db.Column(db.Integer, default=1)
    status = db.Column(db.String(50), default='ACTIVE')
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    max_usage = db.Column(db.Integer, default=0) # 0 means unlimited
    used_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
