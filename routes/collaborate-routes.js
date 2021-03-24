const express = require('express');
const router = express.Router();

const collaborateController = require("../controller/collaborate_controller");

router.get("/", collaborateController.list);

module.exports = router;
