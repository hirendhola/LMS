const express = require("express")
const mongoose = require("mongoose")
const studentrouter = require("./routes/student.route.js")
const adminrouter = require("./routes/admin.route.js")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(cors({
    origin: 'https://authentication-autorization-frontend.vercel.app',
    methods: ['POST', 'GET', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}))

app.use(cookieParser())
app.use(express.json())
app.use("/student", studentrouter)
app.use("/admin", adminrouter)

mongoose
    .connect(process.env.MONGO_CONNECTION_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listening on ${PORT}`)
        })
    })
    .catch(error => console.log(error))

const PORT = process.env.PORT || 3000
app.get("/", (req, res) => {
    res.status(200).json({
        msg: "server is running"
    })
})

