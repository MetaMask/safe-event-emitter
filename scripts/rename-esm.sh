#!/usr/bin/env bash

set -e
set -u
set -o pipefail

if [[ ${RUNNER_DEBUG:-0} == 1 ]]; then
  set -x
fi

for file in dist/esm/*.js; do
  # Rename the `.js` files to `.mjs`.
  mv "$file" "${file%.js}.mjs"

  # Replace the sourceMappingURL to point to the new `.mjs.map` file.
  sourceMap=$(basename "${file%.js}.mjs.map")
  sed -i '' "s|//# sourceMappingURL=.*\.js\.map|//# sourceMappingURL=$sourceMap|" "${file%.js}.mjs"
done

for file in dist/esm/*.js.map; do
  # Rename the `.js.map` files to `.mjs.map`.
  mv "$file" "${file%.js.map}.mjs.map"

  # Replace the file references in the source map to point to the new `.mjs` file.
  sed -i '' 's/\.js/\.mjs/g' "${file%.js.map}.mjs.map"
done
