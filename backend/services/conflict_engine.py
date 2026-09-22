def check_conflicts(offer1, offer2):
    conflicts = [
        ("CASHBACK", "EMI"),
        ("PERCENTAGE", "BOGO")
    ]
    type1 = offer1.discount_type
    type2 = offer2.discount_type
    for c in conflicts:
        if (type1 == c[0] and type2 == c[1]) or (type1 == c[1] and type2 == c[0]):
            return True, f"Conflict: {type1} cannot stack with {type2}"
    return False, ""
