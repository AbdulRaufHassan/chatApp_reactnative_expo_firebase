import { StyleSheet } from "react-native";

export const chatPageStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#03ad75",
    paddingLeft: 17,
    paddingRight: 20,
    paddingTop: 35,
    paddingBottom: 10,
    width: "100%",
  },
  avatar: {
    height: 65,
    width: 65,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(237, 239, 242)",
  },
});
