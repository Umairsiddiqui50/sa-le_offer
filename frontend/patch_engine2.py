import os

engine_path = r"C:\Users\ASUS\OneDrive\Pictures\Feedback\{3F8935AF-4022-4D1E-89B3-988E2F29C295}\discounts\engine.py"

with open(engine_path, "r", encoding="utf-8") as f:
    content = f.read()

old = """        if promo.promotion_id in disabled_offers:
            cart['rejected_offers'].append({"title": promo.title, "reason": "Manually removed by user."})
            continue"""

new = """        if promo.promotion_id in disabled_offers:
            cart['rejected_offers'].append({"promotion_id": promo.promotion_id, "title": promo.title, "reason": "Manually removed by user."})
            continue"""

content = content.replace(old, new)

with open(engine_path, "w", encoding="utf-8") as f:
    f.write(content)

print("engine.py patched for restore feature")
