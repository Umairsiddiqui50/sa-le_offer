
from models import Product

def get_product_by_id(product_id):
    return Product.query.get(product_id)

def get_all_products():
    return Product.query.filter_by(is_active=True).all()
