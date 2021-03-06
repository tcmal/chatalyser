const express = require('express');
const { ClientCredentialsAuthProvider, ApiClient } = require('twitch');

const { getConfig, config } = require('./config');

const app = express();

// Connect twitch API
getConfig().then(x => {
  const authProvider = new ClientCredentialsAuthProvider(x.twitchClientId, x.twitchClientSecret);
  const apiClient = new ApiClient({ authProvider });

  app.set('apiClient', apiClient);
});

// Set up routes
app.use(express.static('public'));
require('./api')(app);


// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;