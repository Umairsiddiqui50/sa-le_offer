
from database import db
from models import Product, Promotion, PromotionRule, Coupon
from data.dummy_products import products_data
from data.dummy_promotions import promotions_data, promotion_rules_data
from data.dummy_coupons import coupons_data

def seed_database(app):
    with app.app_context():
        db.create_all()
        
        if Product.query.first():
            return # Already seeded
            
        print("Seeding new database...")
        
        for p in products_data:
            prod = Product(**p)
            db.session.add(prod)
            
        for promo in promotions_data:
            pr = Promotion(**promo)
            db.session.add(pr)
        db.session.flush()
            
        for rule in promotion_rules_data:
            r = PromotionRule(**rule)
            db.session.add(r)
        db.session.flush()
            
        for coup in coupons_data:
            c = Coupon(**coup)  # type: ignore
            db.session.add(c)
            
        db.session.commit()
        print("Database seeded!")
