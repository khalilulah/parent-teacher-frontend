import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { COLORS } from "../../constants/theme";
import { ConfirmationModal, EmptyStateLayout } from "../../components";
import SingleChat from "./SingleChat";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../utils/socket";
import { useFocusEffect } from "@react-navigation/native";
import { setChatList } from "../../redux/slices/chat/chatSlice";
import { logout } from "../../redux/slices/auth/authSlice";

const Chats = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Action dispatcher
  const dispatch = useDispatch();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const loggedInUser = useSelector((state) => state.auth?.user);
  const cm = useSelector((state) => state.chatList?.chatList);
  const userId = loggedInUser?._id;

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    navigation.replace("Login");
  };
  // End of logout function

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

  console.log("Heyy");
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
    <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
      <SafeAreaView style={styles.container}>
        <ConfirmationModal
          visible={modalVisible}
          message={`Are you sure you want to logout?`}
          onConfirm={handleLogout}
          onCancel={() => {
            setModalVisible(false);
            setDropdownVisible(false);
          }}
        />

        {/* Header */}
        <View style={styles.topBar}>
          <Image
            style={styles.loginImage}
            source={require("../../assets/icons/logoMini.png")}
          />

          {/* User details */}
          <TouchableOpacity
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <View>
              <Text style={styles.roleText}>
                {parseText(loggedInUser?.role)}
              </Text>
              <Text style={styles.nameText}>
                {loggedInUser?.firstname} {loggedInUser?.surname}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Dropdown */}
        {dropdownVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}

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
    </TouchableWithoutFeedback>
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
  dropdownMenu: {
    position: "absolute",
    top: 80,
    right: 16,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: { paddingVertical: 5, paddingHorizontal: 15, width: 120 },
  dropdownText: { fontSize: 14, fontWeight: "500", fontFamily: "Suse-Bold" },
});
