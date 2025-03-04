import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { v7 } from "uuid";
import { ChatType } from "./enums";
import { Message } from "./messages";
import { ChatUser } from "./chats_users";

@Entity()
export class Chat {
    @PrimaryColumn({ type: 'uuid', default: () => v7() })
    id: string;

    @Column({ type: 'timestamp'})
    createdAt: Date;

    @Column({
        type: 'enum',
        enum: ChatType,
        default: ChatType.DM,
    })
    type: ChatType;

    @Column({ type: 'varchar', length: 255, nullable: true })
    avatarURL: string;

    @OneToMany(() => Message, message => message.chat)
    messages: Message[];

    @OneToMany(() => ChatUser, chatUser => chatUser.chat)
    chatUsers: ChatUser[];

}