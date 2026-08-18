---
name: youtube-transcript-harvest
description: >-
  Extract YouTube video and channel transcripts using yt-dlp for subtitle
  download and Whisper on Sparks for GPU-accelerated transcription of videos
  without captions.
  Use when the captain asks to harvest a YouTube channel, extract transcripts
  from specific videos, or turn video content into knowledge artifacts.
user-invocable: false
metadata:
  internal: true
---

# youtube-transcript-harvest

Extract full transcripts from YouTube videos and channels. Uses `yt-dlp` to
fetch built-in subtitles (handles YouTube's encryption properly), with Whisper
on Spark GPUs as fallback for videos without captions.

## Prerequisites

Install `yt-dlp` on the local machine (one-time):

```bash
brew install yt-dlp
# or: pipx install yt-dlp
```

Whisper is not installed locally -- it runs on Spark GPUs via SSH.

## Extract a single video transcript

### Method A: Video has captions (fastest, no GPU needed)

```bash
yt-dlp --write-auto-subs --sub-lang en --skip-download \
  --convert-subs srt -o "%(id)s" "https://youtube.com/watch?v=VIDEO_ID"

# Read the resulting .srt or .vtt file
cat "VIDEO_ID.en.vtt"
```

`--write-auto-subs` gets auto-generated captions, `--sub-lang en` picks English,
`--skip-download` avoids downloading the video file itself.

### Method B: Video has no captions (use Whisper on Spark)

```bash
# Download audio only
yt-dlp -x --audio-format mp3 -o "%(id)s.%(ext)s" \
  "https://youtube.com/watch?v=VIDEO_ID"

# Upload and transcribe on a Spark (Whisper + GPU)
scp "VIDEO_ID.mp3" spark-4511:/tmp/
ssh spark-4511 "whisper /tmp/VIDEO_ID.mp3 --model medium --output_dir /tmp/"

# Retrieve the transcript
scp spark-4511:"/tmp/VIDEO_ID.txt" ./
```

The Spark hosts and Whisper availability are in `data/learnings.md` under
"Infrastructure (Sparks on Tailscale)".

## Harvest a full channel

### Step 1: Get the channel's video list via RSS

```bash
# Get channel ID from the page
curl -sL "https://www.youtube.com/@CHANNELNAME" | python3 -c "
import sys, json, re
html = sys.stdin.read()
m = re.search(r'ytInitialData\s*=\s*({.*?});', html, re.DOTALL)
data = json.loads(m.group(1))
meta = data.get('metadata', {}).get('channelMetadataRenderer', {})
print('ID:', meta.get('externalId', 'unknown'))
print('Name:', meta.get('title', 'unknown'))
"

# Get RSS feed
curl -sL "https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID" \
  -o /tmp/yt-rss.xml

# Parse video IDs and titles
python3 -c "
import xml.etree.ElementTree as ET
tree = ET.parse('/tmp/yt-rss.xml')
root = tree.getroot()
ns = {'atom': 'http://www.w3.org/2005/Atom',
      'media': 'http://search.yahoo.com/mrss/'}
for entry in root.findall('atom:entry', ns):
    vid = entry.find('yt:videoId', ns).text
    title = entry.find('atom:title', ns).text
    url = entry.find('atom:link', ns).attrib.get('href', '')
    print(f'{vid} | {title}')
"
```

### Step 2: Filter to long-form videos only

Skip Shorts (under 60s). RSS feed includes all uploads. Check duration:

```bash
yt-dlp --print duration --skip-download "https://youtube.com/watch?v=VIDEO_ID"
```

### Step 3: Batch extract transcripts

```bash
for vid in VID1 VID2 VID3; do
  echo "=== $vid ==="
  yt-dlp --write-auto-subs --sub-lang en --skip-download \
    --convert-subs srt -o "%(id)s" "https://youtube.com/watch?v=$vid" 2>&1 | \
    tail -1
done
```

### Step 4: Combine into one readable file

```bash
for vid in VID1 VID2 VID3; do
  echo -e "\n\n## $vid\n"
  cat "${vid}.en.vtt" 2>/dev/null || echo "(no captions available)"
done > channel-transcript.txt
```

## Verify the transcript is real

After extraction, spot-check by searching for a key term from the video title:

```bash
grep -i "key-concept" "VIDEO_ID.en.vtt" | head -5
```

If the transcript is garbled, empty, or has only a few lines, fall back to
Method B (Whisper on Spark).

## Extract specific content for skill creation

Once you have a clean transcript, extract the methodology, framework, or
actionable steps the video teaches. Write the skill following the structure
of existing `.agents/skills/*/SKILL.md` files (YAML frontmatter with name,
description, user-invocable, metadata.internal, then markdown body).

Include a `## References` section at the bottom with the source video URL
so the skill's provenance is always clear.

## Notes

- `yt-dlp` handles YouTube's subtitle encryption -- the older
  `youtube-transcript-api` pipx package hits an endpoint that returns
  obfuscated data and should not be used.
- Rate limits: YouTube may throttle rapid requests. Add `sleep 2` between
  video fetches for large channel harvests.
- Whisper models: `medium` is a good balance of accuracy and speed on Spark
  hardware. Use `large-v3` for highest accuracy on important videos.
- Videos without any speech (music-only, silent demos) produce no useful
  transcript from either method.
