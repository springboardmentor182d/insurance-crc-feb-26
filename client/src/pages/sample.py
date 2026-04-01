def change(amount):
    if amount == 24:
        return [5, 5, 7, 7]
    if amount == 25:
        return [5, 5, 5, 5, 5]
    if amount == 26:
        return [5, 7, 7, 7]
    if amount == 27:
        return [5, 5, 5, 5, 7]
    if amount == 28:
        return [7, 7, 7, 7]
    
    # For any amount > 28, we reduce the problem by 5
    # and add a 5 to the resulting list.
    coins = change(amount - 5)
    coins.append(5)
    return coins