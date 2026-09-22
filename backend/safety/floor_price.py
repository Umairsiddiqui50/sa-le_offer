
def enforce_floor_price(cart):
    # Prevent final amount from dropping below floor_price_total
    gross = cart['gross_total']
    floor = cart['floor_price_total']
    total_discount = cart['total_discount']
    
    if gross - total_discount < floor:
        # We need to reduce the discount
        allowed_discount = gross - floor
        if allowed_discount < 0:
            allowed_discount = 0
            
        cart['total_discount'] = allowed_discount
        cart['final_payable'] = floor
        cart['notes'].append("Discount limited to protect minimum selling price (Floor Price).")
    else:
        cart['final_payable'] = gross - total_discount
