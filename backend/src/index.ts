import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import { config } from 'dotenv';
import { v7 as uuid, v7 } from 'uuid';
import { AppDataSource } from './db/data-source';
import { User } from './entities/users';
import { Chat } from './entities/chats';
import { ChatType } from './entities/enums';
import { Message } from './entities/messages';

config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number.parseInt(process.env.DB_PORT || '5432'),
});

const app = express();
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

interface UserDeleteRequest {
  username: string;
  password: string;
}

interface UserUpdateBioRequest {
  username: string;
  bio: string;
}

interface CreateChatDM {
  senderUsername: string;
  getterUsername: string;
}

interface SendMessageRequest {
  chatId: string;
  senderId: string;
  text: string;
}

interface DeleteMessageRequest {
  messageId: string;
}

interface EditMessageRequest {
  messageId: string;
  text: string;
}

interface GetUserChatsRequest {
  userId: string;
}

app.post('/user/signup', async (req: Request, res: Response) => {
  const { username, password, dateOfBirth }: UserSignupRequest = req.body;
  if (!username || !password || !dateOfBirth) {
    return res.status(400).send('All fields are required');
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
      return res.status(409).send('User with this username already exists');
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

app.post('/user/login', async (req: Request, res: Response) => {
  const { username, password }: UserLoginRequest = req.body;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ username });

    if (!user) {
      return res.status(404).send('No such user');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).send('Wrong password');
    }

    res.json({
      message: 'ok',
      id: user.id,
      username: user.username,
      dateOfBirth: user.dateOfBirth,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error('Ошибка при логине:', err);
    res.status(500).send('Error logging in');
  }
});

app.delete('/user/delete', async (req: Request, res: Response) => {
  const { username, password }: UserDeleteRequest = req.body;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ username });

    if (!user) {
      return res.status(404).send('No such user');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).send('Wrong password');
    }

    await userRepository.remove(user);

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Ошибка при удалении пользователя:', err);
    res.status(500).send('Error deleting user');
  }
});

app.put('/user/update-bio', async (req: Request, res: Response) => {
  const { username, bio }: UserUpdateBioRequest = req.body;

  if (!username) {
    return res.status(400).send('Username is required');
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    user.bio = bio ?? null;

    await userRepository.save(user);

    res.json({ message: 'Bio updated successfully', bio: user.bio });
  } catch (err) {
    console.error('Ошибка при обновлении bio:', err);
    res.status(500).send('Error updating bio');
  }
});

app.post('/chat/create-dm', async (req: Request, res: Response) => {
  const { senderUsername, getterUsername }: CreateChatDM = req.body;

  if (!senderUsername || !getterUsername) {
    return res
      .status(400)
      .json({ error: 'Требуется senderUsername и getterUsername' });
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const sender = await userRepository.findOneBy({ username: senderUsername });
    const getter = await userRepository.findOneBy({ username: getterUsername });

    if (!sender || !getter) {
      return res.status(404).json({ error: 'One or both users not found' });
    }

    const chatRepository = AppDataSource.getRepository(Chat);
    const existingChat = await chatRepository
      .createQueryBuilder('chat')
      .innerJoin('chat.users', 'user1', 'user1.username = :senderUsername', {
        senderUsername,
      })
      .innerJoin('chat.users', 'user2', 'user2.username = :getterUsername', {
        getterUsername,
      })
      .where('chat.type = :type', { type: ChatType.DM }) // Убедитесь, что это DM-чат
      .getOne();

    if (existingChat) {
      return res.status(409).json({ error: 'DM chat already exists' });
    }

    const chat = new Chat();
    chat.id = v7();
    chat.createdAt = new Date();
    chat.type = ChatType.DM;
    chat.users = [sender, getter];

    await chatRepository.save(chat);

    res.json({ message: 'DM chat created', chatId: chat.id });
  } catch (err) {
    console.error('Ошибка при создании чата:', err);
    res.status(500).send('Error creating DM chat');
  }
});

app.post('/chat/send-message', async (req: Request, res: Response) => {
  const { chatId, senderId, text }: SendMessageRequest = req.body;

  if (!chatId || !senderId || !text) {
    return res.status(400).json({ error: 'Требуется chatId, senderId и text' });
  }

  try {
    const chatRepository = AppDataSource.getRepository(Chat);
    const userRepository = AppDataSource.getRepository(User);
    const messageRepository = AppDataSource.getRepository(Message);

    const chat = await chatRepository.findOneBy({ id: chatId });
    if (!chat) {
      return res.status(404).json({ error: 'Чат не найден' });
    }

    const sender = await userRepository.findOneBy({ id: senderId });
    if (!sender) {
      return res.status(404).json({ error: 'Отправитель не найден' });
    }

    const message = new Message();
    message.id = v7();
    message.chatId = chatId;
    message.senderId = senderId;
    message.text = text;
    message.timestamp = new Date();
    message.isRead = false;

    await messageRepository.save(message);

    res.json({ message: 'Сообщение отправлено', messageId: message.id });
  } catch (err) {
    console.error('Ошибка при отправке сообщения:', err);
    res.status(500).send('Error sending message');
  }
});

app.delete('/chat/delete-message', async (req: Request, res: Response) => {
  const { messageId }: DeleteMessageRequest = req.body;

  if (!messageId) {
    return res.status(400).json({ error: 'Требуется messageId' });
  }

  try {
    const messageRepository = AppDataSource.getRepository(Message);

    const message = await messageRepository.findOneBy({ id: messageId });
    if (!message) {
      return res.status(404).json({ error: 'Сообщение не найдено' });
    }

    await messageRepository.remove(message);

    res.json({ message: 'Сообщение удалено', messageId: messageId });
  } catch (err) {
    console.error('Ошибка при удалении сообщения:', err);
    res.status(500).send('Error deleting message');
  }
});

app.put('/chat/edit-message', async (req: Request, res: Response) => {
  const { messageId, text }: EditMessageRequest = req.body;

  if (!messageId || !text) {
    return res.status(400).json({ error: 'Требуется messageId и text' });
  }

  try {
    const messageRepository = AppDataSource.getRepository(Message);

    const message = await messageRepository.findOneBy({ id: messageId });
    if (!message) {
      return res.status(404).json({ error: 'Сообщение не найдено' });
    }

    message.text = text;

    await messageRepository.save(message);

    res.json({ message: 'Сообщение отредактировано', messageId: messageId });
  } catch (err) {
    console.error('Ошибка при редактировании сообщения:', err);
    res.status(500).send('Error editing message');
  }
});

app.get('/user/get-chats', async (req: Request, res: Response) => {
  const { userId }: GetUserChatsRequest = req.body;

  console.log('req.query:', req.query);

  if (!userId) {
    return res.status(400).json({ error: 'Требуется userId' });
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const chatRepository = AppDataSource.getRepository(Chat);
    const messageRepository = AppDataSource.getRepository(Message);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const chats = await chatRepository
      .createQueryBuilder('chat')
      .innerJoin('chat.users', 'user', 'user.id = :userId', { userId })
      .getMany();

    const chatsWithLastMessage = await Promise.all(
      chats.map(async (chat) => {
        const lastMessage = await messageRepository
          .createQueryBuilder('message')
          .leftJoin('message.sender', 'sender')
          .where('message.chatId = :chatId', { chatId: chat.id })
          .orderBy('message.timestamp', 'DESC')
          .select([
            'message.id',
            'message.text',
            'message.timestamp',
            'sender.id',
            'sender.username',
          ])
          .getOne();

        return {
          id: chat.id,
          type: chat.type,
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                text: lastMessage.text,
                timestamp: lastMessage.timestamp,
                sender: {
                  id: lastMessage.sender.id,
                  username: lastMessage.sender.username,
                },
              }
            : null,
        };
      })
    );

    res.json({
      message: 'Чаты пользователя получены',
      chats: chatsWithLastMessage,
    });
  } catch (err) {
    console.error('Ошибка при получении чатов пользователя:', err);
    res.status(500).send('Error fetching user chats');
  }
});

const port = process.env.BACKEND_PORT;
app.listen(port, () => console.log('listening on port 8080'));

// export = app
