import urllib.request
import json

try:
    req = urllib.request.urlopen('http://localhost:8001/api/tours')
    tours = json.loads(req.read().decode('utf-8'))
    print("ALL TOURS IN DB:")
    for t in tours:
        print(f"ID: {t.get('id')}, Code: {t.get('tourCode')}, ProjectId: {t.get('projectId')}, Pax: {t.get('pax')}")
except Exception as e:
    print(e)
