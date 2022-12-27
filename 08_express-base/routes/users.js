var express = require("express");
var router = express.Router();
const userController = require("../controller/userController");

const validator = require("../middleware/validator/userValidator");

/* GET users listing. */
router
  .post("/register", validator.register, userController.register)
  .get("/list", userController.list)
  .delete("/", userController.delete);

module.exports = router;
