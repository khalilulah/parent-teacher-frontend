import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { useSelector } from "react-redux";

const GeneralScreenLayout = ({ navigation, children }) => {
  const loggedInUser = useSelector((state) => state.auth?.user);

  useEffect(() => {
    // Set navigation bar styles
    NavigationBar.setBackgroundColorAsync("white");
    NavigationBar.setButtonStyleAsync("dark");
  }, []);

  // Memoized function to avoid unnecessary re-renders
  const parseText = useMemo(() => {
    return (text) => {
      const roleMapping = {
        superAdmin: "Super Admin",
        teacher: "Teacher",
        guardian: "Guardian",
      };
      return roleMapping[text] || text;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <Image
          style={styles.loginImage}
          source={require("../assets/icons/logoMini.png")}
        />
        <View>
          <Text style={styles.roleText}>{parseText(loggedInUser?.role)}</Text>
          <Text style={styles.nameText}>
            {loggedInUser?.firstname} {loggedInUser?.surname}
          </Text>
        </View>
      </View>

      {/* Main Body */}
      {children}
    </SafeAreaView>
  );
};

export default GeneralScreenLayout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  topBar: {
    padding: 16,
    paddingTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roleText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Suse-Bold",
    textAlign: "right",
  },
  nameText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Suse-Regular",
    textAlign: "right",
  },
  loginImage: {
    resizeMode: "contain",
    height: 30,
  },
  emptyViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  scrollContainer: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    flexGrow: 1,
  },
});
