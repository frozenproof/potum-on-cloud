const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const routes = require('./routes'); // Adjust the path as needed

function initiate()
{
    // Use EJS for templating
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'templates'));
    app.set('views', path.join(__dirname, '..', 'templates', 'ai-manifest'));

    // Static folder for images
    app.use('/images', express.static(path.join(__dirname, '..', 'images')));
    app.use('/templates', express.static(path.join(__dirname, '..', 'templates')));
    // but you do not need to do this database, because it get processed at server directory

    // Body parser middleware to handle POST data 
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Log incoming requests for debugging
    app.use((req, _res, next) => {
        console.log(`Incoming ${req.method} request for: ${req.url}`);
        console.log('Request body:', req.body);
        next();
    });
}

initiate()
// Use the routes
app.use('/', routes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Welcum back what the fuck do u want`);
});
