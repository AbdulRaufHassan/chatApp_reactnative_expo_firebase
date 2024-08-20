import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { styles } from "@/styles/signin_signup";
import { Link, router } from "expo-router";
import {
  setDoc,
  auth,
  doc,
  createUserWithEmailAndPassword,
  db,
} from "@/firebase/config";
import { Controller, useForm } from "react-hook-form";

interface FormData {
  fullName: string;
  email: string;
  password: string;
}

function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
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

  const signup = ({ fullName, email, password }: FormData): void => {
    createUserWithEmailAndPassword(auth, email.trim(), password)
      .then(async (userCredential) => {
        try {
          await setDoc(doc(db, "users", userCredential.user.uid), {
            fullName: fullName,
            uid: userCredential.user.uid,
            emailAddress: email,
          });
          router.replace("/userslist");
        } catch (e) {
          console.error(e)
        }
      })
      .catch((error) => {
        console.error(error.message)
      });
  };

  return (
    <ScrollView>
      <View style={container}>
        <Image
          source={require("../assets/images/message_icon.png")}
          style={img}
        />
        <Text style={heading}>Create your account</Text>
        <View style={input_container}>
          <Text style={label}>Full Name</Text>
          <Controller
            control={control}
            rules={{
              required: "Full Name is required",
              minLength: {
                value: 4,
                message: "Full Name should be at least 4 characters long",
              },
              maxLength: {
                value: 20,
                message: "Full Name should not exceed 20 characters",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                style={input}
                placeholder="ex: jon smith"
                onChangeText={onChange}
                placeholderTextColor={"rgba(136,136,136,.6)"}
              />
            )}
            name="fullName"
          />
          {errors.fullName && (
            <Text style={[validationText, { marginBottom: 20 }]}>{errors.fullName.message}</Text>
          )}
        </View>
        <View style={[input_container, { marginVertical: 30 }]}>
          <Text style={label}>Email</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                style={input}
                autoCapitalize="none"
                placeholder="ex: jon.smith@gmail.com"
                keyboardType="email-address"
                placeholderTextColor={"rgba(136,136,136,.6)"}
              />
            )}
            name="email"
          />
          {errors.email && (
            <Text style={[validationText, { marginBottom: 20 }]}>Email is required</Text>
          )}
        </View>
        <View style={input_container}>
          <Text style={label}>Password</Text>
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: "Password is required",
              },
              minLength: {
                value: 6,
                message: "Password should be at least 6 characters long",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                secureTextEntry={true}
                autoCapitalize="none"
                style={input}
                placeholderTextColor={"rgba(136,136,136,.6)"}
              />
            )}
            name="password"
          />

          {errors.password && (
            <Text style={validationText}>{errors.password.message}</Text>
          )}
        </View>
        <TouchableOpacity style={button} onPress={handleSubmit(signup)} activeOpacity={0.5}>
          <Text style={btn_text}>Sign Up</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: "20%",
          }}
        >
          <Text style={{ color: "gray", fontSize: 17 }}>
            Already have an account?{" "}
          </Text>
          <Link href={"/signin"} style={{ color: "#03ad75", fontSize: 20 }}>
            Sign in
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

export default SignUp;
