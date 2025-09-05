import React, {useState, useContext} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AppUserContext } from "../contexts/AppUserContext.js";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [weight, setWeight] = useState("");
  const {appUser, setAppUser} = useContext(AppUserContext);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Create an account to scan products, compare prices, and manage your spending!
      </Text>

      <TextInput placeholder="Username" style={styles.input} keyboardType="string" onChangeText={newUsername => setUsername(newUsername)}/>
      <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={newPassword => setPassword(newPassword)}/>
      <TextInput placeholder="Confirm Password" style={styles.input} secureTextEntry onChangeText={newConfirmPassword => setConfirmPassword(newConfirmPassword)}/>
      <TextInput placeholder="Weight" style={styles.input} keyboardType="numeric" onChangeText={newWeight => setWeight(newWeight)}/>

      <TouchableOpacity style={styles.signUpButton} onPress=
        {async () => {
          if (username==""){
            alert("Username field is not optional!");
            return;
          }
          if (password==""){
            alert("Password field is not optional!");
            return;
          }
          if (confirmPassword!=password){
            alert("Password and confirm password must match!");
            return;
          }
          if (!Number.isInteger(Number(weight)) || Number(weight) <= 0){
            alert("Weight must be > 0 !");
            return;
          }
          console.log('Password: '+password);
          console.log('Confirm Password: '+confirmPassword);
          if (confirmPassword != password){
              console.log('Password does not match!');
              return;
          }

           const data={
            username: username,
            password: password,
            weight: parseInt(weight)
           }
          await setAppUser(data);
          navigation.navigate("Health");
        }}>

        <Text style={styles.signUpText}>Next</Text>
      </TouchableOpacity>
          <TouchableOpacity onPress={() =>{
            navigation.navigate("Login");
          }}>
        <Text style={styles.alreadyAccount}>Already have an account</Text>
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
  signUpButton: {
    backgroundColor: "#00C04B",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginVertical: 10,
  },
  signUpText: {
    color: "white",
    fontWeight: "bold",
  },
  alreadyAccount: {
    marginVertical: 10,
    color: "#555",
  },
  orContinue: {
    color: "#555",
    marginVertical: 10,
  },
});

export default RegisterScreen;