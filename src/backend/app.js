const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const mealsRouter = require("./api/meals");
const buildPath = path.join(__dirname, "../../dist");
const port = process.env.PORT || 3000;
const cors = require("cors");
const knex = require("./database");

// For week4 no need to look into this!
// Serve the built client html
app.use(express.static(buildPath));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cors());

router.use("/meals", mealsRouter);

app.get("/my-route", (req, res) => {
  res.send("Hi friend");
});

//Respond with all meals in the future
app.get("/future-meals", async (req, res) => {
  try {
    const [result] = await knex.raw(
      "SELECT title, description FROM meal WHERE meal.when > NOW()"
    );
    res.send(result);
  } catch (error) {
    console.error(error.message);
    res.send("Error!");
  }
})

//Respond with all meals in the past
app.get("/past-meals", async (req, res) => {
  try {
    const [result] = await knex.raw(
      "SELECT title, description FROM meal WHERE meal.when < NOW()"
    );
    res.send(result);
  } catch (error) {
    console.error(error.message);
    res.send("Error!");
  }
})

//Respond with all meals sorted by ID
app.get("/all-meals", async (req, res) => {
  try {
    const [result] = await knex.raw(
      "SELECT title, description FROM meal ORDER BY id"
    );
    res.send(result);
  } catch (error) {
    console.error(error.message);
    res.send("Error!");
  }
})

//Respond with the first meal
app.get("/first-meal", async (req, res) => {
  try {
    const [result] = await knex.raw("SELECT * FROM meal ORDER BY id LIMIT 1");
    if (result.length === 0) {
      res.status(404).send("Meals is empty!");
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error.message);
    res.send("Error!");
  }
})

//Respond with the last meal
app.get("/last-meal", async (req, res) => {
  try {
    const [result] = await knex.raw(
      "SELECT * FROM meal ORDER BY id DESC LIMIT 1"
    );
    if (result.length === 0) {
      res.status(404).send("Meals is emmpty!");
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error(error.message);
    res.send("Error!");
  }
})

if (process.env.API_PATH) {
  app.use(process.env.API_PATH, router);
} else {
  throw "API_PATH is not set. Remember to set it in your .env file"
}

// for the frontend. Will first be covered in the react class
app.use("*", (req, res) => {
  res.sendFile(path.join(`${buildPath}/index.html`));
});

module.exports = app;
