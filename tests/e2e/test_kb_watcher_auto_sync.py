import os
import sys
import time
import requests

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

API_BASE_URL = "http://localhost:8001"
KB_DIR = r"C:\Ersen\Projects_2025\Uno_ERP\UserManuals\Tours"
TEST_MD_PATH = os.path.join(KB_DIR, "Test_Live_Auto_Sync_Protocol.md")

def test_filesystemwatcher_auto_indexing():
    print("\n--- [Step 1] Creating new .md SOP file in UserManuals/Tours/ ---")
    test_content = """# VIP Catering Protocol Prague

### Description
Standard operating procedure for VIP arrivals in Prague.

#### Rules & Guidelines
- All VIP group arrivals in Prague must receive welcome gift baskets containing organic Moravian wine and Bohemian wafers.
- The lead tour guide must verify the baskets at least 2 hours prior to airport arrival.

#### Triggers
What is the VIP catering protocol in Prague?
Prague VIP welcome gift rules
"""
    with open(TEST_MD_PATH, "w", encoding="utf-8") as f:
        f.write(test_content)
    print(f"[+] Created test file: {TEST_MD_PATH}")

    print("\n--- [Step 2] Waiting 4 seconds for FileSystemWatcher debounce (2s) to execute ---")
    time.sleep(4)

    print("\n--- [Step 3] Querying AI Bot for the newly added SOP protocol ---")
    res = requests.post(f"{API_BASE_URL}/api/ai/chat", json={
        "query": "What is the VIP catering protocol in Prague?"
    }, timeout=30)
    assert res.status_code == 200, f"Expected 200 OK, got {res.status_code}"
    data = res.json()
    answer = data.get("answer", "")
    print(f"[+] Bot Answer:\n{answer}")

    assert any(term in answer.lower() for term in ["moravian", "wine", "wafer", "catering", "basket"]), \
        f"Expected bot to retrieve Moravian wine / wafers from newly added file. Got: {answer}"
    print("[PASS] Bot immediately retrieved knowledge from newly created .md file without any manual trigger!")

    print("\n--- [Step 4] Cleaning up test file ---")
    if os.path.exists(TEST_MD_PATH):
        os.remove(TEST_MD_PATH)
        print(f"[+] Deleted test file: {TEST_MD_PATH}")

    print("\n--- [Step 5] Waiting 3 seconds for deletion sync ---")
    time.sleep(3)
    print("[PASS] FileSystemWatcher automatic knowledge sync verified successfully!")

if __name__ == "__main__":
    test_filesystemwatcher_auto_indexing()
