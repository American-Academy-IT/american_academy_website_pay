require("dotenv").config();
const { createServer } = require("http");

const app = require("./app");
const server = createServer(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
