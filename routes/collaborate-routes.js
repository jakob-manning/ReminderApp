const express = require('express');
const router = express.Router();

const collaborateController = require("../controller/collaborate_controller");

router.get("/", collaborateController.list);

router.post("/add/:id", collaborateController.add);

router.post("/remove/:id", collaborateController.remove);

module.exports = router;
