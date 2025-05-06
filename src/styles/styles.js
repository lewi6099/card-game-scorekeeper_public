// styles.js
import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray1,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.navy2,
    textAlign: "left",
    marginBottom: 10,
  },
  header2: {
    fontSize: 20,
    fontStyle: "italic",
    color: theme.colors.navy2,
    textAlign: "left",
    marginBottom: 20,
  },
  scrollContainer: {
    marginTop: 0,
    marginBottom: 20,
  },
  checkbox: {
    backgroundColor: theme.colors.cyan2,
    borderWidth: 0,
    borderRadius: 8,
    paddingVertical: 10,
  },
  checkboxText: {
    color: theme.colors.navy2,
    fontSize: 16,
  },
  dropdownText: {
    color: theme.colors.navy2,
    fontSize: 16,
    paddingBottom: 10,
  },
  button: {
    backgroundColor: theme.colors.navy1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 0,
    width: "100%",
  },
  buttonText: {
    color: 'black',
  },
  secondaryButton: {
    backgroundColor: theme.colors.gray3,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 0,
    width: "100%",
  },
  thirdButton: {
    backgroundColor: theme.colors.orange3,
    borderRadius: 8,
    paddingVertical: 12,
    alignSelf: "center",
    marginTop: 20,
    borderWidth: 0,
    width: "100%",
  },
  input: {
    backgroundColor: theme.colors.gray2,
    height: 40,
    paddingHorizontal: 10,
    flex: 2,
    borderRadius: 8,
  },
  placeholderText: {
    color: theme.colors.gray3,
  },
  input2: {
    backgroundColor: theme.colors.gray2,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: 'black',
    fontWeight: 'normal',
    textAlign: 'left',
    justifyContent: 'center',
    marginBottom: 30,
  },
  gameDetailsHeader: {
    fontSize: 26,
    color: theme.colors.gray4,
    marginBottom: 5,
    textAlign: 'center',
  },
  gameDetailsHeader2: {
    fontSize: 18,
    color: theme.colors.gray4,
    marginBottom: 20,
    textAlign: 'center',
  },
  headerIconRight: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  headerIconLeft: {
    width: 24,
    height: 24,
    marginLeft: 15,
  },
  
});

export const buttonRowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftButton: {
    flex: 1,
    marginRight: 10, // Small gap
  },
  rightButton: {
    flex: 1,
    marginLeft: 10, // Small gap
  },
});