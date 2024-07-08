const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("password", "Password must be at least 5 characters long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      await User.create({
        email: email,
        password: password,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Failed to create User", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: "Incorrect email address" });
    }

    
    if (!password === user.password) {
      return res.status(400).json({ errors: "Incorrect password" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to login", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
