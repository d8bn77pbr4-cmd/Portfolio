#!/usr/bin/env bash
# Baut alles nach einer Änderung an index.html: Fassung ohne YouTube, Artifact-Dateien, beide PDFs.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 tools/variant.py
./tools/build-artifact.sh
node tools/build-pdf.js
