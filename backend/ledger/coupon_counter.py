
from database import db
from models import Coupon
from sqlalchemy import text

def increment_coupon_usage(coupon_code):
    # Atomic update to prevent race conditions
    sql = text('''
        UPDATE coupons 
        SET used_count = used_count + 1 
        WHERE coupon_code = :code 
        AND (total_limit = 0 OR used_count < total_limit)
    ''')
    result = db.session.execute(sql, {'code': coupon_code})
    return result.rowcount > 0
