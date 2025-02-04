import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "../../constants/theme";

const SingleChat = ({ navigation, chat, userId, otherUser }) => {
  return (
    <>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ChatScreen", {
            chatId: chat?.chatId,
            name: otherUser?.firstname,
            receiverId: chat?._id,
            userId,
          })
        }
        style={styles.container}
      >
        {/* Profile Image */}
        {/* Name and chat */}
        <View style={styles.profile}>
          <Text style={styles.profileText}>
            {otherUser?.firstname[0]?.toUpperCase()}
            {otherUser?.surname[0]?.toUpperCase()}
          </Text>
        </View>

        {/* Name and chat */}
        <View style={styles.mainChatItem}>
          <Text style={styles.mainChatItemTitle}>{otherUser?.firstname}</Text>
          <Text style={styles.mainChatItemSupport}>SingleChat</Text>
        </View>

        {/* RHS CONTAINER - (Date and Unread messages notification) */}
        <View style={styles.rhsContainer}>
          {/* Date */}
          <Text style={styles.time}>Today</Text>

          {/* Unread messages */}
          <View style={styles.notificationItem}>
            <Text style={styles.mainChatItemSupport}>SingleChat</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default SingleChat;

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    gap: 8,
  },
  profile: {
    height: 50,
    width: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCE6E9",
    // backgroundColor: "#D3E3FD",
    borderRadius: "50%",
  },
  profileText: {
    fontFamily: "Suse-SemiBold",
    fontSize: FONTS.medium,
  },
  mainChatItem: {
    flex: 1,
    paddingTop: 4,
  },
  notificationItem: {
    flex: 1,
    padding: 4,
    backgroundColor: COLORS.primary,
  },
  mainChatItemTitle: {
    fontFamily: "Suse-SemiBold",
    fontSize: FONTS.medium,
    fontWeight: 600,
  },
  mainChatItemSupport: {
    fontFamily: "Suse-SemiBold",
    fontSize: FONTS.small,
    fontWeight: 600,
    color: COLORS.darkGray,
  },

  rhsContainer: {
    justifyContent: "space-between",
  },

  time: {
    fontFamily: "Suse-SemiBold",
    paddingTop: 4,
    fontSize: FONTS.small,
    fontWeight: 600,
    color: COLORS.primary,
  },
});
