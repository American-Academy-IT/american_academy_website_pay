require('dotenv').config();
const { createServer } = require('http');

const app = require('./app');
const server = createServer(app);

const PORT = process.env.PORT || 5000;
const env = process.env.ENV;
server.listen(PORT, () => {
  console.log(`${env} server running on port http://localhost:${PORT}`);
});
