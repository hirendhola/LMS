const express = require("express")
const checkIfUserExists = require("../middlewares/checkIfUserExists.middleware.js")('Admin')
const { signup, login, getAdmin, refreshToken, logout}  = require("../controllers/admin.controller.js")
const { verifyToken } = require("../middlewares/verifyToken.middleware.js")

const router = express.Router()
router.post("/signup", checkIfUserExists, signup) //signup
router.post("/login", checkIfUserExists, login) //login
router.post("/logout", logout) //login
router.get("/profile", verifyToken, getAdmin) //getuser
router.get("/refresh", refreshToken) //getuser


module.exports = router
