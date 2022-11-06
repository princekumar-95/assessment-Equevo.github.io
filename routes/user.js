const express = require("express");
const router = express.Router();
// const auth = require("../middleware/auth");
const passport = require("passport");
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get(
  "/welcome",
  passport.authenticate("jwt", { session: false }),
  userController.welcome
);

router.post(
  "/create-todo",
  passport.authenticate("jwt", { session: false }),
  userController.CreateTodo
);

router.get("/todo", userController.GetAllTodo);
router.get("/todo/:id", userController.GetTodoById);
router.get("/todoByDate", userController.GetTodoByDate);
router.patch(
  "/update-todo/:id",
  passport.authenticate("jwt", { session: false }),
  userController.UpdateTodo
);
router.delete(
  "/delete-todo/:id",
  passport.authenticate("jwt", { session: false }),
  userController.DeleteTodo
);

module.exports = router;
