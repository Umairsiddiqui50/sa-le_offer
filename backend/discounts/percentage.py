
def calculate_percentage_discount(amount, percent, max_cap):
    discount = amount * (percent / 100.0)
    if max_cap > 0 and discount > max_cap:
        return max_cap
    return discount
