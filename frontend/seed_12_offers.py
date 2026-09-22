import os

file_path = r"C:\Users\ASUS\OneDrive\Pictures\Feedback\{3F8935AF-4022-4D1E-89B3-988E2F29C295}\data\dummy_promotions.py"

content = """from datetime import datetime, timedelta
now = datetime.utcnow()
future = now + timedelta(days=30)
past = now - timedelta(days=30)

promotions_data = [
    # 1. Percentage Discount
    {"promotion_id": 101, "title": "10% Electronics OFF", "discount_type": "PERCENTAGE", "discount_value": 10, "max_cap": 2000, "is_stackable": True, "priority": 1, "start_date": past, "end_date": future},
    # 2. Flat Discount
    {"promotion_id": 102, "title": "Flat ₹1000 OFF on Laptops", "discount_type": "FLAT", "discount_value": 1000, "is_stackable": True, "priority": 1, "start_date": past, "end_date": future},
    # 3. Festival / Occasion
    {"promotion_id": 103, "title": "Diwali Dhamaka 20% OFF", "discount_type": "PERCENTAGE", "discount_value": 20, "max_cap": 5000, "is_stackable": False, "priority": 1, "start_date": past, "end_date": future},
    # 4. Buy X Get Y / Bulk
    {"promotion_id": 104, "title": "Buy 1 Get 1 NIKE", "discount_type": "BOGO", "discount_value": 0, "is_stackable": False, "priority": 1, "start_date": past, "end_date": future},
    # 5. First Order / New User
    {"promotion_id": 105, "title": "First Order ₹300 OFF", "discount_type": "FLAT", "discount_value": 300, "is_stackable": True, "priority": 2, "start_date": past, "end_date": future},
    # 6. Coupon Code (Uses dummy_coupons data for ID 106)
    {"promotion_id": 106, "title": "Welcome Coupon Discount", "discount_type": "FLAT", "discount_value": 200, "is_stackable": True, "priority": 4, "start_date": past, "end_date": future},
    # 7. Bank / Card
    {"promotion_id": 107, "title": "HDFC Card ₹500 OFF", "discount_type": "FLAT", "discount_value": 500, "min_cart_value": 5000, "is_stackable": True, "priority": 3, "start_date": past, "end_date": future},
    # 8. Cashback
    {"promotion_id": 108, "title": "5% UPI Cashback", "discount_type": "CASHBACK", "discount_value": 5, "max_cap": 500, "is_stackable": True, "priority": 5, "start_date": past, "end_date": future},
    # 9. No-Cost EMI (Modeled as an instant discount equivalent to subvention)
    {"promotion_id": 109, "title": "6 Months No-Cost EMI", "discount_type": "PERCENTAGE", "discount_value": 4, "max_cap": 1500, "is_stackable": True, "priority": 3, "start_date": past, "end_date": future},
    # 10. Flash / Limited-Time
    {"promotion_id": 110, "title": "Lightning Deal 40% OFF", "discount_type": "PERCENTAGE", "discount_value": 40, "max_cap": 10000, "is_stackable": False, "priority": 1, "start_date": past, "end_date": future},
    # 11. Minimum Cart Value
    {"promotion_id": 111, "title": "Cart ₹300 Discount on ₹10k", "discount_type": "CART_SLAB", "discount_value": 300, "min_cart_value": 10000, "is_stackable": True, "priority": 3, "start_date": past, "end_date": future},
    # 12. Combo / Bundle
    {"promotion_id": 112, "title": "Bundle Discount ₹500", "discount_type": "FLAT", "discount_value": 500, "is_stackable": True, "priority": 2, "start_date": past, "end_date": future}
]

promotion_rules_data = [
    {"promotion_id": 101, "rule_type": "CATEGORY", "operator": "EQUALS", "rule_value": "ELECTRONICS"},
    {"promotion_id": 102, "rule_type": "CATEGORY", "operator": "EQUALS", "rule_value": "LAPTOPS"},
    # 104 BOGO on NIKE
    {"promotion_id": 104, "rule_type": "BRAND", "operator": "EQUALS", "rule_value": "NIKE"},
    # 105 New User (Could be user_type)
    {"promotion_id": 105, "rule_type": "USER_TYPE", "operator": "EQUALS", "rule_value": "NEW_USER"},
    # 107 HDFC Card
    {"promotion_id": 107, "rule_type": "BANK_NAME", "operator": "EQUALS", "rule_value": "HDFC"},
    # 108 Cashback on UPI
    {"promotion_id": 108, "rule_type": "PAYMENT_METHOD", "operator": "EQUALS", "rule_value": "UPI"},
    # 109 EMI
    {"promotion_id": 109, "rule_type": "PAYMENT_METHOD", "operator": "EQUALS", "rule_value": "EMI"}
]
"""

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
