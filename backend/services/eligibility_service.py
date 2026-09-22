
from datetime import datetime

def is_eligible(promotion, cart_data, rules):
    now = datetime.utcnow()
    if promotion.start_date and now < promotion.start_date:
        return False, "Offer has not started yet."
    if promotion.end_date and now > promotion.end_date:
        return False, "Offer has expired."
        
    if promotion.min_cart_value > 0 and cart_data['gross_total'] < promotion.min_cart_value:
        return False, f"Minimum cart value of ₹{promotion.min_cart_value} required."
        
    # Check rules
    for rule in rules:
        if rule.rule_type == 'CATEGORY':
            # Check if any item matches category
            has_cat = any(item['category'] == rule.rule_value for item in cart_data['items'])
            if not has_cat:
                return False, f"Requires {rule.rule_value} category product in cart."
                
        elif rule.rule_type == 'BANK_NAME':
            if cart_data.get('bank_name') != rule.rule_value:
                return False, f"Requires {rule.rule_value} bank card."
                
        elif rule.rule_type == 'BRAND':
            has_brand = any(item['brand'] == rule.rule_value for item in cart_data['items'])
            if not has_brand:
                return False, f"Requires {rule.rule_value} brand product in cart."
                
    return True, ""
