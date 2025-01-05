import express, { response } from 'express';
import pg from 'pg';
import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';

const port = 3000 || process.env.port;
const app = express();

//database connection 
const {Client} = pg;

app.use(express.json());
app.use(cors());

// remote postgres server

const db = new Client({
    host: 'autorack.proxy.rlwy.net',
    port: 56564,
    user: 'postgres',
    password: 'BzbSyIwfCwiifiqWqzJKeFWPSAXqIeiv',
    database: 'railway',
});

//local

// const db = new Client({
//     host: 'localhost',
//     port: 5432,
//     user: 'postgres',
//     password: '730644',
//     database: 'ChatApp'    
// });

db.connect();


app.get('/', (req, res)=> {
    res.send({
        msg: "testing ok"
    });
})


//no need if the socket.io server is listening
// app.listen(port, () => {
//     console.log(`Server started at port: ${port}`);
// });

app.post('/register', async (req, res) => {

    const {username, password} = req.body;
    console.log(username+ " " +password);

    //enter to the database
    const response = await db.query('insert into users(username, password) values($1, $2)', [username, password]);
    
    res.status(200).send('registration successfull!');
});

app.post('/confirmUser', async (req, res) => {
    const {username, password} = req.body;

    const response = await db.query('select * from users where username = $1 and password = $2', [username, password]);
    if(response.rowCount == 1) {
        res.json({
            status: 'successfull',
            id: response.rows[0].id
        });
    } else {
        res.json({
            status: 'failed',
            data: null
        });
    }

});

//socket.io live communication server

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: '*', // Replace with your React app's URL
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true,
    },
  });

server.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});

var clients = [];
//array to store the usernames and their socket id 


var messages = [{user:'test1', message:'testing'}, {user:'testing', message:'testing1'}];
//array to store the messages , but it is cleared in every 5minutes
//format {user: username, message: ''}
// setInterval(() => {
//     messages.length = 0; //clear the messages array in every 5 minutes
// }, 300000);

io.on('connection', (socket) => {
    console.log('A user connected,id: '+socket.id);
  
    io.emit('count', {
        newCount: clients.length
    })

    // Listen for events from the client
    socket.on('newChat', (msg) => {
      //console.log('Message received:', msg);
      clients.push({
        id: socket.id,
        username: msg.username 
      })  
     
      io.emit('count', {
        newCount: clients.length
      });

      socket.send({
        msgArr: messages
      });
    });
  

    socket.on('newMessage', (msg) => {
        messages.push({user: msg.username, message: msg.message});
        if(messages.length > 30) {
            messages.splice(0, 25);
        }
        io.emit('newMsg',{
            user: msg.username,
            message: msg.message
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      
        let found = clients.findIndex((user) => {
            return user.id == socket.id;
        });

        if(found != -1) {
            clients.splice(found, 1); //remove the user form clients
            io.emit('count', {
                newCount: clients.length
            });
        }

    });
});