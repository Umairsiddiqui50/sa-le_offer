
def distribute_discount(items, total_discount):
    if total_discount <= 0 or not items:
        return
        
    # Calculate sum of items that are eligible for proration (all of them for now)
    total_value = sum(item['price'] * item['quantity'] for item in items)
    
    if total_value <= 0:
        return
        
    distributed = 0.0
    for i in range(len(items) - 1):
        item = items[i]
        item_total = item['price'] * item['quantity']
        ratio = item_total / total_value
        item_discount = round(total_discount * ratio, 2)
        item['discount_amount'] = item_discount
        distributed += item_discount
        
    # Last item gets the remainder to avoid rounding issues
    if items:
        last_item = items[-1]
        last_item['discount_amount'] = round(total_discount - distributed, 2)
