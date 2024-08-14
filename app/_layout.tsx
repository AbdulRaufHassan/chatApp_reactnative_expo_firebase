import { View, Text } from "react-native";
import React, { createContext, useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { auth, onAuthStateChanged } from "@/firebase/config";

interface User {
  uid: string;
  fullName: string;
  email: string;
  password: string;
}

type MyProfileContext = {
  myProfile: User;
  setMyProfile: Function;
};

const myContext = createContext<MyProfileContext | null>(null);

const RootLayout = () => {
  const [myProfile, setMyProfile] = useState<User>({
    uid: "",
    fullName: "",
    email: "",
    password: "",
  });

  const [fontsLoaded] = useFonts({
    josefinSans: require("../assets/fonts/josefinSans.ttf"),
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/userslist");
      } else {
        router.replace("/signin");
      }
    });
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <myContext.Provider value={{ myProfile, setMyProfile }}>
      <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="signin"
          options={{ headerTitle: "", headerTransparent: true }}
        />
        <Stack.Screen name="userslist" options={{ headerShown: false }} />
        <Stack.Screen name="chat" />
      </Stack>
    </myContext.Provider>
  );
};

export { RootLayout, myContext, User };
