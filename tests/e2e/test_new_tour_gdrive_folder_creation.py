"""
E2E Test: New Tour Immediate Google Drive Folder Creation
Validates that creating a new tour in Uno_API immediately creates the tour folder
and its 'Import' and 'Invoice' subfolders on Google Drive Shared Drive (UNOERP_Storage).
"""

import json
import sys
import time
import requests
import google.auth.transport.requests
from google.oauth2 import service_account
import urllib3
urllib3.disable_warnings()

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

key_path = r'C:\Ersen\Projects_2025\Uno_ERP\Publish\unoerp-storage-9c49eccb2ea7.json'
creds = service_account.Credentials.from_service_account_file(
    key_path,
    scopes=['https://www.googleapis.com/auth/drive']
)

session = requests.Session()
session.verify = False
request = google.auth.transport.requests.Request(session=session)
creds.refresh(request)
gdrive_headers = {'Authorization': f'Bearer {creds.token}', 'Content-Type': 'application/json'}

api_base = 'https://uno-dmc.cz/api'
test_tour_code = f"GDTEST{int(time.time())}"

def test_immediate_gdrive_folder_creation():
    print(f"1. Creating new tour via API: {test_tour_code} under Project 5063 (Orta Avrupa BVP)...")
    tour_payload = {
        "projectId": 5063,
        "tourCode": test_tour_code,
        "destination": "Budapest-Vienna-Prague",
        "arrivalDate": "2026-11-15T00:00:00Z",
        "endDate": "2026-11-22T00:00:00Z",
        "adults": 20,
        "children": 2,
        "infants": 0,
        "tourStatusId": 1,
        "notes": "Automated verification of Google Drive immediate folder creation"
    }

    api_headers = {
        'Content-Type': 'application/json',
        'X-User-Role': 'Administrator'
    }

    r = session.post(f"{api_base}/tours", json=tour_payload, headers=api_headers)
    assert r.status_code in (200, 201), f"Create Tour API failed: {r.status_code} {r.text}"

    created_tour = r.json()
    created_id = created_tour.get('id')
    print(f"PASS: Created Tour ID: {created_id}, Code: {created_tour.get('tourCode')}")

    time.sleep(2)

    print("2. Verifying folder creation in Google Drive Shared Drive (UNOERP_Storage > Orta Avrupa BVP)...")
    bvp_project_id = '1y7t3Psg2ZSD4ELPLEaUAim2SDYKh0d0j' # Orta Avrupa BVP
    q = f"'{bvp_project_id}' in parents and name = '{test_tour_code}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    params = {
        'q': q,
        'supportsAllDrives': 'true',
        'includeItemsFromAllDrives': 'true',
        'corpora': 'allDrives',
        'fields': 'files(id, name)'
    }
    gr = session.get('https://www.googleapis.com/drive/v3/files', headers=gdrive_headers, params=params)
    found_folders = gr.json().get('files', [])
    assert len(found_folders) > 0, "Google Drive tour folder was not created!"

    tour_folder_id = found_folders[0]['id']
    print(f"PASS: Tour folder created on Google Drive with ID: {tour_folder_id}")

    print("3. Checking for 'Import' and 'Invoice' subfolders inside the new tour folder...")
    sq = f"'{tour_folder_id}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    sparams = {
        'q': sq,
        'supportsAllDrives': 'true',
        'includeItemsFromAllDrives': 'true',
        'corpora': 'allDrives',
        'fields': 'files(id, name)'
    }
    sgr = session.get('https://www.googleapis.com/drive/v3/files', headers=gdrive_headers, params=sparams)
    subfolders = sgr.json().get('files', [])
    sub_names = [sf['name'] for sf in subfolders]

    assert 'Import' in sub_names, "Missing 'Import' subfolder"
    assert 'Invoice' in sub_names, "Missing 'Invoice' subfolder"
    print("PASS: Both 'Import' and 'Invoice' subfolders were verified on Google Drive!")

    print("4. Cleaning up test tour and Google Drive folders...")
    del_r = session.delete(f"{api_base}/tours/{created_id}", headers=api_headers)
    assert del_r.status_code in (200, 204), f"Delete tour failed: {del_r.status_code}"

    trash_r = session.patch(f"https://www.googleapis.com/drive/v3/files/{tour_folder_id}?supportsAllDrives=true", headers=gdrive_headers, json={'trashed': True})
    assert trash_r.status_code == 200, f"Trash folder failed: {trash_r.status_code}"
    print("PASS: Cleanup finished successfully.")

if __name__ == '__main__':
    test_immediate_gdrive_folder_creation()
    print("\nALL CHECKS PASSED: Immediate Google Drive Folder Creation is verified!")
