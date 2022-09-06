const { app } = require("./app");
require("dotenv").config();

const PORT = process.env.APP_PORT || 3000;
const HOSTNAME = process.env.APP_HOSTNAME || "localhost";

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
});
