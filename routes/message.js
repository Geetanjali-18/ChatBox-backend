const express = require("express")
const router = express.Router()
var fetchuser = require("../middleware/fetchuser")
const messages = require("../models/message")
const { body, validationResult } = require("express-validator")
const user = require("../models/user")

// route 1: create a new message using: POST "/api/message/send" login required
router.post("/send", fetchuser, [
    body('message', "Message box should not be empty").isLength({ min: 1 })
], async (req, res) => {
    try {
        const { message, to } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        // await{
        let chatIdArr = []
        chatIdArr.push(req.user.id, to)
        chatIdArr.sort()
        chatIdArr.forEach(i => {
            console.log(i)
        });

        // }
        const msg = new messages({
            user: req.user.id, from: JSON.stringify(req.user.id), to, message, chatid: chatIdArr
        })
        const sentMsg = await msg.save()
        res.json(sentMsg)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error")
    }
})



//Route 2: get all the messages using: GET " /api/auth/getmessage" login required
router.get("/getmessage/:inID", fetchuser, async (req, res) => {
    try {
        // const { to } = req.body
        const to = req.params.inID
        let chatIdArr = []
        chatIdArr.push(req.user.id)
        // console.log(to)
        chatIdArr.push(to)
        chatIdArr.sort()
        // console.log(chatIdArr)
        const AllMsg = await messages.find({ chatid: chatIdArr })
        res.send(AllMsg)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})

// route 3: Fetch Username From UserID: GET "/api/message/fetchusername" login required

router.get("/fetchusername/:id", fetchuser, async (req, res) => {
    try {
        // const {id} =req.body 
        const id = await user.findById(req.params.id)
        // console.log(id)
        // const usn = await user.findOne({id}).select("username -_id")
        res.json(id.username)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})



// route 4: Fetch Username of all those who are in contacts: GET "/api/message/contacts" login required

router.get("/contacts", fetchuser, async (req, res) => {
    try {
        const id = req.user.id
        // console.log(id )
        // console.log(req.messages)
        let inContactsArr = []
        const allPresent = await messages.find({ chatid: id })
        await allPresent.forEach(async (i) => {
            let currentId = i.to === id ? i.user : i.to
            if (!inContactsArr.includes(JSON.stringify(currentId))) {
                // console.log((currentId))
                // console.log("all id pushed")
                inContactsArr.push(JSON.stringify(currentId))
            };

        });
        // const allPresent
        
        const allUsernamePresent = []
        let totalTime = 1000*inContactsArr.length
        
        
        await inContactsArr.forEach( async (i) => {
            const ids = await user.findById(JSON.parse(i))
            // await console.log("inside the foreach")
            // await console.log(JSON.stringify(ids.username))
            // console.log(JSON.stringify(ids.username))
            // if (!allUsernamePresent.includes(JSON.stringify(ids.username))) {
                // console.log((currentId))
                allUsernamePresent.push(ids)
                // allUsernamePresent.concat([JSON.stringify(ids.username)])


                // console.log("pushed Element")
            // };
            // await allUsernamePresent.push((ids.username))
        });
        
        // console.log(JSON.parse(inContactsArr[0]))
        // res.send(allUsernamePresent)
        setTimeout(() => {
            
            res.send( allUsernamePresent)
        }, totalTime);
            
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

router.post("/search", fetchuser, async (req, res) => {
    try {
        const usp = req.body.usnSearch
        
        let ifPresent = false;
        
        const usn = await user.findOne({username:usp})
        if(!usn){
            res.send(false)
        }
        else{
            ifPresent = true;
            res.json({id:usn._id})
        }
            
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})



module.exports = router
