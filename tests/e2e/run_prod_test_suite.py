"""
UNO ERP E2E Master Automation Runner
Coordinates Fold 1 (API Availability) and Fold 2 (Application UI).
Supports both Production (https://uno-dmc.cz) and Localhost (http://localhost:8000 & http://localhost:8001/api).
Creates designated/timestamped run directory:
  tests/e2e/test_runs/<RUN_ID>/
Collects visual evidence (screenshots), structured JSON results, and compiles a comprehensive RUN_REPORT.md.
"""

import os
import sys
import subprocess
import argparse
import json
from datetime import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_RUNS_DIR = os.path.join(BASE_DIR, "test_runs")

def generate_consolidated_report(run_dir: str, base_url: str, api_url: str, api_passed: bool, ui_passed: bool, duration_sec: float):
    api_json_path = os.path.join(run_dir, "api_results.json")
    ui_json_path = os.path.join(run_dir, "ui_test_results.json")

    api_data = {}
    if os.path.exists(api_json_path):
        try:
            with open(api_json_path, "r", encoding="utf-8") as f:
                api_data = json.load(f)
        except Exception:
            pass

    ui_data = {}
    if os.path.exists(ui_json_path):
        try:
            with open(ui_json_path, "r", encoding="utf-8") as f:
                ui_data = json.load(f)
        except Exception:
            pass

    overall_pass = api_passed and ui_passed
    report_path = os.path.join(run_dir, "RUN_REPORT.md")

    with open(report_path, "w", encoding="utf-8") as f:
        f.write(f"# UNO ERP Test Automation Run Report\n\n")
        f.write(f"- **Run ID / Folder**: `{os.path.relpath(run_dir, TEST_RUNS_DIR)}`\n")
        f.write(f"- **Executed At**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"- **Duration**: {duration_sec:.1f} seconds\n")
        f.write(f"- **Target Application**: [{base_url}]({base_url})\n")
        f.write(f"- **Target API**: [{api_url}]({api_url})\n")
        f.write(f"- **Overall Status**: {'🟢 **ALL TESTS PASSED (100%)**' if overall_pass else '🔴 **TESTS FAILED**'}\n\n")

        f.write("---\n\n")
        f.write("## 1. Executive Summary\n\n")
        f.write("| Test Fold | Scope | Passed | Failed | Status |\n")
        f.write("|:---|:---|:---:|:---:|:---:|\n")
        
        api_total = api_data.get("total_endpoints", 0)
        api_p = api_data.get("passed", 0)
        api_f = api_data.get("failed", 0)
        f.write(f"| **Fold 1: API Availability** | All Backend APIs | {api_p} | {api_f} | {'✅ PASS' if api_f == 0 and api_p > 0 else '❌ FAIL'} |\n")

        ui_metrics = ui_data.get("metrics", {})
        ui_total = ui_metrics.get("total", 0)
        ui_p = ui_metrics.get("passed", 0)
        ui_f = ui_metrics.get("failed", 0)
        f.write(f"| **Fold 2: Application UI** | Dashboard, Executive KPI, Projects, Tours (Tabs: Info, Cal, Svc, Book, Guide Sales, Inv), Master Data, AI KB, KPIs | {ui_p} | {ui_f} | {'✅ PASS' if ui_f == 0 and ui_p > 0 else '❌ FAIL'} |\n\n")

        f.write("---\n\n")
        f.write("## 2. Fold 1 - Backend API Availability Details\n\n")
        if "endpoints" in api_data:
            f.write("| Status | Method | Endpoint Name | Code | Latency (ms) | Records |\n")
            f.write("|:---:|:---:|:---|:---:|---:|---:|\n")
            for ep in api_data["endpoints"]:
                status_icon = "✅" if ep["passed"] else "❌"
                f.write(f"| {status_icon} | `{ep['method']}` | {ep['name']} | `{ep['status_code']}` | {ep['latency_ms']:.1f} | {ep['record_count']} |\n")
        else:
            f.write("No detailed API metrics available.\n")

        f.write("\n---\n\n")
        f.write("## 3. Fold 2 - Visual Evidence Screenshots\n\n")
        evidence_items = ui_data.get("evidence", [])
        if evidence_items:
            f.write("| # | Screenshot | Workflow / Screen Verification | Status |\n")
            f.write("|:---:|:---|:---|:---:|\n")
            for i, ev in enumerate(evidence_items, 1):
                f.write(f"| {i} | [{ev['filename']}](./{ev['filename']}) | {ev['description']} | ✅ Captured |\n")
        else:
            f.write("No screenshots recorded.\n")

        f.write("\n---\n\n")
        f.write("## 4. Run Artifacts Inventory\n\n")
        f.write(f"- Root Folder: `{run_dir}`\n")
        f.write(f"- API Results JSON: [`api_results.json`](./api_results.json)\n")
        f.write(f"- API Report Markdown: [`api_availability_report.md`](./api_availability_report.md)\n")
        f.write(f"- UI Results JSON: [`ui_test_results.json`](./ui_test_results.json)\n")
        f.write(f"- UI Report Markdown: [`app_ui_test_report.md`](./app_ui_test_report.md)\n")
        f.write(f"- Consolidated Report: [`RUN_REPORT.md`](./RUN_REPORT.md)\n")

    print(f"\nConsolidated Run Report generated: {report_path}", flush=True)

def run_test_suite(env: str = "prod", custom_folder: str = None, base_url: str = None, api_url: str = None):
    start_time = datetime.now()

    if env == "local":
        base_url = base_url or "http://localhost:8000"
        api_url = api_url or "http://localhost:8001/api"
    else:
        base_url = base_url or "https://uno-dmc.cz"
        api_url = api_url or "https://uno-dmc.cz/api"

    if custom_folder:
        # Normalize folder separators
        clean_folder = custom_folder.replace("/", os.sep).replace("\\", os.sep)
        run_dir = os.path.join(TEST_RUNS_DIR, clean_folder)
    else:
        timestamp = start_time.strftime("%Y%m%d_%H%M")
        run_dir = os.path.join(TEST_RUNS_DIR, timestamp)

    os.makedirs(run_dir, exist_ok=True)

    print("\n" + "=" * 80, flush=True)
    print(f"UNO ERP TEST SUITE RUNNER ({env.upper()})", flush=True)
    print(f"Target App: {base_url}", flush=True)
    print(f"Target API: {api_url}", flush=True)
    print(f"Output Directory: {run_dir}", flush=True)
    print("=" * 80 + "\n", flush=True)

    # Step 1: Run Fold 1 (API Availability)
    api_script = os.path.join(BASE_DIR, "test_prod_api_availability.py")
    print(f"▶ Executing Fold 1 (API Availability): {api_script}", flush=True)
    api_proc = subprocess.run([sys.executable, api_script, "--api-url", api_url, "--output-dir", run_dir])
    api_passed = (api_proc.returncode == 0)

    # Step 2: Run Fold 2 (Application UI)
    ui_script = os.path.join(BASE_DIR, "test_prod_app_ui.py")
    print(f"\n▶ Executing Fold 2 (Application UI): {ui_script}", flush=True)
    ui_proc = subprocess.run([sys.executable, ui_script, "--base-url", base_url, "--output-dir", run_dir])
    ui_passed = (ui_proc.returncode == 0)

    # Step 3: Consolidate Report
    duration = (datetime.now() - start_time).total_seconds()
    generate_consolidated_report(run_dir, base_url, api_url, api_passed, ui_passed, duration)

    overall_success = api_passed and ui_passed
    print("\n" + "=" * 80, flush=True)
    print(f"TEST RUN COMPLETE: {'SUCCESS (ALL PASSED)' if overall_success else 'COMPLETED WITH FAILURES'}", flush=True)
    print(f"Evidence Directory: {run_dir}", flush=True)
    print("=" * 80, flush=True)
    return overall_success

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Full Test Automation Suite")
    parser.add_argument("--env", type=str, default="prod", choices=["prod", "local"], help="Environment to target")
    parser.add_argument("--base-url", type=str, default=None, help="Base UI application URL")
    parser.add_argument("--api-url", type=str, default=None, help="Base backend API URL")
    parser.add_argument("--run-folder", type=str, default=None, help="Custom folder name under test_runs")
    args = parser.parse_args()

    success = run_test_suite(args.env, args.run_folder, args.base_url, args.api_url)
    sys.exit(0 if success else 1)
