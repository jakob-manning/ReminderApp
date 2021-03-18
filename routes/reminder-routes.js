const express = require('express');

const reminderController = require("../controller/reminder_controller");

const router = express.Router();

router.get("/", reminderController.list);

router.get("/new", reminderController.new);

router.get("/:id", reminderController.listOne);

router.get("/:id/edit", reminderController.edit);

router.post("/", reminderController.create);

router.post("/update/:id", reminderController.update);

router.post("/delete/:id", reminderController.delete);


module.exports = router;