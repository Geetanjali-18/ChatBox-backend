const connectToMongoose = require("./db");
const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const cors = require('cors');
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ['websocket']
  }
});

io.on("connection", (socket) => {
  // console.log("A user connected:");
  socket.on("user_logged_in",(usn) =>{
    // console.log(usn+" Successfully logged in")
  })

  socket.on("message_sent", (data)=>{
    socket.broadcast.emit("receive_message", (data))
    // console.log("Sending to: ",sto)
  })

  socket.on("new_contact", (id)=>{
    console.log("new conptact received ",id)
    socket.broadcast.emit("new_contact_recieved", (id))
    // console.log("Sending to: ",sto)
  })
});

connectToMongoose();

const port = 5000;

app.use(express.json());
  
app.use('/api/auth', require('./routes/auth'));
app.use('/api/message', require('./routes/message'));

server.listen(port, () => {
  console.log(`Successfully connected to chatbox at: ${port}`);
});
