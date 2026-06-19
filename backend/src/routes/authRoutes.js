const express = require("express");
const router = express.Router();

const {register, login, getCurrentUser} = require("../controllers/authController");
const authenticateUser = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {registerSchema, loginSchema} = require("../validators/authSchemas");

router.post("/register", validateRequest(registerSchema), register);

router.post("/login", validateRequest(loginSchema), login);
router.get("/me", authenticateUser, getCurrentUser);


module.exports = router;
