# Bulk QR Labels
Live page: https://aamirtechs.github.io/bulk-qr-labels/

Generate QR codes for an entire CSV, with filenames from your SKU or URL column, a print-ready label PDF, and an automatic decode-check that every code actually scans. Campaigns, packaging and events often need hundreds of unique codes, and this tool builds the whole batch locally with a scan check included.

## Features
- CSV, XLSX or pasted list input with encode-column and filename-column mapping
- URL template support with column placeholders for building each code from a row
- Error-correction level picker with a safe-size warning for logo overlays
- PNG and SVG ZIP export with a manifest.csv, plus an Avery label-sheet PDF
- Decode verification of every generated code with jsQR, with a failure report

## How it works
Upload or paste your rows, map the encode and filename columns, optionally add a URL template, then generate. Each code is rendered locally, collected into a ZIP with a manifest or laid out on a label sheet, and can be decode-checked before use. It runs entirely in the browser.

## Privacy
Runs 100% in your browser. Your files never leave this device, nothing is uploaded, and there is no tracking.

## Development
Core logic lives in `src/logic.js` and is shared by the page and the tests.
Run the tests with `npm test`.

## License
MIT, Copyright 2026 Amir Hussain.
