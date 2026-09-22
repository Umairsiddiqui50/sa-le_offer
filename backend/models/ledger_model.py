from database import db
from datetime import datetime

class PromotionUsageLedger(db.Model):
    __tablename__ = 'promotion_usage_ledger'
    
    ledger_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(100), nullable=False) # Using string ID for dummy payment ease
    user_id = db.Column(db.String(100), nullable=False)
    promotion_id = db.Column(db.Integer, db.ForeignKey('promotions.promotion_id'), nullable=False)
    coupon_id = db.Column(db.Integer, db.ForeignKey('coupons.coupon_id'), nullable=True)
    discount_given = db.Column(db.Float, nullable=False)
    usage_status = db.Column(db.String(50), default='HELD') # HELD, SUCCESS, FAILED, CANCELLED, REFUNDED
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
