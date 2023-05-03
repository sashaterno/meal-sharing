const express = require("express");
const router = express.Router();
const knex = require("../database");

// GET - Returns all reviews http://localhost:3000/api/reviews

router.get("/", async (req, res) => {
    try {
        const getAllReviews = await knex.select("*").table("review");

        if (getAllReviews.length !== 0) {
            res.send(getAllReviews);
        } else {
            res.status(204).send("Reviews list is empty");
        }
    } catch (error) {
        res.status(500).json({ error: "Error" });
        throw error;
    }
});

// POST - Adds a new review to the database

router.post("/", async (req, res) => {
    try {
        const addNewReview = await knex("review").insert(req.body);
        if (addNewReview) {
            res.status(201).send("New review was added");
        } else {
            res.status(400).send("This review cant be added");
        }
    } catch (error) {
        res.status(500).json({ error: "Error" });
        throw error;
    }
});
// GET - Returns a review by id

router.get("/:id", async (req, res) => {
    try {
        const reviewById = await knex
            .select("*")
            .from("review")
            .where({ id: req.params.id });

        if (reviewById.length !== 0) {
            res.send(reviewById);
        } else {
            res.status(404).send(`The review with id ${req.params.id} is not found`);
        }
    } catch (error) {
        res.status(500).json({ error: "Error" });
        throw error;
    }
});

// PUT - Updates the review by id

router.put("/:id", async (req, res) => {
    try {
        const reviewById = await knex("review").where({ id: req.params.id });

        if (reviewById.length === 0) {
            res.status(404).send(`The review with id ${req.params.id} is not found`);
        } else {
            await knex("review").where({ id: req.params.id }).update(req.body);
            const updatedReview = await knex("review").where({ id: req.params.id });
            res.send(updatedReview);
        }
    } catch (error) {
        res.status(500).json({ error: "Error" });
        throw error;
    }
});

// DELETE - Deletes the review by id

router.delete("/:id", async (req, res) => {
    try {
        const reviewById = await knex("review").where({ id: req.params.id });

        if (reviewById.length === 0) {
            res.status(404).send(`The review with id ${req.params.id} is not found`);
        } else {
            await knex("review").where({ id: req.params.id }).del();
            res.send(`The review with id ${req.params.id} is deleted`);
        }
    } catch (error) {
        res.status(500).json({ error: "Error" });
        throw error;
    }
});
module.exports = router;