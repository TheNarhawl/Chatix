import { DataSource } from 'typeorm';
import { User } from '../entities/users';
import { Chat } from '../entities/chats';
import { Message } from '../entities/messages';
import { config } from 'dotenv';
config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: `${process.env.DB_PASSWORD}`,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [User, Chat, Message],
    migrations: ['src/db/migrations/**/*.ts'],
    subscribers: [],
});