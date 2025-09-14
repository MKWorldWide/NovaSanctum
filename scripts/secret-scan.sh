#!/usr/bin/env bash
set -euo pipefail

# Scan staged changes for common secret patterns
FILES=$(git diff --cached --name-only --diff-filter=ACM | tr '\n' ' ')

if [ -z "$FILES" ]; then
  exit 0
fi

PATTERNS=(
  'github_pat_'                           # GitHub PAT
  'AKIA[0-9A-Z]{16}'                      # AWS Access Key ID
  'ASIA[0-9A-Z]{16}'                      # AWS Temp Access Key
  'SECRET_ACCESS_KEY'                     # AWS Secret Key variable
  'xox[baprs]-[0-9A-Za-z-]+'              # Slack token
  '-----BEGIN [A-Z ]*PRIVATE KEY-----'    # PEM private key
  'BEGIN OPENSSH PRIVATE KEY'             # OpenSSH key
  'NPM_TOKEN'                             # npm token
  'SENTRY_AUTH_TOKEN'                     # Sentry token
)

FOUND=0
for file in $FILES; do
  if [ ! -f "$file" ]; then continue; fi
  for pat in "${PATTERNS[@]}"; do
    if grep -E -I -n "$pat" "$file" >/dev/null 2>&1; then
      echo "Potential secret detected in $file (pattern: $pat)"
      FOUND=1
    fi
  done
done

if [ $FOUND -eq 1 ]; then
  echo "\nPlease remove or redact secrets before committing."
  exit 2
fi

exit 0

