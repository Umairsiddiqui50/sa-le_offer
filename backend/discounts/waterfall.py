
from discounts.percentage import calculate_percentage_discount
from discounts.flat import calculate_flat_discount
from discounts.bogo import calculate_bogo_discount
from discounts.cart_slab import calculate_cart_slab_discount

def apply_promotions_waterfall(cart, selected_promotions):
    for promo in selected_promotions:
        discount = 0.0
        
        if promo.discount_type == 'PERCENTAGE':
            discount = calculate_percentage_discount(cart['running_total'], promo.discount_value, promo.max_cap)
            cart['running_total'] -= discount
            
        elif promo.discount_type == 'FLAT':
            discount = calculate_flat_discount(cart['running_total'], promo.discount_value)
            cart['running_total'] -= discount
            
        elif promo.discount_type == 'BOGO':
            # Simplified BOGO (assumes rule_type BRAND is set and checks first matching item)
            # A real engine would link rule to specific item
            brand_to_bogo = "NIKE" # Hardcoded for demo logic to match rule
            for item in cart['items']:
                if item['brand'] == brand_to_bogo:
                    discount = calculate_bogo_discount(cart['items'], item['product_id'])
                    break
            cart['running_total'] -= discount
            
        elif promo.discount_type == 'CART_SLAB':
            discount = calculate_cart_slab_discount(cart['gross_total'], promo.min_cart_value, promo.discount_value)
            cart['running_total'] -= discount
            
        elif promo.discount_type == 'CASHBACK':
            # Cashback does not reduce running total or final payable!
            discount = calculate_percentage_discount(cart['running_total'], promo.discount_value, promo.max_cap)
            cart['cashback'] += discount
            discount = 0.0 # set to 0 so it doesn't add to total_discount
            
        if discount > 0 or promo.discount_type == 'CASHBACK':
            cart['applied_offers'].append({
                "promotion_id": promo.promotion_id,
                "title": promo.title,
                "discount": discount if promo.discount_type != 'CASHBACK' else 0,
                "cashback_awarded": discount if promo.discount_type == 'CASHBACK' else 0
            })
            if promo.discount_type != 'CASHBACK':
                cart['total_discount'] += discount
