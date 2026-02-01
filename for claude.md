# Boma Tracker - Context for Claude

## Project Overview
A cat tracking web app for logging feeding, litter box usage, and health events. "Boma" is the cat's name.

## Tech Stack
- Single-page app: all in `index.html` (HTML + CSS + JS, no build step)
- Optional Express.js backend in `server/` for multi-device sync
- Chart.js for visualizations
- PWA-enabled (installable on mobile)
- Bilingual: English and Korean

## Key Files
- `index.html` - The entire frontend app (HTML, CSS, JS all inline)
- `server/server.js` - Optional sync server
- `favicon.ico`, `icon-192.png`, `icon-512.png` - App icons
- `manifest.json` - PWA manifest

## Important Code Locations in index.html
- **CSS styles**: Lines ~50-500
- **Litter buttons HTML**: Lines ~940-960
- **Translations object**: Lines ~1044 (English), ~1121 (Korean)
- **logLitter() function**: Lines ~1665
- **updateLitterDisplay() function**: Lines ~1689

## Litter Tracking Details
- Two poop buttons: Small Poo (<2cm) logs `value: 1`, Big Poo (>2cm) logs `value: 2`
- One pee button
- Poop count sums values (big poo counts as 2)
- Data structure: `{ type: "poop"|"pee", value: 1|2, timestamp: "ISO string" }`

## Deployment

### GitHub
- Repo: https://github.com/ruralrobbie/boma-tracker.git
- Branch: main
- Just `git push` from local

### Server
- Host: 157.180.87.209
- User: clawdbot
- Password: clawdbot
- App location: ~/boma-tracker

### Deploy Command (run from project root)
```bash
git push && python3 -c "
import subprocess
proc = subprocess.Popen(
    ['ssh', '-o', 'StrictHostKeyChecking=no', 'clawdbot@157.180.87.209', 'cd ~/boma-tracker && git pull'],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)
stdout, stderr = proc.communicate(input=b'clawdbot\n', timeout=30)
print(stdout.decode())
print(stderr.decode())
"
```

Note: sshpass and expect are not installed locally, so use the Python subprocess method above for SSH with password.

## Recent Changes (Feb 2026)
1. Split poop button into Small Poo (<2cm) and Big Poo (>2cm)
2. Small poo logs value=1, big poo logs value=2
3. Poop buttons stacked vertically, together matching pee button size
4. Poop count sums values (so big poo counts as 2)
5. Added README.md
6. Updated icons with transparent background version

## Translation Keys for Litter
- `smallPoop`: "Small Poo (<2cm)" / "작은 똥 (<2cm)"
- `bigPoop`: "Big Poo (>2cm)" / "큰 똥 (>2cm)"
