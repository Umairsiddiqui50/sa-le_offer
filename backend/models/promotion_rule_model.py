from database import db

class PromotionRule(db.Model):
    __tablename__ = 'promotion_rules'
    
    rule_id = db.Column(db.Integer, primary_key=True)
    promotion_id = db.Column(db.Integer, db.ForeignKey('promotions.promotion_id'), nullable=False)
    rule_type = db.Column(db.String(50), nullable=False) # CATEGORY, BRAND, PRODUCT, BANK_NAME, etc.
    operator = db.Column(db.String(50), nullable=False) # EQUALS, IN, GREATER_THAN, etc.
    rule_value = db.Column(db.String(255), nullable=False)
