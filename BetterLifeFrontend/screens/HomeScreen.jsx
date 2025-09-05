import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logoBetterLife.png')}/>
      <Text style={styles.title}>Get ready for a better life</Text>
      <View style={styles.row_container}>
        <TouchableOpacity style={styles.loginButton} onPress={() => {
            navigation.navigate("Login");
        }}>
            <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={() => {
            navigation.navigate("Register");
        }}>
            <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
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
    margin: 10,
    color: "#006BAD",
    fontSize: 35,
    textAlign: "center",
    fontFamily: "Poppins",
  },
  row_container: {
    flexDirection: "row",
    gap: 30,
    position: "relative",
  },
  loginButton: {
    width: 160,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#00C04B",
    alignItems: "center",
  },
  loginText: {
    color: "#FFF",
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
  },
  registerButton: {
    width: 160,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  registerText: {
    color: "#0A0A0A",
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
  },
});

export default HomeScreen;
