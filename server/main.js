const config = require('../config.json');
const server = require('./lib/server');
const web = require('./lib/web');





config.PORT = process.env.PORT || config.PORT;

server.run(config);
web.run(config);

