interface User {
  uid: string;
  fullName: string;
  email: string;
  password: string;
  lastMessages: {
    [key: string]: {
      chatId: string;
      lastMessage: string;
      sendTime: any;
      senderUid: string;
    };
  };
}

interface MsgType {
  chatId: string;
  senderId: string;
  receiverId: string;
  msg: string;
  sendTime: any;
}
