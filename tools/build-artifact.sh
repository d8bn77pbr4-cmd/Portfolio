#!/usr/bin/env bash
# Erzeugt aus index.html die Fassung für das Claude-Artifact.
# Das Artifact legt selbst <!doctype>, <html>, <head> und <body> an,
# deshalb werden nur diese Rahmenzeilen entfernt. Alles andere bleibt gleich.
set -euo pipefail
cd "$(dirname "$0")/.."
out="${1:-build/artifact.html}"
mkdir -p "$(dirname "$out")"
grep -v -x -E '<!doctype html>|<html lang="de">|<head>|</head>|<body>|</body>|</html>|<meta charset="utf-8">|<meta name="viewport" content="[^"]*">' index.html > "$out"
echo "$out"
