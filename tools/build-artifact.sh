#!/usr/bin/env bash
# Erzeugt die Fassungen für die beiden Claude-Artifacts (mit und ohne YouTube).
# Das Artifact legt selbst <!doctype>, <html>, <head> und <body> an,
# deshalb werden nur diese Rahmenzeilen entfernt. Alles andere bleibt gleich.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p build
build() {
  grep -v -x -E '<!doctype html>|<html lang="de">|<head>|</head>|<body>|</body>|</html>|<meta charset="utf-8">|<meta name="viewport" content="[^"]*">' "$1" > "$2"
  echo "$2"
}
build index.html build/artifact.html
build ohne-youtube.html build/artifact-ohne-youtube.html
