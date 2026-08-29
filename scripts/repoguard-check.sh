#!/usr/bin/env bash
# RepoGuard machine check.
#
# Deterministic, dependency-free checks that back the governance rules in
# .github/REPOGUARD.md. Deliberately small: this repo has no build step,
# package manager, or test framework, so this does not introduce one.
#
# Usage: scripts/repoguard-check.sh
# Optional env vars (set by CI): REPOGUARD_BASE_SHA, REPOGUARD_HEAD_SHA
# to enable the sensitive-path annotation.

set -euo pipefail
cd "$(dirname "$0")/.."

status=0

echo "== RepoGuard: governance files present =="
for f in .github/REPOGUARD.md AGENTS.md; do
  if [ ! -f "$f" ]; then
    echo "FAIL: missing required governance file: $f"
    status=1
  else
    echo "OK: $f present"
  fi
done

echo
echo "== RepoGuard: JavaScript syntax =="
js_fail=0
while IFS= read -r -d '' f; do
  if ! node --check "$f" 2>&1; then
    js_fail=1
  fi
done < <(find . -path ./node_modules -prune -o -name '*.js' -print0)
if [ "$js_fail" -ne 0 ]; then
  echo "FAIL: one or more .js files failed to parse"
  status=1
else
  echo "OK: all .js files parse"
fi

echo
echo "== RepoGuard: HTML parses =="
if command -v python3 >/dev/null 2>&1; then
  python3 - <<'PY'
import glob, sys
from html.parser import HTMLParser

errors = 0
for f in glob.glob("**/*.html", recursive=True):
    try:
        with open(f, encoding="utf-8") as fh:
            HTMLParser().feed(fh.read())
    except Exception as e:
        print(f"FAIL {f}: {e}")
        errors += 1
if errors:
    sys.exit(1)
print(f"OK: all HTML files parse")
PY
  if [ $? -ne 0 ]; then status=1; fi
else
  echo "SKIP: python3 not available"
fi

echo
echo "== RepoGuard: sensitive-path check (informational) =="
SENSITIVE_PATHS="js/auth.js js/attendance.js js/StorageService.js admin/payroll.html"
if [ -n "${REPOGUARD_BASE_SHA:-}" ] && [ -n "${REPOGUARD_HEAD_SHA:-}" ]; then
  changed=$(git diff --name-only "$REPOGUARD_BASE_SHA" "$REPOGUARD_HEAD_SHA" -- data || true)
  changed="$changed
$(git diff --name-only "$REPOGUARD_BASE_SHA" "$REPOGUARD_HEAD_SHA" 2>/dev/null || true)"
  flagged=""
  for p in $SENSITIVE_PATHS; do
    if echo "$changed" | grep -qx "$p"; then
      flagged="$flagged $p"
    fi
  done
  if echo "$changed" | grep -q '^data/'; then
    flagged="$flagged data/*"
  fi
  if [ -n "$flagged" ]; then
    echo "NOTICE: this change touches sensitive path(s):$flagged"
    echo "        RepoGuard requires explicit owner approval for auth/RBAC,"
    echo "        business-logic, or data-layer changes. This is a flag for"
    echo "        reviewer attention, not a blocking failure."
  else
    echo "OK: no sensitive paths touched"
  fi
else
  echo "SKIP: REPOGUARD_BASE_SHA/REPOGUARD_HEAD_SHA not set (not running in PR context)"
fi

echo
if [ "$status" -eq 0 ]; then
  echo "RepoGuard: PASS"
else
  echo "RepoGuard: FAIL"
fi
exit "$status"
