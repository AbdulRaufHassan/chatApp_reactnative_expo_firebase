import React, { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import { useFonts } from "expo-font";
import {
  auth,
  db,
  doc,
  onAuthStateChanged,
  onSnapshot,
} from "@/firebase/config";
import myProfileContext from "@/context/myProfileContext";

export default function RootLayout() {
  const [myProfile, setMyProfile] = useState<User | null>(null);

 const [loaded, error] = useFonts({
    "josefinSans": require("../assets/fonts/josefinSans.ttf"),
  });

  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        onSnapshot(doc(db, "users", user.uid), (doc) => {
          const data = doc.data() as User;
          setMyProfile(data);
        });
        router.replace("/userslist");
      } else {
        router.replace("/signin");
      }
    });
  }, []);

  return (
    <myProfileContext.Provider value={myProfile}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="signin"
          options={{ headerTitle: "", headerTransparent: true }}
        />
        <Stack.Screen name="userslist" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
      </Stack>
    </myProfileContext.Provider>
  );
}

export { RootLayout };
