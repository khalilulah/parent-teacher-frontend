import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { COLORS } from "../../constants/theme";

const Chats = () => {
  // Set phone's nav background color
  useEffect(() => {
    // Changes bg color to white
    NavigationBar.setBackgroundColorAsync("#fff");

    // Changes button color to dark gray
    NavigationBar.setButtonStyleAsync("dark");
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <View style={styles.topBar}>
        <Image
          style={styles.loginImage}
          source={require("../../assets/icons/logoMini.png")}
        />
      </View>

      {/* Main body */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text>Chatssss</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chats;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.offWhite,
    flex: 1,
  },
  topBar: {
    padding: 16,
    paddingBottom: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  loginImage: {
    resizeMode: "contain",
    height: 30,
  },
  scrollContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 24,
  },
});
