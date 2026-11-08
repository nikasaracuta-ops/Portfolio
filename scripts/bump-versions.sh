#!/usr/bin/env bash
# Cache-busting: stamp each CSS/JS link in the pages (index.html and the project pages) with a short hash of the
# file's contents (?v=…), so browsers fetch fresh files after every change
# instead of mixing a new page with old cached styles/scripts.
# Run it before committing whenever a CSS or JS file in src/ changed.
set -euo pipefail
cd "$(dirname "$0")/.."
pages=(index.html dior.html type01.html moea.html miles.html)
for f in src/css/*.css src/js/*.js; do
  v=$(sha256sum "$f" | cut -c1-8)
  perl -pi -e "s#(href|src)=\"\Q$f\E(?:\?v=[0-9a-f]+)?\"#\$1=\"$f?v=$v\"#g" "${pages[@]}"
done
grep -ohE 'src/(css|js)/[a-z]+\.(css|js)\?v=[0-9a-f]+' "${pages[@]}" | sort | uniq -c
