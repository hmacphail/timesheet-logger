const express = require("express")
const compression = require("compression")
const path = require("path")
const PORT = process.env.PORT || 5000

const app = express();

// static pages
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

// parse incoming reqs with JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// api routes
app.use("/api", require("./server/routes"));

// start app on PORT
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
