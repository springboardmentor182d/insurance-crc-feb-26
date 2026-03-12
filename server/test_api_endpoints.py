#!/usr/bin/env python
"""Test all API endpoints for Insurance CRC application"""

import urllib.request
import json
import sys

def main() -> int:
    base_url = "http://localhost:8000"
    endpoints = [
        "/admin/overview",
        "/admin/recent-activity",
        "/admin/users",
        "/catalog/policies",
    ]

    print("=" * 70)
    print("API ENDPOINT TESTING - Insurance CRC Dashboard")
    print("=" * 70)

    success_count = 0
    failure_count = 0

    for endpoint in endpoints:
        try:
            url = base_url + endpoint
            response = urllib.request.urlopen(url)
            data = json.loads(response.read().decode())

            print(f"\n[SUCCESS] GET {endpoint}")
            print(f"Status Code: {response.status}")

            if endpoint == "/admin/overview":
                print(f"  - Total Users: {data.get('total_users', 'N/A')}")
                print(f"  - Active Policies: {data.get('active_policies', 'N/A')}")
                print(f"  - Claims: {data.get('claims', 'N/A')}")
                print(f"  - Fraud Alerts: {data.get('fraud_alerts', 'N/A')}")
                success_count += 1

            elif endpoint == "/admin/recent-activity":
                activities = data.get('activities', [])
                total = data.get('total_count', 0)
                print(f"  - Total Activities in DB: {total}")
                print(f"  - Recent Activities Shown: {len(activities)}")
                if activities:
                    print("  - Latest Activities:")
                    for activity in activities[:2]:
                        print(f"      * {activity.get('action', 'N/A')}")
                        print(f"        {activity.get('description', 'N/A')[:60]}")
                success_count += 1

            elif endpoint == "/admin/users":
                users = data if isinstance(data, list) else []
                print(f"  - Total Users: {len(users)}")
                if users:
                    print("  - Users:")
                    for user in users[:3]:
                        print(f"      * {user.get('name', 'N/A')} ({user.get('email', 'N/A')})")
                success_count += 1

            elif endpoint == "/catalog/policies":
                policies = data if isinstance(data, list) else []
                print(f"  - Total Policies: {len(policies)}")
                if policies:
                    print("  - Sample Policies:")
                    for policy in policies[:2]:
                        print(f"      * {policy.get('name', 'N/A')} by {policy.get('provider', 'N/A')}")
                success_count += 1

        except Exception as e:
            print(f"\n[FAILED] GET {endpoint}")
            print(f"  - Error: {str(e)}")
            failure_count += 1

    print("\n" + "=" * 70)
    print(f"RESULTS: {success_count} Success | {failure_count} Failed")
    print("=" * 70)

    if failure_count == 0:
        print("\n✓ All API endpoints working correctly!")
        return 0

    print(f"\n✗ {failure_count} endpoint(s) failed - check server logs")
    return 1


if __name__ == "__main__":
    sys.exit(main())
