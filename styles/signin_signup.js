import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 180,
    height: 180,
    marginTop: "20%",
    objectFit: "fill",
  },
  heading: {
    fontSize: 30,
    color: "black",
    marginTop: 20,
    marginBottom: 80,
    fontWeight: "bold",
  },
  input_container: {
    width: "95%",
    height: "auto",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(136,136,136,.1)",
    paddingVertical: 20,
    paddingHorizontal: 15,
    fontSize: 20,
    borderRadius: 15,
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
    color: "gray",
  },
  button: {
    marginTop: 70,
    backgroundColor: "#03ad75",
    width: "95%",
    borderRadius: 15,
    marginBottom: 35,
  },
  btn_text: {
    fontSize: 25,
    color: "white",
    textAlign: "center",
    marginVertical: 15,
    fontWeight: "700",
  },
  validationText: {
    color: "red",
    fontSize: 17,
    marginTop: 5
  },
});
