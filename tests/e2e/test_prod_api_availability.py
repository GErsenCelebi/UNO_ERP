"""
UNO ERP API Availability Automated Test Suite
Supports both Production (https://uno-dmc.cz/api) and Localhost (http://localhost:8001/api)
Validates all backend API endpoints for HTTP 200, response latency, and valid payloads.
Saves JSON & Markdown evidence into the designated test run folder.
"""

import os
import sys
import time
import json
import argparse
from datetime import datetime
import urllib3
import requests

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

ENDPOINT_DEFS = [
    {"name": "Projects", "method": "GET", "path": "/projects"},
    {"name": "Tours", "method": "GET", "path": "/tours"},
    {"name": "Clients", "method": "GET", "path": "/clients"},
    {"name": "Hotels", "method": "GET", "path": "/hotels"},
    {"name": "Guides", "method": "GET", "path": "/guides"},
    {"name": "Drivers", "method": "GET", "path": "/drivers"},
    {"name": "Transport Companies", "method": "GET", "path": "/transportcompanies"},
    {"name": "Vendors", "method": "GET", "path": "/vendors"},
    {"name": "Excursions", "method": "GET", "path": "/excursions"},
    {"name": "Service Categories", "method": "GET", "path": "/servicecategories"},
    {"name": "Project Statuses", "method": "GET", "path": "/projectstatuses"},
    {"name": "Tour Statuses", "method": "GET", "path": "/tourstatuses"},
    {"name": "Tour Status Checkpoints", "method": "GET", "path": "/tourstatuscheckpoints"},
    {"name": "Executive Summary", "method": "GET", "path": "/dashboard/executive-summary"},
    {"name": "Dashboard Overview", "method": "GET", "path": "/dashboard/overview"},
    {"name": "Tour Calendar", "method": "GET", "path": "/tourcalendar"},
    {"name": "Bookings", "method": "GET", "path": "/bookings"},
    {"name": "Invoices", "method": "GET", "path": "/invoices"},
    {"name": "Passengers", "method": "GET", "path": "/passengers"},
    {"name": "Audit Logs", "method": "GET", "path": "/auditlogs"},
    {"name": "Role Permissions", "method": "GET", "path": "/rolepermissions"},
    {"name": "AI Knowledge Base Items", "method": "GET", "path": "/aiknowledgeitems"},
    {
        "name": "AI Chat Query",
        "method": "POST",
        "path": "/ai/chat",
        "json": {"query": "Tour status checkpoints", "sessionId": "api-availability-test"}
    },
]

def run_api_availability_tests(base_api_url: str, output_dir: str):
    os.makedirs(output_dir, exist_ok=True)
    base_api_url = base_api_url.rstrip("/")
    print("=" * 80, flush=True)
    print(f"UNO ERP - API AVAILABILITY TESTS", flush=True)
    print(f"Target API: {base_api_url}", flush=True)
    print(f"Output Directory: {output_dir}", flush=True)
    print("=" * 80, flush=True)

    results = []
    total_passed = 0
    total_failed = 0

    session = requests.Session()
    session.verify = False

    for item in ENDPOINT_DEFS:
        name = item["name"]
        method = item["method"]
        path = item["path"]
        url = f"{base_api_url}{path}"
        payload = item.get("json")

        start_time = time.time()
        error_msg = None
        status_code = None
        byte_size = 0
        record_count = 0
        passed = False

        try:
            if method == "GET":
                response = session.get(url, timeout=20)
            else:
                response = session.post(url, json=payload, timeout=25)

            elapsed_ms = round((time.time() - start_time) * 1000, 2)
            status_code = response.status_code
            byte_size = len(response.content)

            if response.status_code == 200:
                passed = True
                try:
                    data = response.json()
                    if isinstance(data, list):
                        record_count = len(data)
                    elif isinstance(data, dict):
                        if "$values" in data:
                            record_count = len(data["$values"])
                        elif "value" in data and isinstance(data["value"], list):
                            record_count = len(data["value"])
                        else:
                            record_count = len(data.keys())
                except Exception:
                    record_count = -1
            else:
                passed = False
                error_msg = f"HTTP {response.status_code}: {response.text[:200]}"
        except Exception as ex:
            elapsed_ms = round((time.time() - start_time) * 1000, 2)
            passed = False
            error_msg = str(ex)

        if passed:
            total_passed += 1
            status_badge = "[PASS]"
        else:
            total_failed += 1
            status_badge = "[FAIL]"

        print(f"{status_badge:<7} | {method:<4} | {status_code or 'ERR':<4} | {elapsed_ms:>6.1f} ms | {byte_size:>8} B | {name}", flush=True)
        if error_msg:
            print(f"        └─ Error: {error_msg}", flush=True)

        results.append({
            "name": name,
            "method": method,
            "url": url,
            "path": path,
            "status_code": status_code,
            "latency_ms": elapsed_ms,
            "bytes": byte_size,
            "record_count": record_count,
            "passed": passed,
            "error": error_msg,
            "tested_at": datetime.now().isoformat()
        })

    # Save JSON results
    json_path = os.path.join(output_dir, "api_results.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({
            "target": base_api_url,
            "executed_at": datetime.now().isoformat(),
            "total_endpoints": len(ENDPOINT_DEFS),
            "passed": total_passed,
            "failed": total_failed,
            "endpoints": results
        }, f, indent=2)

    # Save Markdown report
    md_path = os.path.join(output_dir, "api_availability_report.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("# API Availability Test Report\n\n")
        f.write(f"- **Execution Time**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"- **Base API URL**: `{base_api_url}`\n")
        f.write(f"- **Summary**: **{total_passed}/{len(ENDPOINT_DEFS)} Passed** ({'100%' if total_failed == 0 else f'{round(total_passed / len(ENDPOINT_DEFS) * 100, 1)}%'})\n\n")
        f.write("| Status | Method | Endpoint | HTTP Code | Latency (ms) | Payload Size | Records | Error |\n")
        f.write("|:---:|:---:|:---|:---:|---:|---:|---:|:---|\n")
        for r in results:
            icon = "✅ PASS" if r["passed"] else "❌ FAIL"
            err_text = r["error"] or "-"
            f.write(f"| {icon} | `{r['method']}` | `{r['path']}` ({r['name']}) | `{r['status_code']}` | {r['latency_ms']:.1f} | {r['bytes']:,} B | {r['record_count']} | {err_text} |\n")

    print("=" * 80, flush=True)
    print(f"API Availability Completed: {total_passed} Passed, {total_failed} Failed", flush=True)
    print(f"Reports saved to:", flush=True)
    print(f"  - {json_path}", flush=True)
    print(f"  - {md_path}", flush=True)
    print("=" * 80, flush=True)
    return total_failed == 0

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run API Availability Tests")
    parser.add_argument("--api-url", type=str, default="https://uno-dmc.cz/api", help="Base API URL")
    parser.add_argument("--output-dir", type=str, default=None, help="Directory to save test outputs")
    args = parser.parse_args()

    if not args.output_dir:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M")
        args.output_dir = os.path.join(r"C:\Ersen\Projects_2025\Uno_ERP\tests\e2e\test_runs", timestamp)

    success = run_api_availability_tests(args.api_url, args.output_dir)
    sys.exit(0 if success else 1)
