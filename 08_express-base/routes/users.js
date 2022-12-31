var express = require("express");
var router = express.Router();
const userController = require("../controller/userController");

const validator = require("../middleware/validator/userValidator");
const { verifyToken } = require("../util/jwt");

/* GET users listing. */
router
  .post("/registers", validator.register, userController.register)
  .post("/logins", validator.login, userController.login)

  .get("/lists", verifyToken, userController.list)
  .put("/", verifyToken, validator.update, userController.update)

  .delete("/", userController.delete);

module.exports = router;
