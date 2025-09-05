import React, {useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { AppUserContext } from "../contexts/AppUserContext";
import axios from 'axios';
import { saveSecurely } from "../utils/storage";
import { AppScanHistoryContext } from "../contexts/AppScanHistoryContext";
import { loginUser } from "../services/UserService";

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setAppUser } = useContext(AppUserContext);
    const { setAppScanHistory } = useContext(AppScanHistoryContext)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login here</Text>
      <Text style={styles.subtitle}>Track your scans and stay on top of your purchases!</Text>

      <TextInput placeholder="Username" style={styles.input} onChangeText={newUsername=>setUsername(newUsername)}/>
      <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={newPassword=>setPassword(newPassword)}/>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signInButton} onPress={async () =>
      {
          const data={
          username: username,
          password: password
          }
          try{
          // const result = await axios.post("http://192.168.0.183:5000/user/login",data);
          const result = await loginUser(data);
          await setAppUser(result.data);
          await saveSecurely("profileAppUser",result.data);

          console.log("This is the data fetched for the user!!!");
          console.log(result.data);
          navigation.navigate("Action");
          }
          catch (error){
            alert('Incorrect username or password!');
            console.debug(error);
          }
          }}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() =>{
        navigation.navigate("Register");
      }}>
        <Text style={styles.createAccount}>Create new account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E1E1E",
  },
  subtitle: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginVertical: 10,
  },
  input: {
    width: "80%",
    padding: 15,
    backgroundColor: "#EDEDED",
    borderRadius: 8,
    marginVertical: 10,
  },
  forgotPassword: {
    color: "#00C04B",
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: "#00C04B",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginVertical: 10,
  },
  signInText: {
    color: "white",
    fontWeight: "bold",
  },
  createAccount: {
    marginVertical: 10,
    color: "#555",
  },
});

export default LoginScreen;
