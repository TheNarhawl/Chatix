import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { v7 } from "uuid";
import { Message } from "./messages";
import { ChatUser } from "./chats_users";

@Entity()
export class User {
    @PrimaryColumn({ type: 'uuid', default: () => v7() })
    id: string;

    @Column({unique: true, type: "varchar", length: 50})
    username: string;

    @Column({type: "varchar", length: 100})
    password: string;

    @Column({type: "varchar", length: 255, nullable: true})
    avatarURL?: string;

    @Column({type: "text", nullable: true})
    bio?: string;
    
    @Column({type: "date"})
    dateOfBirth: Date;

    @CreateDateColumn({type: "date"})
    createdAt: Date;

    @OneToMany(() => Message, message => message.sender)
    messages: Message[];

    @OneToMany(() => ChatUser, chatUser => chatUser.user)
    chatUsers: ChatUser[];

    // constructor() {
    //     this.id = v7();
    // }
}