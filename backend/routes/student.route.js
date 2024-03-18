const express = require("express")
const checkIfUserExists = require("../middlewares/checkIfUserExists.middleware.js")('Student')
const { signup, login, getStudent, refreshToken, logout}  = require("../controllers/student.controller.js")
const { verifyToken } = require("../middlewares/verifyToken.middleware.js")

const router = express.Router()
router.post("/signup", checkIfUserExists, signup) //signup
router.post("/login", checkIfUserExists, login) //login
router.post("/logout", logout) //login
router.get("/profile", verifyToken, getStudent) //getuser
router.get("/refresh", refreshToken) //getuser


module.exports = router
