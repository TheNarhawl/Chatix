export interface CreateChatDM {
  senderUsername: string;
  getterUsername: string;
}

export interface GetUserChatsRequest {
  userId: string;
}

export interface GetChatMessages {
  chatId: string;
}
