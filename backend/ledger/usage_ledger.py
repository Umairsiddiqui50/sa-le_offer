
from models import PromotionUsageLedger
from database import db

def insert_ledger_record(order_id, user_id, promotion_id, coupon_id, discount_given, status):
    record = PromotionUsageLedger(
        order_id=order_id,
        user_id=user_id,
        promotion_id=promotion_id,
        coupon_id=coupon_id,
        discount_given=discount_given,
        usage_status=status
    )
    db.session.add(record)
    db.session.commit()
