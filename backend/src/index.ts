import bcrypt from 'bcrypt'
import express, { Request, Response } from 'express'
import { Pool } from 'pg'
import { config } from 'dotenv'

config(); 

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number.parseInt(process.env.DB_PORT || '5432'),
});

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

interface User {
    username: string;
    password: string;
}

app.post('/signup', async (req: Request, res: Response) => {
    const { username, password }: User = req.body;
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
        res.json({ message: 'ok' });
    } catch (err) {
        console.error("Ошибка при добавлении в БД:", err);
        res.status(500).send("Error registering user");
    }
});


app.post('/login', async (req: Request, res: Response) => {
    const { username, password }: User = req.body;
    
    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).send("No such user");
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).send("Wrong password");
        }

        res.json({ message: 'ok' });
    } catch (err) {
        console.error("Ошибка при логине:", err);
        res.status(500).send("Error logging in");
    }
});

const port = process.env.BACKEND_PORT
app.listen(port, () => console.log("listening on port 8080"))

// export = app
