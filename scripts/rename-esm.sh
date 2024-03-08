#!/usr/bin/env bash

set -e
set -u
set -o pipefail

if [[ ${RUNNER_DEBUG:-0} == 1 ]]; then
  set -x
fi

for file in dist/esm/*.js; do
  mv "$file" "${file%.js}.mjs"
done
