var express = require("express");
var router = express.Router();
const userController = require("../controller/userController");

const validator = require("../middleware/validator/userValidator");

/* GET users listing. */
router
  .post("/registers", validator.register, userController.register)
  .post("/logins", validator.login, userController.login)

  .get("/lists", userController.list)
  .delete("/", userController.delete);

module.exports = router;
