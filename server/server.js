const express = require('express');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const app = express();
const platform = require('os').platform;
const bodyParser = require('body-parser');

// Use EJS for templating
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../templates'));  // Path to EJS templates

// Static folder for images
app.use('/images', express.static(path.join(__dirname, '../images')));

// Body parser middleware to handle POST data
app.use(bodyParser.urlencoded({ extended: true }));  // For form data
app.use(bodyParser.json());  // For JSON data

// Log incoming requests for debugging
app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request for: ${req.url}`);
    console.log('Request body:', req.body);  // Log body for POST requests
    next();
});

// Determine metadata file based on OS
const metadataFile = platform() === 'win32' ? 'metadata_windows.xlsx' : 'metadata_linux.xlsx';
const metadataPath = path.join(__dirname, '../database', metadataFile);  // Update path for database

console.log(`Metadata file: ${metadataFile}`);
console.log(`Metadata path: ${metadataPath}`);

// Load metadata
let fileMapping = {};
try {
    const workbook = xlsx.readFile(metadataPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    fileMapping = data.reduce((acc, row) => {
        acc[row.filepath] = row.display_name;
        return acc;
    }, {});
    console.log('Metadata loaded successfully');
} catch (error) {
    console.error('Error loading metadata:', error);
}

app.get('/', (req, res) => {
    console.log('GET request to "/"');
    res.render('table_view', { fileMapping, table: '', headers: [] });  // Render initial state
});

// Apply <br> for newlines in string values
function formatTableData(df) {
    return df.map(row => {
        return Object.fromEntries(
            Object.entries(row).map(([key, value]) => {
                if (typeof value === 'string') {
                    // Replace \n with <br> for HTML rendering
                    return [key, value.replace(/\n/g, '<br>')];
                }
                return [key, value];
            })
        );
    });
}

app.post('/view', (req, res) => {
    const { file, search = '' } = req.body;
    const filePath = path.join(__dirname, '../database', file);

    if (!fs.existsSync(filePath)) {
        return res.render('table_view', { fileMapping, table: "<p>Error: File not found</p>", headers: [] });
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    let df = xlsx.utils.sheet_to_json(sheet);

    // Apply search query if provided
    if (search) {
        df = df.filter(row => Object.values(row).some(value => value.toString().toLowerCase().includes(search.toLowerCase())));
    }

    // Format the table data to replace \n with <br> in strings
    df = formatTableData(df);

    // Extract headers
    const headers = Object.keys(df[0]);

    // Convert data to HTML table
    const tableHtml = generateTableHtml(df);

    // Render EJS template with the data
    res.render('table_view', { fileMapping, table: tableHtml, headers });
});


// Function to generate HTML table from data
function generateTableHtml(data) {
    let table = '';
    data.forEach(row => {
        table += '<tr>';
        Object.values(row).forEach(value => {
            table += `<td>${value}</td>`;
        });
        table += '</tr>';
    });
    return table;
}
// Apply <br> for newlines in string values
function formatTableData(df) {
    return df.map(row => {
        return Object.fromEntries(
            Object.entries(row).map(([key, value]) => {
                if (typeof value === 'string') {
                    // Replace \n with <br> for HTML rendering
                    return [key, value.replace(/\n/g, '<br>')];
                }
                return [key, value];
            })
        );
    });
}
// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
