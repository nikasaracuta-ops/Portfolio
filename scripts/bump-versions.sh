#!/usr/bin/env bash
# Cache-busting: stamp each CSS/JS link in index.html with a short hash of the
# file's contents (?v=…), so browsers fetch fresh files after every change
# instead of mixing a new page with old cached styles/scripts.
# Run it before committing whenever styles.css or a .js file changed.
set -euo pipefail
cd "$(dirname "$0")/.."
for f in styles.css popups.css loader.js about.js work.js main.js; do
  v=$(sha256sum "$f" | cut -c1-8)
  sed -i -E "s#(href|src)=\"${f//./\\.}(\?v=[0-9a-f]+)?\"#\1=\"$f?v=$v\"#" index.html
done
grep -oE '([a-z]+\.css|[a-z]+\.js)\?v=[0-9a-f]+' index.html
