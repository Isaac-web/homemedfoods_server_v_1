const express = require("express");
const users = require("../controllers/users");
const errorHandler = require("../middleware/routeErrorHandler");
const validateId = require("../middleware/validateId");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/login", errorHandler(users.login));
router.post("/signup", [auth("admin")], errorHandler(users.createUser));
router.get("/", errorHandler(users.getUsers));
router.get("/:id", [validateId], errorHandler(users.getUser));
router.put("/:id", [validateId, auth("admin")], errorHandler(users.updateUser));
router.delete(
  "/:id",
  [validateId, auth("admin")],
  errorHandler(users.deleteUser)
);

module.exports = router;
