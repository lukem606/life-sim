const express = require("express");
const Game = require("./index.js");

const PORT = process.env.PORT || 8606;
const app = express();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
