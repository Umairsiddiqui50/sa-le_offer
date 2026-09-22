from database import db
from datetime import datetime

class Coupon(db.Model):
    __tablename__ = 'coupons'
    
    coupon_id = db.Column(db.Integer, primary_key=True)
    promotion_id = db.Column(db.Integer, db.ForeignKey('promotions.promotion_id'), nullable=False)
    coupon_code = db.Column(db.String(50), unique=True, nullable=False)
    total_limit = db.Column(db.Integer, default=0) # 0 means unlimited
    used_count = db.Column(db.Integer, default=0)
    user_limit = db.Column(db.Integer, default=1)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
