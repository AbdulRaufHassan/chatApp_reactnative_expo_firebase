import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#03ad75",
    paddingLeft: 17,
    paddingRight: 20,
    paddingTop: 35,
    paddingBottom: 20,
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
  searchField: {
    height: 60,
    width: "98%",
    borderWidth: 2,
    borderColor: "rgb(215, 217, 219)",
    paddingHorizontal: 20,
    color: "gray",
    fontSize: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  user: {
    flexDirection: "row",
    height: "auto",
    backgroundColor: "rgb(215, 217, 219)",
    width: "96%",
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginVertical: 6,
    borderRadius: 12,
    marginHorizontal: "2%",
    elevation:5
  },
  userAvatar: {
    height: 57,
    width: 57,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation:5
  },
});
