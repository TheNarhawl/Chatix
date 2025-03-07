export interface SendMessageRequest {
  chatId: string;
  senderId: string;
  text: string;
}

export interface DeleteMessageRequest {
  messageId: string;
}

export interface EditMessageRequest {
  messageId: string;
  text: string;
}
