import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { chatPageStyles } from "@/styles/chat";
import {
  addDoc,
  auth,
  collection,
  db,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "@/firebase/config";
import { Ionicons } from "@expo/vector-icons";
import myProfileContext from "@/context/myProfileContext";
import { generateChatId } from "@/helpers";

const Chat = () => {
  const { uid: userUid } = useLocalSearchParams();
  const [messages, setMessages] = useState<Array<MsgType>>([]);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const myProfile = useContext<User | null>(myProfileContext);
  const [loading, setLoading] = useState<boolean>(true);

  const getUserProfile = () => {
    if (typeof userUid == "string") {
      onSnapshot(doc(db, "users", userUid), (doc) => {
        const data = doc.data() as User;
        setUserProfile(data);
      });
    } else {
      console.error("something went wrong");
    }
  };

  const getAllMsgs = () => {
    if (myProfile && typeof userUid == "string") {
      const q = query(
        collection(db, "messages"),
        where("chatId", "==", generateChatId(myProfile, userUid)),
        orderBy("sendTime", "asc")
      );

      onSnapshot(q, (querySnapshot) => {
        const messages: MsgType[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as MsgType;
          messages.push(data);
        });
        setLoading(false);
        setMessages(messages);
      });
    }
  };

  const sendMsg = async () => {
    if (myProfile && newMessage.trim()) {
      const msg: string = newMessage.trim();
      setNewMessage("");
      if (typeof userUid == "string") {
        await addDoc(collection(db, "messages"), {
          msg: msg,
          senderId: myProfile.uid,
          receiverId: userUid,
          chatId: generateChatId(myProfile, userUid),
          sendTime: serverTimestamp(),
        });
        await updateDoc(doc(db, "users", myProfile.uid), {
          [`lastMessages.${generateChatId(myProfile, userUid)}`]: {
            lastMessage: msg,
            chatId: generateChatId(myProfile, userUid),
            senderUid: myProfile.uid,
            sendTime: serverTimestamp(),
          },
        });
        await updateDoc(doc(db, "users", userUid), {
          [`lastMessages.${generateChatId(myProfile, userUid)}`]: {
            lastMessage: msg,
            chatId: generateChatId(myProfile, userUid),
            senderUid: myProfile.uid,
            sendTime: serverTimestamp(),
          },
        });
      }
    }
  };

  useEffect(() => {
    getUserProfile();
    getAllMsgs();
  }, [userUid]);

  const {
    header,
    avatar,
    msg_footer,
    msgInput,
    msg_main_container,
    msgBox,
    msgTxt,
    msg_arrow,
    msg_avatar,
    userFullName,
  } = chatPageStyles;

  const splitUserName = userProfile?.fullName.split(" ");
  return (
    <View style={{ flex: 1 }}>
      <View style={header}>
        <Link href="/userslist">
          <Ionicons name="arrow-back" color="white" size={30} />
        </Link>
        <View style={avatar}>
          <Text
            style={{
              color: "#03ad75",
              fontSize: 25,
              lineHeight: 30,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {splitUserName && splitUserName.length > 1
              ? `${splitUserName[0][0]}${splitUserName[1][0]}`
              : splitUserName && `${splitUserName[0][0]}`}
          </Text>
        </View>
        <Text style={userFullName}>{userProfile?.fullName}</Text>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "#d5dbd6",
          flexDirection: "column-reverse",
        }}
      >
        {!loading ? (
          messages.length == 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 50,
                  color: "#03ad75",
                }}
              >
                Say Hi 👋
              </Text>
            </View>
          ) : (
            <FlatList
              inverted
              data={[...messages].reverse()}
              renderItem={({ item }) => {
                const isSenderMe: boolean =
                  item.senderId === auth?.currentUser?.uid;
                return (
                  <View
                    style={[
                      msg_main_container,
                      isSenderMe
                        ? { flexDirection: "row", justifyContent: "flex-end" }
                        : {
                            flexDirection: "row-reverse",
                            justifyContent: "flex-end",
                          },
                    ]}
                  >
                    <View
                      style={[
                        {
                          flex: 1,
                        },
                        isSenderMe
                          ? { alignItems: "flex-end", marginLeft: 10 }
                          : {
                              alignItems: "flex-start",
                              marginRight: 10,
                            },
                      ]}
                    >
                      <View
                        style={[
                          msgBox,
                          isSenderMe
                            ? {
                                backgroundColor: "#03ad75",
                                marginRight: 10,
                                borderTopLeftRadius: 10,
                              }
                            : {
                                backgroundColor: "white",
                                marginLeft: 10,
                                borderTopRightRadius: 10,
                              },
                        ]}
                      >
                        <View
                          style={[
                            msg_arrow,
                            isSenderMe ? { right: -24 } : { left: -24 },
                          ]}
                        >
                          <Ionicons
                            name={isSenderMe ? "caret-forward" : "caret-back"}
                            size={35}
                            color={isSenderMe ? "#03ad75" : "white"}
                          />
                        </View>
                        <Text
                          style={[
                            msgTxt,
                            isSenderMe
                              ? { color: "white" }
                              : { color: "#03ad75" },
                          ]}
                        >
                          {item.msg}
                        </Text>
                      </View>
                      <Text
                        style={{
                          marginHorizontal: 15,
                          marginTop: 5,
                          color: "#3b3a3a",
                          fontSize: 14,
                        }}
                      >
                        {item.sendTime &&
                          new Date(item.sendTime.toDate()).toLocaleTimeString(
                            [],
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                      </Text>
                    </View>
                    <View
                      style={[
                        msg_avatar,
                        isSenderMe
                          ? { backgroundColor: "white" }
                          : { backgroundColor: "#03ad75" },
                      ]}
                    >
                      <Text
                        style={[
                          isSenderMe
                            ? { color: "#03ad75" }
                            : { color: "white" },
                          {
                            textTransform: "uppercase",
                            fontSize: 20,
                            letterSpacing: 1,
                          },
                        ]}
                      >
                        {isSenderMe
                          ? myProfile &&
                            myProfile?.fullName?.split(" ").length > 1
                            ? `${myProfile.fullName?.split(" ")[0][0]}${
                                myProfile.fullName?.split(" ")[1][0]
                              }`
                            : `${myProfile?.fullName?.split(" ")[0][0]}`
                          : userProfile &&
                            userProfile?.fullName?.split(" ").length > 1
                          ? `${userProfile.fullName?.split(" ")[0][0]}${
                              userProfile.fullName?.split(" ")[1][0]
                            }`
                          : `${userProfile?.fullName?.split(" ")[0][0]}`}
                      </Text>
                    </View>
                  </View>
                );
              }}
              keyExtractor={(item, index) => String(index)}
              contentContainerStyle={{
                justifyContent: "flex-end",
              }}
            />
          )
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color={"#03ad75"} size={70} />
          </View>
        )}
      </View>
      <View style={msg_footer}>
        <TextInput
          placeholder="Type your message here..."
          value={newMessage}
          style={msgInput}
          onChangeText={(v) => setNewMessage(v)}
        />
        <TouchableOpacity
          onPress={sendMsg}
          activeOpacity={0.5}
          style={{
            height: 70,
            width: 70,
            borderRadius: 50,
            backgroundColor: "#03ad75",
            justifyContent: "center",
            alignItems: "center",
            elevation: 5,
            marginLeft: 10,
          }}
        >
          <Ionicons
            name="send"
            size={40}
            color="white"
            style={{ marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;
