const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  createUser,
  loginUser,
} = require("../controllers/LoginSignupController");
const { queryingFromRag } = require("../controllers/connectRag");

// signup route
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("password", "Password must be at least 5 characters long").isLength({
      min: 5,
    }),
  ],
  createUser
);

// login route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("password", "Password must be at least 5 characters long").isLength({
      min: 5,
    }),
  ],
  loginUser
);


// query route
router.post("/something", queryingFromRag);

module.exports = router;
