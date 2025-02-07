import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { COLORS } from "../../constants/theme";
import { EmptyStateLayout } from "../../components";
import SingleChat from "./SingleChat";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../utils/socket";
import { useFocusEffect } from "@react-navigation/native";
import { setChatList } from "../../redux/slices/chat/chatSlice";

const Chats = ({ navigation }) => {
  // Action dispatcher
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state.auth?.user);
  const cm = useSelector((state) => state.chatList?.chatList);
  const userId = loggedInUser?._id;

  useEffect(() => {
    // Set navigation bar styles
    NavigationBar.setBackgroundColorAsync("white");
    NavigationBar.setButtonStyleAsync("dark");

    if (userId) {
      socket.emit("identify_user", userId);

      const handleUserIdentified = () => socket.emit("get_users", userId);
      socket.on("user_identified", handleUserIdentified);

      return () => {
        socket.off("user_identified", handleUserIdentified);
      };
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        socket.emit("get_users", userId);

        const handleSendUsers = (data) => {
          dispatch(setChatList({ chatList: data }));
        };

        socket.on("send_users", handleSendUsers);

        return () => {
          socket.off("send_users", handleSendUsers);
        };
      }
    }, [userId, dispatch])
  );

  socket.on("send_users", (data) => dispatch(setChatList({ chatList: data })));

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
          source={require("../../assets/icons/logoMini.png")}
        />
        <View>
          <Text style={styles.roleText}>{parseText(loggedInUser?.role)}</Text>
          <Text style={styles.nameText}>
            {loggedInUser?.firstname} {loggedInUser?.surname}
          </Text>
        </View>
      </View>

      {/* Main Body */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {cm.length > 0 ? (
          cm.map((chat, index) => (
            <SingleChat
              key={chat._id || index}
              chat={chat}
              navigation={navigation}
              userId={userId}
              otherUser={chat?.participants?.find(
                (participant) => participant?._id !== userId
              )}
            />
          ))
        ) : (
          <View style={styles.emptyViewContainer}>
            <EmptyStateLayout
              title="Looking for messages?"
              img="noChat"
              supportingText="Conversations will appear here as you start chatting."
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chats;

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
    paddingTop: 40,
  },
});
