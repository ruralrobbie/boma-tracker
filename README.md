# Boma Tracker

A simple web app for tracking your cat's daily activities including feeding, litter box usage, and health events.

## Features

- **Feeding Log**: Track food portions and how much your cat ate
- **Litter Tracking**: Log poop (small/big) and pee events
- **Health Records**: Record vet visits, vaccines, medications, and weight
- **Charts**: Visualize feeding and litter activity over time
- **Multi-language**: English and Korean support
- **PWA**: Install as a mobile app
- **Sync**: Optional server sync for multi-device access

## Usage

### Local Only
Open `index.html` in a browser. Data is stored in localStorage.

### With Server Sync
1. Start the server:
   ```bash
   cd server
   npm install
   node server.js
   ```
2. Open the app and enter your server URL in Settings

## Tech Stack

- Vanilla HTML/CSS/JavaScript (no build step)
- Express.js backend (optional)
- Chart.js for visualizations

## License

MIT
