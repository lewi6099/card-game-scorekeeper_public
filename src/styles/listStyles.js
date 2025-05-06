import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const listStyles = StyleSheet.create({
  listContainer: {
    marginTop: 0,
    padding: 15,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row", // Align bullet & text horizontally
    alignItems: "center",
    marginBottom: 8,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.navy1,
    marginRight: 10,
  },
  listText: {
    color: 'black',
    fontSize: 17,
  },
});