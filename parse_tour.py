import json
try:
    with open('tour5051.json', encoding='utf-16') as f:
        data = json.load(f)
    print("Services with category 6:")
    for s in data.get('tourServices', []):
        if s.get('serviceCategoryId') == 6:
            print(f"Desc: {s.get('description')}, UnitPrice: {s.get('unitPrice')}, IsRev: {s.get('isRevenue')}, ExcId: {s.get('excursionId')}")
except Exception as e:
    print(e)
