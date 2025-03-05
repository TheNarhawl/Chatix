import bcrypt from 'bcrypt'
import express, { Request, Response } from 'express'
import { Pool } from 'pg'
import { config } from 'dotenv'
import { v7 as uuid, v7 } from 'uuid'
import { AppDataSource } from './db/data-source';
import { User } from './entities/users'

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

const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');
    } catch (err) {
        console.error('Database connection failed', err);
        process.exit(1);
    }
};

initializeDatabase();

interface UserSignupRequest {
    username: string;
    password: string;
    dateOfBirth: string;
}

interface UserLoginRequest {
    username: string;
    password: string;
}

app.post('/signup', async (req: Request, res: Response) => {
    const { username, password, dateOfBirth}: UserSignupRequest = req.body;
    if (!username || !password || !dateOfBirth) {
        return res.status(400).send("All fields are required");
    }

    try {
        const hash = await bcrypt.hash(password, 13);
        const dateOfBirthDate = new Date(dateOfBirth);
        if (isNaN(dateOfBirthDate.getTime())) {
            return res.status(400).send('Invalid date format');
        }

        const userRepository = AppDataSource.getRepository(User);

        const existingUser = await userRepository.findOneBy({ username });
        if (existingUser) {
            return res.status(409).send("User with this username already exists");
        }

        const user = new User();
        user.id = uuid();
        user.username = username;
        user.password = hash;
        user.dateOfBirth = dateOfBirthDate;

        await userRepository.save(user);

        console.log('User successfully registered:', user);
        res.json({ message: 'ok' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).send('Error registering user');
    }
});

app.post('/login', async (req: Request, res: Response) => {
    const { username, password }: UserLoginRequest = req.body;
    
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ username });

        if (!user) {
            return res.status(404).send("No such user");
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).send("Wrong password");
        }

        res.json({ 
            message: 'ok', 
            id: user.id, 
            username: user.username, 
            dateOfBirth: user.dateOfBirth, 
            createdAt: user.createdAt 
        });

    } catch (err) {
        console.error("Ошибка при логине:", err);
        res.status(500).send("Error logging in");
    }
});

const port = process.env.BACKEND_PORT
app.listen(port, () => console.log("listening on port 8080"))

// export = app
