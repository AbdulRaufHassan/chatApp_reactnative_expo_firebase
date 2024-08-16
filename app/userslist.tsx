import {
  View,
  TextInput,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { styles } from "@/styles/userslist";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  auth,
  collection,
  db,
  onSnapshot,
  query,
  signOut,
  where,
} from "@/firebase/config";
import myProfileContext from "@/context/myProfileContext";
import { generateChatId } from "@/helpers";

const UsersList = () => {
  const { header, avatar, searchField, user, userAvatar } = styles;
  const [users, setUsers] = useState<Array<User>>([]);
  const myProfile = useContext<User | null>(myProfileContext);

  const signout = () => {
    signOut(auth)
      .then(() => {
        console.log("signed out");
        router.replace("/signin");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getRealTimeUsers = async () => {
    if (auth?.currentUser?.uid) {
      const q = query(
        collection(db, "users"),
        where("uid", "!=", auth?.currentUser?.uid)
      );
      onSnapshot(q, (querySnapshot) => {
        const users: Array<User> = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as User;
          users.push(data);
        });
        setUsers(users);
      });
    }
  };

  useEffect(() => {
    getRealTimeUsers();
  }, []);

  const splitMyName = myProfile?.fullName.split(" ");

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          alignItems: "center",
          borderBottomWidth: 2,
          borderColor: "rgb(215, 217, 219)",
          marginBottom: 10,
          elevation:3
        }}
      >
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
              {splitMyName && splitMyName.length > 1
                ? `${splitMyName[0][0]}${splitMyName[1][0]}`
                : splitMyName && `${splitMyName[0][0]}`}
            </Text>
          </View>
          <Pressable onPress={signout}>
            <Ionicons name="log-out-outline" size={40} color="white" />
          </Pressable>
        </View>
        <TextInput placeholder="Search User" style={searchField} />
      </View>
      {users.length ? (
        <FlatList
          data={users}
          renderItem={({ item }) => {
            return (
              <Pressable
                style={user}
                onPress={() =>
                  router.replace({
                    pathname: "/chat",
                    params: { uid: String(item.uid) },
                  })
                }
              >
                <View style={userAvatar}>
                  <Text
                    style={{
                      color: "#03ad75",
                      fontSize: 20,
                      lineHeight: 25,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.fullName.split(" ").length > 1
                      ? `${item.fullName.split(" ")[0][0]}${
                          item.fullName.split(" ")[1][0]
                        }`
                      : `${item.fullName.split(" ")[0][0]}`}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    flex: 1,
                    marginLeft: 10,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 21,
                      fontWeight: "bold",
                      color: "#03ad75",
                    }}
                  >
                    {item.fullName}
                  </Text>
                  <Text style={{ color: "gray" }}>
                    {item?.lastMessages?.[generateChatId(myProfile, item.uid)]
                      ?.lastMessage || "Start Chat!"}
                  </Text>
                </View>
              </Pressable>
            );
          }}
          keyExtractor={(item) => String(item.uid)}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom:50
          }}
        >
          <ActivityIndicator color={"#03ad75"} size={70} />
        </View>
      )}
    </View>
  );
};

export default UsersList;
