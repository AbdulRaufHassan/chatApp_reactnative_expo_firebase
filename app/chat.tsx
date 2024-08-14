import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { chatPageStyles } from "@/styles/chat";
import { db, doc, onSnapshot } from "@/firebase/config";
import { User } from "./_layout";

const Chat = () => {
  const { uid } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const getUserProfile = () => {
    if (typeof uid == "string") {
      onSnapshot(doc(db, "users", uid), (doc) => {
        const data = doc.data() as User;
        setUserProfile(data);
      });
    } else {
      console.error("User is not logged in or UID is undefined");
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const { header, avatar } = chatPageStyles;

  const splitUserName = userProfile?.fullName.split(" ");
  return (
    <View style={{ flex: 1 }}>
      <View style={header}>
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
      </View>
      <View style={{ flex: 1 }}></View>
      <View style={{ height: 100, backgroundColor: "gray" }}></View>
    </View>
  );
};

export default Chat;
