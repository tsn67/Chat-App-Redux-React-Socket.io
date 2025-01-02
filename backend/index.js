import express, { response } from 'express';
import pg from 'pg';
import cors from 'cors';

const port = 3000 || process.env.port;
const app = express();

//database connection 
const {Client} = pg;

const db = new Client({
    host: 'autorack.proxy.rlwy.net',
    port: 56564,
    user: 'postgres',
    password: 'BzbSyIwfCwiifiqWqzJKeFWPSAXqIeiv',
    database: 'railway',
});

db.connect()

app.use(express.json());
app.use(cors());

app.get('/', (req, res)=> {
    res.send({
        msg: "testing ok"
    });
})

app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});

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