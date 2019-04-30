const express = require('express');
require('./services/passport');

const PORT = process.env.PORT || 8888;

const app = express();

// Allow for cross origins
require('./routes/crossOriginsRoutes')(app);
// Setup the Auth routes
require('./routes/authRoutes')(app);
// Set the main route
require('./routes/dataRoutes')(app);

app.listen(PORT, () => {
    console.log('listening at : ' + PORT);
});