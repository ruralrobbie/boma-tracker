const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'boma-data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from parent directory (the webapp)
app.use(express.static(path.join(__dirname, '..')));

// Initialize data file if it doesn't exist
function initDataFile() {
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = {
            feedings: [],
            litter: [],
            weights: [],
            healthEvents: [],
            lastModified: new Date().toISOString()
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
        console.log('Created new data file:', DATA_FILE);
    }
}

// Read data from file
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return { feedings: [], litter: [], weights: [], healthEvents: [] };
    }
}

// Write data to file
function writeData(data) {
    data.lastModified = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ========== API Routes ==========

// Get all data
app.get('/api/data', (req, res) => {
    const data = readData();
    res.json(data);
});

// Replace all data (for sync)
app.put('/api/data', (req, res) => {
    try {
        writeData(req.body);
        res.json({ success: true, message: 'Data saved successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get last modified timestamp
app.get('/api/data/timestamp', (req, res) => {
    const data = readData();
    res.json({ lastModified: data.lastModified || null });
});

// ========== Feedings ==========

// Get all feedings
app.get('/api/feedings', (req, res) => {
    const data = readData();
    res.json(data.feedings || []);
});

// Add a feeding
app.post('/api/feedings', (req, res) => {
    const data = readData();
    const feeding = {
        ...req.body,
        id: Date.now().toString(),
        timestamp: req.body.timestamp || new Date().toISOString()
    };
    data.feedings.push(feeding);
    writeData(data);
    res.json(feeding);
});

// Delete a feeding
app.delete('/api/feedings/:id', (req, res) => {
    const data = readData();
    const index = data.feedings.findIndex(f => f.id === req.params.id);
    if (index !== -1) {
        data.feedings.splice(index, 1);
        writeData(data);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, error: 'Feeding not found' });
    }
});

// ========== Litter ==========

// Get all litter entries
app.get('/api/litter', (req, res) => {
    const data = readData();
    res.json(data.litter || []);
});

// Add a litter entry
app.post('/api/litter', (req, res) => {
    const data = readData();
    const litter = {
        ...req.body,
        id: Date.now().toString(),
        timestamp: req.body.timestamp || new Date().toISOString()
    };
    data.litter.push(litter);
    writeData(data);
    res.json(litter);
});

// Delete a litter entry
app.delete('/api/litter/:id', (req, res) => {
    const data = readData();
    const index = data.litter.findIndex(l => l.id === req.params.id);
    if (index !== -1) {
        data.litter.splice(index, 1);
        writeData(data);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, error: 'Litter entry not found' });
    }
});

// ========== Weights ==========

// Get all weights
app.get('/api/weights', (req, res) => {
    const data = readData();
    res.json(data.weights || []);
});

// Add a weight entry
app.post('/api/weights', (req, res) => {
    const data = readData();
    const weight = {
        ...req.body,
        id: Date.now().toString(),
        timestamp: req.body.timestamp || new Date().toISOString()
    };
    data.weights.push(weight);
    writeData(data);
    res.json(weight);
});

// Delete a weight entry
app.delete('/api/weights/:id', (req, res) => {
    const data = readData();
    const index = data.weights.findIndex(w => w.id === req.params.id);
    if (index !== -1) {
        data.weights.splice(index, 1);
        writeData(data);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, error: 'Weight entry not found' });
    }
});

// ========== Health Events ==========

// Get all health events
app.get('/api/health', (req, res) => {
    const data = readData();
    res.json(data.healthEvents || []);
});

// Add a health event
app.post('/api/health', (req, res) => {
    const data = readData();
    const event = {
        ...req.body,
        id: Date.now().toString(),
        timestamp: req.body.timestamp || new Date().toISOString()
    };
    data.healthEvents.push(event);
    writeData(data);
    res.json(event);
});

// Delete a health event
app.delete('/api/health/:id', (req, res) => {
    const data = readData();
    const index = data.healthEvents.findIndex(e => e.id === req.params.id);
    if (index !== -1) {
        data.healthEvents.splice(index, 1);
        writeData(data);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, error: 'Health event not found' });
    }
});

// ========== Backup & Export ==========

// Export data as downloadable JSON
app.get('/api/export', (req, res) => {
    const data = readData();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=boma-backup-${new Date().toISOString().split('T')[0]}.json`);
    res.json(data);
});

// Import data from JSON
app.post('/api/import', (req, res) => {
    try {
        const importedData = req.body;
        // Validate structure
        if (!importedData.feedings) importedData.feedings = [];
        if (!importedData.litter) importedData.litter = [];
        if (!importedData.weights) importedData.weights = [];
        if (!importedData.healthEvents) importedData.healthEvents = [];

        writeData(importedData);
        res.json({ success: true, message: 'Data imported successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// ========== Server Info ==========

app.get('/api/info', (req, res) => {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    const addresses = [];

    for (const [name, nets] of Object.entries(networkInterfaces)) {
        for (const net of nets) {
            if (net.family === 'IPv4' && !net.internal) {
                addresses.push({ interface: name, address: net.address });
            }
        }
    }

    res.json({
        name: 'Boma Tracker Server',
        version: '1.0.0',
        port: PORT,
        addresses: addresses,
        dataFile: DATA_FILE
    });
});

// ========== Start Server ==========

initDataFile();

app.listen(PORT, '0.0.0.0', () => {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();

    console.log('\n🐈‍⬛ Boma Tracker Server Started!\n');
    console.log(`Local:    http://localhost:${PORT}`);

    // Show all network addresses
    for (const [name, nets] of Object.entries(networkInterfaces)) {
        for (const net of nets) {
            if (net.family === 'IPv4' && !net.internal) {
                console.log(`Network:  http://${net.address}:${PORT}  (${name})`);
            }
        }
    }

    console.log(`\nData file: ${DATA_FILE}`);
    console.log('\nShare the Network URL with other devices on your home network!');
    console.log('Press Ctrl+C to stop the server.\n');
});
