const express = require("express");
const router = express.Router();
const knex = require("../database");
router.get("/", async (req, res) => {
  let selectedMeals = knex.select("meal.*").from("meal");

  // Returns all meals that are cheaper than maxPrice. (api/meals?maxPrice=90)

  if ("maxPrice" in req.query) {
    selectedMeals.where("price", "<=", req.query.maxPrice);
  }

  //Returns all meals that still have available spots left, if true.
  // If false, return meals that have no available spots left. (api/meals?availableReservations=true)

  if ("availableReservations" in req.query) {
    selectedMeals
      .innerJoin("reservation", "reservation.meal_id", "=", "meal.id")
      .groupBy("meal.id", "meal.title");
    if (req.query.availableReservations === "false") {
      selectedMeals.having(
        "meal.max_reservations",
        "<=",
        knex.raw("SUM(reservation.number_of_guests)")
      );
    } else {
      selectedMeals.having(
        "meal.max_reservations",
        ">",
        knex.raw("SUM(reservation.number_of_guests)")
      );
    }
  }

  // Returns all meals that partially match the given title.
  // Rød grød will match the meal with the title Rød grød med fløde. (api/meals?title=Indian%20platter)

  if ("title" in req.query) {
    const mealTitle = String(req.query.title).toLowerCase();
    selectedMeals.where("title", "like", `%${mealTitle}%`);
  }

  // Returns all meals where the date for when is after the given date. (api/meals?dateAfter=2022-10-01)

  if (req.query.dateAfter) {
    selectedMeals.where("when", ">", req.query.dateAfter);
  }

  // Returns all meals where the date for when is before the given date.  (api/meals?dateBefore=2022-08-08)

  if (req.query.dateBefore) {
    selectedMeals.where("when", "<", req.query.dateBefore);
  }

  // Returns the given number of meals. (api/meals?limit=7)

  if ("limit" in req.query) {
    selectedMeals.limit(req.query.limit);
  }
  // Returns all meals sorted by the given key. (api/meals?sortKey=price)
  // Returns all meals sorted in the given direction. (api/meals?sortKey=price&sortDir=desc)

  const sortedByKey = req.query.sortKey;
  const sortedByDirection = req.query.sortDir;
  if (["when", "max_reservavtions", "price"].includes(sortedByKey)) {
    if (sortedByDirection === "asc" || sortedByDirection === "desc") {
      selectedMeals.orderBy(sortedByKey, sortedByDirection);
    } else {
      selectedMeals.orderBy(sortedByKey);
    }
  }
  }
});