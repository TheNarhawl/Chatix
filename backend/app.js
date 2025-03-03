import bcrypt from 'bcrypt'
import express from 'express'
import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config(); 
const { Pool } = pkg;
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }

    const hash = await bcrypt.hash(password, 13);

    try {
        console.log("Попытка добавления пользователя:", username);
        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
            [username, hash]
        );
        console.log("Пользователь успешно добавлен:", result.rows[0]);
        res.json({message: 'ok'});
    } catch (err) {
        console.error("Ошибка при добавлении в БД:", err);
        res.status(500).send("Error registering user");
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user) {
        return res.send("no such user");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.send("wrong password");
    }

    res.json({message: 'ok'});
});


app.listen(8080, () => console.log("listening on port 8080"))
