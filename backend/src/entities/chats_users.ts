import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { v7 } from "uuid";
import { User } from "./users";
import { Chat } from "./chats";

@Entity()
export class ChatUser {
    @PrimaryColumn({ type: 'uuid', default: () => v7() })
    id: string;

    @Column({ type: 'varchar', length: 36})
    chatId: string;

    @Column({ type: 'varchar', length: 36})
    userId: string;

    @ManyToMany(() => Chat, chat => chat.chatUsers)
    @JoinColumn({ name: 'chatId' })
    chat: Chat;

    @ManyToMany(() => User, user => user.chatUsers)
    @JoinColumn({ name: 'userId' })
    user: User;
}