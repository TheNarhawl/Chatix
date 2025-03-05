import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { v7 } from "uuid";
import { ChatType } from "./enums";
import { Message } from "./messages";
import { User } from "./users";

@Entity()
export class Chat {
    @PrimaryColumn({ type: 'uuid'})
    id: string = v7();

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

    @ManyToMany(() => User, user => user.chats)
    @JoinTable()
    users: User[];

}