from database import db
from models.checkout_lock_model import CheckoutLock
from datetime import datetime, timedelta

def acquire_lock(coupon_code, user_id):
    now = datetime.utcnow()
    CheckoutLock.query.filter(CheckoutLock.expires_at < now).delete()
    db.session.commit()
    
    existing = CheckoutLock.query.filter_by(coupon_code=coupon_code).first()
    if existing and existing.user_id != user_id:
        return False
        
    if not existing:
        lock = CheckoutLock(coupon_code=coupon_code, user_id=user_id, expires_at=now + timedelta(seconds=900))
        db.session.add(lock)
        db.session.commit()
    return True

def release_lock(coupon_code):
    CheckoutLock.query.filter_by(coupon_code=coupon_code).delete()
    db.session.commit()
