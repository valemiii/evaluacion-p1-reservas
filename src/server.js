require("dotenv").config();
const app = require("./app.js");
const PORT = process.env.PUERTO || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
