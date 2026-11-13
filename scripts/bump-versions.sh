#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
pages=(index.html dior.html type01.html moea.html miles.html)
for f in src/css/*.css src/js/*.js; do
  v=$(sha256sum "$f" | cut -c1-8)
  perl -pi -e "s#(href|src)=\"\Q$f\E(?:\?v=[0-9a-f]+)?\"#\$1=\"$f?v=$v\"#g" "${pages[@]}"
done
grep -ohE 'src/(css|js)/[a-z]+\.(css|js)\?v=[0-9a-f]+' "${pages[@]}" | sort | uniq -c
