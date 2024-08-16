import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { styles } from "../styles/signin_signup";
import { auth, signInWithEmailAndPassword } from "@/firebase/config";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";

interface FormData {
  email: string;
  password: string;
};

function SignIn() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "raufh1093@gmail.com",
      password: "123456",
    },
  });
  const {
    container,
    img,
    heading,
    input_container,
    input,
    label,
    button,
    btn_text,
    validationText,
  } = styles;

  const signin = ({ email, password }: FormData): void => {
    try {
      signInWithEmailAndPassword(auth, email.trim(), password)
        .then((userCredential) => {
          router.replace("/userslist");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView>
      <View style={[container, { marginTop: "5%" }]}>
        <Image
          source={require("../assets/images/message_icon.png")}
          style={img}
        />
        <Text style={heading}>Sign in your account</Text>
        <View style={[input_container, { marginVertical: 30 }]}>
          <Text style={label}>Email</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={input}
                placeholder="ex: jon.smith@gmail.com"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={"rgba(136,136,136,.6)"}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="email"
          />
          {errors.email && (
            <Text style={[validationText, { marginBottom: 20 }]}>
              Email is required.
            </Text>
          )}
        </View>
        <View style={input_container}>
          <Text style={label}>Password</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                secureTextEntry
                autoCapitalize="none"
                style={input}
                placeholderTextColor={"rgba(136,136,136,.6)"}
                onChangeText={onChange}
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text style={validationText}>Password is required.</Text>
          )}
        </View>
        <TouchableOpacity style={button} onPress={handleSubmit(signin)}>
          <Text style={btn_text}>Sign In</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: "20%",
          }}
        >
          <Text style={{ color: "gray", fontSize: 17 }}>
            Don't have an account?{" "}
          </Text>
          <Link href="/" style={{ color: "#03ad75", fontSize: 20 }}>
            Sign Up
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

export default SignIn;
