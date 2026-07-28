#!/usr/bin/env bash
# file-epic.sh — Parse an epic.md file and create GitHub issues for every "## Issue #NNN" section.
#
# Usage:
#   ./file-epic.sh epic1_auth_db.md
#
# Pre-requisites:
#   gh auth login
#   Labels must exist on the repo (create them first if needed)

set -euo pipefail

EPIC_FILE="$1"
if [[ ! -f "$EPIC_FILE" ]]; then
  echo "Error: $EPIC_FILE not found."
  exit 1
fi

# Extract labels from the first issue metadata
# Format: **Epic:** <epic-name> | **Type:** <type> | **Priority:** P0-P4 | **Size:** S/M/L/XL
# We map these to GitHub labels: epic:auth, type:feat, priority:P0, size:M

epic_section=""
issue_title=""
issue_body=""
in_issue=false
body_lines=()

# Parse the markdown line-by-line
while IFS= read -r line; do
  if [[ "$line" =~ ^\#\#\ Issue\ #([0-9]{3}) ]]; then
    # Previous issue finished — file it if exists
    if [[ "$in_issue" == true && -n "$issue_title" ]]; then
      body_str=$(printf '%s\n' "${body_lines[@]}")

      # Extract labels from header line (the line after the title)
      header_line="${body_lines[0]}"
      epic_label=""
      type_label=""
      priority_label=""
      size_label=""
      if [[ "$header_line" =~ \*\*Epic:\*\*\ ([^|]+) ]]; then epic_label="${BASH_REMATCH[1]}"; epic_label=$(echo "$epic_label" | xargs); fi
      if [[ "$header_line" =~ \*\*Type:\*\*\ ([^|]+) ]]; then type_label="${BASH_REMATCH[1]}"; type_label=$(echo "$type_label" | xargs); fi
      if [[ "$header_line" =~ \*\*Priority:\*\*\ ([^|]+) ]]; then priority_label="${BASH_REMATCH[1]}"; priority_label=$(echo "$priority_label" | xargs); fi
      if [[ "$header_line" =~ \*\*Size:\*\*\ ([^|]+) ]]; then size_label="${BASH_REMATCH[1]}"; size_label=$(echo "$size_label" | xargs); fi

      labels="epic:${epic_label},type:${type_label},priority:${priority_label},size:${size_label}"

      echo "Creating issue: $issue_title"
      echo "$body_str" | gh issue create --title "$issue_title" --body - --label "$labels"

      # Reset
      body_lines=()
    fi

    # Start new issue
    issue_title="${line#\#\# }"
    in_issue=true
  elif [[ "$in_issue" == true ]]; then
    body_lines+=("$line")
  fi
done < "$EPIC_FILE"

# File the last issue
if [[ "$in_issue" == true && -n "$issue_title" ]]; then
  body_str=$(printf '%s\n' "${body_lines[@]}")
  header_line="${body_lines[0]}"
  epic_label=$(echo "$header_line" | sed -n 's/.*\*\*Epic:\*\* \([^|]*\).*/\1/p' | xargs)
  type_label=$(echo "$header_line" | sed -n 's/.*\*\*Type:\*\* \([^|]*\).*/\1/p' | xargs)
  priority_label=$(echo "$header_line" | sed -n 's/.*\*\*Priority:\*\* \([^|]*\).*/\1/p' | xargs)
  size_label=$(echo "$header_line" | sed -n 's/.*\*\*Size:\*\* \([^|]*\).*/\1/p' | xargs)
  labels="epic:${epic_label},type:${type_label},priority:${priority_label},size:${size_label}"

  echo "Creating issue: $issue_title"
  echo "$body_str" | gh issue create --title "$issue_title" --body - --label "$labels"
fi

echo "Done."
