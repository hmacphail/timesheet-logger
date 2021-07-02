const express = require("express")
const compression = require("compression")
const path = require("path")
const PORT = process.env.PORT || 5000

const app = express();

// static pages
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

// api routes
app.use("/api", require("./server/routes"));

// start app on PORT
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
