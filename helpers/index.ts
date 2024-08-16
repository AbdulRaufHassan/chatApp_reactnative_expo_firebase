const generateChatId = (myProfile: User | null, userUid: string) => {
  let chatId = "";
  if (myProfile) {
    if (myProfile.uid < userUid) {
      chatId = `${myProfile.uid}${userUid}`;
    } else {
      chatId = `${userUid}${myProfile.uid}`;
    }
  }
  return chatId;
};

export { generateChatId };
