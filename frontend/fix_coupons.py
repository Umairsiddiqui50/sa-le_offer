import os

file_path = r"C:\Users\ASUS\OneDrive\Pictures\Feedback\{3F8935AF-4022-4D1E-89B3-988E2F29C295}\data\dummy_coupons.py"
content = """coupons_data = [
    # Welcome Discount (promotion 105)
    {"promotion_id": 105, "coupon_code": "123456", "total_limit": 100, "user_limit": 1}
]"""

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
