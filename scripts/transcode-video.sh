#!/usr/bin/env bash
# Transcode concept videos to H.264 MP4 for in-app use.
# Target: ≤1.5 MB, 720p max, 8–12s loops, no audio by default.
#
# Usage:
#   ./scripts/transcode-video.sh input.mov [output.mp4]
#   ./scripts/transcode-video.sh assets/videos/originals/*.mov

set -euo pipefail

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required. Install with: brew install ffmpeg" >&2
  exit 1
fi

transcode_one() {
  local input="$1"
  local output="${2:-${input%.*}.mp4}"

  if [[ ! -f "$input" ]]; then
    echo "Skip (not found): $input" >&2
    return 1
  fi

  echo "Transcoding: $input -> $output"
  ffmpeg -y -i "$input" \
    -an \
    -vf "scale='min(1280,iw)':-2:flags=lanczos,scale='min(720,ih)':-2" \
    -c:v libx264 \
    -preset slow \
    -crf 28 \
    -movflags +faststart \
    -pix_fmt yuv420p \
    "$output"

  local bytes
  bytes=$(wc -c <"$output" | tr -d ' ')
  echo "  Output: $output ($(numfmt --to=iec-i --suffix=B "$bytes" 2>/dev/null || echo "${bytes} bytes"))"
  if [[ "$bytes" -gt 1572864 ]]; then
    echo "  Warning: file exceeds 1.5 MB budget; try -crf 30 or shorter trim." >&2
  fi
}

if [[ $# -eq 0 ]]; then
  echo "Usage: $0 <input.mov|mp4> [output.mp4]" >&2
  exit 1
fi

for arg in "$@"; do
  if [[ -d "$arg" ]]; then
    for f in "$arg"/*.{mov,MOV,mp4,MP4}; do
      [[ -e "$f" ]] || continue
      transcode_one "$f"
    done
  else
    transcode_one "$arg" "${2:-}"
  fi
done
