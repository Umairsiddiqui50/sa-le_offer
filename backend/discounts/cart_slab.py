
def calculate_cart_slab_discount(subtotal, threshold, discount_value):
    if subtotal >= threshold:
        return discount_value
    return 0.0
