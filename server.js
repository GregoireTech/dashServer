const express = require('express');
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 8888;

const app = express();

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());

// Allow for cross origins
require('./routes/crossOriginsRoutes')(app);
// Setup the Auth routes
require('./routes/authRoutes')(app);
// Set the main route
require('./routes/dataRoutes')(app);

app.listen(PORT, () => {
    console.log('listening at : ' + PORT);
});