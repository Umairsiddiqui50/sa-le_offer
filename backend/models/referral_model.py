from database import db
from datetime import datetime

class Referral(db.Model):
    __tablename__ = 'referrals'
    
    id = db.Column(db.Integer, primary_key=True)
    referrer_user_id = db.Column(db.String(100), nullable=False)
    referee_user_id = db.Column(db.String(100), nullable=False)
    order_id = db.Column(db.String(100))
    status = db.Column(db.String(50), default='PENDING') # PENDING, QUALIFIED, REJECTED
    qualified_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
