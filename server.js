const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());
// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Create a folder to store the bills if it doesn't exist
const billsFolder = path.join(__dirname, 'bills');
if (!fs.existsSync(billsFolder)) {
    fs.mkdirSync(billsFolder);
}

// Endpoint to save the bill data
app.post('/save-bill', (req, res) => {
    const { billNumber, content } = req.body;
    const now = new Date();
    const billDateTime = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0];
    // Convert bill data to a string (for simplicity)
    const billData = {
        
        BillNumber: billNumber,
        BillDate: billDateTime,
        content: content,
    };

    // Save the bill data to a JSON file
    const billFilePath = path.join(billsFolder, `bill_${billNumber}.json`);
    fs.writeFileSync(billFilePath, JSON.stringify(billData, null, 2));

    res.json({ message: 'Bill data saved successfully', billNumber: billNumber });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
