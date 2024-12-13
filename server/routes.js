// Import required modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const os = require('os');
const router = express.Router();

// Metadata handling
const platform = os.platform();
const metadataFile = platform === 'win32' ? 'metadata_windows.xlsx' : 'metadata_linux.xlsx';
const metadataPath = path.join(__dirname, '..', 'database', metadataFile);
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
} catch (error) {
    console.error('Error loading metadata:', error);
}
const defaultFile = Object.keys(fileMapping)[0];

// Utility functions
function formatTableData(df) {
    return df.map(row => {
        const formattedRow = Object.fromEntries(
            Object.entries(row).map(([key, value]) => {
                if (typeof value === 'string') {
                    return [key, value.replace(/\n/g, '<br>')];
                }
                return [key, value];
            })
        );
        return formattedRow;
    });
}

function generateTableHtml(data) {
    if (data.length === 0) return '<table><tr><td>No data available</td></tr></table>';
    return data.map(row => {
        const cells = Object.values(row).map(value => `<td>${value || ''}</td>`).join('');
        return `<tr>${cells}</tr>`;
    }).join('');
}

// Routes
router.get('/', (_req, res) => {
    const filePath = path.join(__dirname, '..', 'database', defaultFile);
    if (fs.existsSync(filePath)) {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let df = xlsx.utils.sheet_to_json(sheet);
        if (df.length > 0) {
            df = formatTableData(df);
            const headers = Object.keys(df[0]);
            const tableHtml = generateTableHtml(df);
            res.render('table_view', { fileMapping, table: tableHtml, headers });
        } else {
            res.render('table_view', { fileMapping, table: '<p>No data available in the default file</p>', headers: [] });
        }
    } else {
        res.render('table_view', { fileMapping, table: '<p>Error: Default file not found</p>', headers: [] });
    }
});

router.post('/view', (req, res) => {
    const { file, search = '' } = req.body;
    const filePath = path.join(__dirname, '..', 'database', file);
    if (!fs.existsSync(filePath)) {
        return res.render('table_view', { fileMapping, table: '<p>Error: File not found</p>', headers: [] });
    }
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let df = xlsx.utils.sheet_to_json(sheet);
        if (search) {
            const lowerSearch = search.toLowerCase();
            df = df.filter(row =>
                Object.values(row).some(value =>
                    value.toString().toLowerCase().includes(lowerSearch)
                )
            );
        }
        if (df.length > 0) {
            df = formatTableData(df);
            const headers = Object.keys(df[0]);
            const tableHtml = generateTableHtml(df);
            return res.json({ headers, table: tableHtml });
        } else {
            res.render('table_view', { fileMapping, table: '<p>No matching data found</p>', headers: [] });
        }
    } catch (error) {
        res.render('table_view', { fileMapping, table: '<p>Error processing the file</p>', headers: [] });
    }
});

router.get('/freerouting/*', (req, res) => {
    const filePath = path.join(__dirname, '..', 'templates', 'ai-manifest', req.params[0] + '.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('<p>File not found</p>');
    }
});

router.get('/viewmagic', (_req, res) => {
    const databaseList = ["Blade", "Shot", "Magic", "Support"]; // List of database names
    res.render('skills', { databaseList }); // Pass the database list to the template
});

// Endpoint to handle the dynamic rendering
router.post('/viewmagic2', async (req, res) => {
    const { file } = req.body;

    try {
        const filePath = path.join(__dirname, '..', 'database', 's2', file + '.ejs');
        if (!fs.existsSync(filePath)) {
            console.log("Error finding EJS file: " + file);
            res.status(500).send({ error: "An unexpected error occurred." });
        }
        else
        {
            console.log("Found "+file)
                // Render the EJS file from the specified path
            res.render(filePath, { layout: false}, (err, html) => {
                if (err) {
                    console.log("Error rendering EJS file:", err);
                    return res.status(500).send({ error: "Failed to load content." });
                }
                res.send({ content: html });
        });
        }

    } catch (error) {
        console.log("Error handling request:", error);
        res.status(500).send({ error: "An unexpected error occurred." });
    }
});

router.get('/health', (_req, res) => {
    res.status(200).send('Server is healthy');
});

router.post('/rangesearch', (req, res) => {
    const { min, max } = req.body;
    const filePath = path.join(__dirname, '..', 'database', defaultFile);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let df = xlsx.utils.sheet_to_json(sheet);
        df = df.filter(row => {
            const values = Object.values(row).map(v => parseFloat(v));
            return values.some(value => value >= min && value <= max);
        });
        if (df.length > 0) {
            res.json({ data: df });
        } else {
            res.status(404).json({ error: 'No data found within the range' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error processing the file' });
    }
});

router.get('/rangesearch', (_req, res) => {
    const databaseList = ["Boss", "Miniboss", "NormalMonsters"]; // List of database names
    res.render('rangesearch', { results: [], databaseList }); // Pass the database list to the template
});

router.get('/files', (_req, res) => {
    const filesDir = path.join(__dirname, '..', 'database');
    const downloadableFiles = [];

    // Recursive function to gather all .xlsx and .json files from subdirectories
    function findFilesRecursively(directory) {
        console.log(`Searching in directory: ${directory}`);
        const items = fs.readdirSync(directory, { withFileTypes: true });
        items.forEach(item => {
            const fullPath = path.join(directory, item.name);
            if (item.isDirectory()) {
                findFilesRecursively(fullPath); // Recurse into subdirectory
            } else if (item.isFile() && (item.name.endsWith('.xlsx') || item.name.endsWith('.json'))) {
                console.log(`Found file: ${fullPath}`);
                downloadableFiles.push({
                    name: path.relative(filesDir, fullPath), // Relative path for URL
                    displayName: fileMapping[item.name] || item.name // Display name or filename fallback
                });
            }
        });
    }

    // Start the recursive search
    findFilesRecursively(filesDir);

    // Debug output to check what files were added
    console.log("Files found for download:", downloadableFiles);

    res.render('file_list', { downloadableFiles });
});

router.get('/download/:file', (req, res) => {
    const file = req.params.file;
    const filePath = path.join(__dirname, '..', 'database', file);

    if (fs.existsSync(filePath)) {
        res.download(filePath, file, (err) => {
            if (err) {
                console.error("Error downloading file:", err);
            }
        });
    } else {
        res.status(404).send("<p>Error: File not found</p>");
    }
});

module.exports = router;
