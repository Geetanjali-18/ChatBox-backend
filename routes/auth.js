const express = require("express")
const User = require("../models/user")
const router = express.Router()
var bcrypt = require("bcryptjs")
var jwt = require('jsonwebtoken');
const JWT_SECRET = "instaid"
const { body, validationResult } = require('express-validator');//validates the data from the server side
const fetchuser = require("../middleware/fetchuser");
// const fetchUser = require("../middleware/fetchuser")

//router 1: create a user, require no login, using: POST "/api/auth/createuser"
router.post('/createuser', [
    body('name', "Name must be atleast 2 characters").isLength({ min: 2 }),
    body('username', 'Username must be atleast 8 characters').isLength({ min: 8 }),
    body('password', "Your password must be atleast 5 letters").isLength({ min: 5 })
],
    async (req, res) => {
        let success = false
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {
            let user = await User.findOne({ username: req.body.username })
            if (user) {
                return res.status(400).json({ Error: "This username is already been created" })
            }
            else {
                const salt = await bcrypt.genSalt(10)
                var secPass = await bcrypt.hash(req.body.password, salt)

                //saving data into database
                user = await User.create({
                    name: req.body.name,
                    username: req.body.username,
                    password: secPass
                })

                const data = {
                    user: { id: user.id }
                }
                var authtoken = jwt.sign(data, JWT_SECRET)
                success = true

                const idOfUser = user._id
                const nameOfUser = user.name
                const username = user.username
                console.log(authtoken)
                res.json({ authtoken, success, username, idOfUser, nameOfUser })

            }
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some error Occured")
        }
    }
)

//route 2 - Authenticate a user using : POST "/api/auth/login" - no login required

router.post("/login", [
    body('username', 'must be atleast 8 characters').isLength({ min: 8 }),
    body('password', "Must be atleast 5 characters").isLength({ min: 5 })
],
    async (req, res) => {
        let success = false;
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { username, password } = req.body
        try {
            let user = await User.findOne({ username })
            if (!user) {
                return res.status(400).json({ Error: "Please login with correct credential" })
            }
            let passwordCompare = await bcrypt.compare(password, user.password)
            if (!passwordCompare) {
                return res.status(400).json({ Error: "Please login with correct credential" })
            }
            const data = {
                user: { id: user.id }
            }
            const authtoken = jwt.sign(data, JWT_SECRET)
            success = true;
            const idOfUser = user._id
            const nameOfUser = user.name
            res.send({ authtoken, success, username, idOfUser, nameOfUser })
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error")
        }

    }
)

//route 3- Get logged in information using post: "/api/auth/getuser" - login required
router.post("/getuser" // [
    //     body('username',"USername must  be atleast 8 characters").isLength({min:8}),
    //     body("password","Password must be atleast 5 characters").isLength({min:5}) ]
    , fetchuser, async (req, res) => {
        try {
            const userId = req.user.id
            const user = await User.findById(userId).select("-password")
            res.send(user)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("INternal server error")
        }
    })



module.exports = router

