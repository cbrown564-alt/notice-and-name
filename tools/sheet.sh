#!/bin/sh
# Contact sheet of instruments, for reviewing the drawings side by side.
#   tools/sheet.sh <out.png> [dark] <concept-id>...
# Each concept's page is opened on the web host and its stage cropped out.
# Needs Python with Pillow. Scratch output: keep it under .exact/.
set -e
out="$1"; shift
scheme=light
if [ "$1" = "dark" ]; then scheme=dark; shift; fi
dir="$(dirname "$out")/sheet-$$"
mkdir -p "$dir"
for id in "$@"; do
  bun exact.mjs agent web --url "/atlas/$id" "clock data" "prefer prefers-color-scheme $scheme" "clock +1500" "screenshot $dir/$id.png" >/dev/null 2>&1 || echo "failed: $id"
done
python3 - "$out" "$dir" "$@" <<'PY'
import sys
from PIL import Image
out, d, ids = sys.argv[1], sys.argv[2], sys.argv[3:]
ims = [Image.open(f"{d}/{i}.png").crop((0, 56, 420, 700)) for i in ids]
sheet = Image.new("RGB", (420 * len(ims), 644), "white")
for n, im in enumerate(ims):
    sheet.paste(im, (420 * n, 0))
sheet.save(out)
PY
rm -rf "$dir"
