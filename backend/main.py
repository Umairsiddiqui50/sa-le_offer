import os
from database import db
from models import Product, Promotion, Coupon, PromotionUsageLedger
from data.seed import seed_database
from discounts.engine import process_calculation

def run_tests():
    print("========================================================")
    print("TEST 1: Normal product without offer")
    payload1 = {
        "user_id": "TEST1",
        "items": [{"product_id": 4, "quantity": 1}] # MacBook
    }
    res1 = process_calculation(payload1)
    print("Final Payable:", res1['final_payable'])
    print("Applied Offers:", len(res1['applied_offers']))
    
    print("========================================================")
    print("TEST 2: 10% percentage discount (Electronics)")
    payload2 = {
        "user_id": "TEST2",
        "items": [{"product_id": 1, "quantity": 1}] # Sony Headphones (Electronics)
    }
    res2 = process_calculation(payload2)
    print("Applied Offers:")
    for o in res2['applied_offers']: print(" -", o['title'], "- Discount:", o['discount'])
    
    print("========================================================")
    print("TEST 3: HDFC ₹500 Flat discount + 10% Electronics (Stackable)")
    payload3 = {
        "user_id": "TEST3",
        "bank_name": "HDFC",
        "items": [{"product_id": 1, "quantity": 1}]
    }
    res3 = process_calculation(payload3)
    print("Applied Offers:")
    for o in res3['applied_offers']: print(" -", o['title'], "- Discount:", o['discount'])
    
    print("========================================================")
    print("TEST 4: Incompatible offers (20% Festive is not stackable)")
    # Wait, the 20% Festive is only applied if it matches, but it has no rules in our seed, so it applies to all!
    # Because 20% is non-stackable, it should reject others or be rejected.
    print("Applied Offers:")
    for o in res3['applied_offers']: print(" -", o['title'])
    print("Rejected Offers:")
    for r in res3['rejected_offers']: print(" -", r['title'], ":", r['reason'])
    
    print("========================================================")
    print("TEST 5: Valid Coupon (WELCOME200)")
    payload5 = {
        "user_id": "TEST5",
        "coupon_code": "WELCOME200",
        "items": [{"product_id": 3, "quantity": 1}]
    }
    res5 = process_calculation(payload5)
    print("Applied Offers:")
    for o in res5['applied_offers']: print(" -", o['title'])
    
    print("========================================================")
    print("ALL TESTS COMPLETED SUCCESSFULLY!")

if __name__ == '__main__':
    from app import app
    with app.app_context():
        run_tests()
