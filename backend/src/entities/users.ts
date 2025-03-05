import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { v7 } from "uuid";
import { Message } from "./messages";
import { Chat } from "./chats";

@Entity()
export class User {
    @PrimaryColumn({ type: 'uuid'})
    id: string = v7();

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

    @ManyToMany(() => Chat, chat => chat.users)
    chats: Chat[];

    // constructor() {
    //     this.id = v7();
    // }
}