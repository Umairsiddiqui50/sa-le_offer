
def calculate_bogo_discount(items, product_id):
    # Buy 1 Get 1 free logic for a specific product
    # Count total quantity of this product in cart
    total_qty = 0
    unit_price = 0
    for item in items:
        if item['product_id'] == product_id:
            total_qty += item['quantity']
            unit_price = item['price'] # Use actual selling price
            
    free_items = total_qty // 2
    return free_items * unit_price
