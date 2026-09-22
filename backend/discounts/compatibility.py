
from services.conflict_engine import check_conflicts

def filter_compatible_promotions(eligible_promotions):
    # Max 3 allowed (configurable)
    MAX_ALLOWED = 3
    
    eligible_promotions.sort(key=lambda p: p.priority)
    
    selected = []
    rejected = []
    
    for promo in eligible_promotions:
        if len(selected) >= MAX_ALLOWED:
            rejected.append({"promotion_id": promo.promotion_id, "title": promo.title, "reason": f"Maximum {MAX_ALLOWED} offers allowed."})
            continue
            
        # Check stackability
        if not promo.is_stackable:
            if len(selected) > 0:
                rejected.append({"promotion_id": promo.promotion_id, "title": promo.title, "reason": "Cannot stack with other offers."})
                continue
                
        # Check conflicts with already selected offers
        conflict_found = False
        for s in selected:
            is_conflict, reason = check_conflicts(promo, s)
            if is_conflict:
                rejected.append({"promotion_id": promo.promotion_id, "title": promo.title, "reason": reason})
                conflict_found = True
                break
                
        if not conflict_found:
            # If s was unstackable, it would reject others, but we handled it above
            selected.append(promo)
                
    return selected, rejected
