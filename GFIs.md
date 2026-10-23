# Good First Issues

## Add an Avery Zweckform 3666 template
Add this A4 label layout to the template table in src/logic.js.
Include a geometry test for labels per sheet and grid position count.

## Add SVG-only export option
Let users download a ZIP containing only SVG files plus the manifest.
Keep filenames identical to the PNG export so existing workflows do not break.

## Show a verification sample mode
Add a control to decode-verify only the first 20 codes for very large batches.
Report the sample size clearly in the verification summary line.
