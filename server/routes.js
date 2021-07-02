const express = require("express");
const router = express();

const db = require("./models");

// Get a list of all time entries
router.get("/timeEntry", async (req, res) => {
  try {
    const results = await db.TimeEntry.findAll();
    res.send(results);
  }
  catch (err) {
    console.error(err);
    res.status(500).send({
      message: err
    });
  }
});

// Create a new time entry
router.post("/timeEntry", async (req, res) => {
  try {
    const results = await db.TimeEntry.create(req.body);
    if (results) {
      res.send({
        message: "Operation Successful",
        results: results
      });
    }
    else {
      throw new Error("Failed to create Time Entry");
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).send({
      message: err
    });
  }
});

module.exports = router;
