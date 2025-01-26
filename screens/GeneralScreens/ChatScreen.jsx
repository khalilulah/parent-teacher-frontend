import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopBarBackNavigation } from "../../components";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL, SOCKET_BASE_URL } from "../../utils/utilFunctions";
import {
  chatsApi,
  useFetchChatsQuery,
} from "../../redux/actions/chat/chatsApi";
import { socket } from "../../utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setMessages } from "../../redux/slices/chat/chatSlice";

const ChatScreen = ({ route, navigation }) => {
  const { chatId, name, userId, receiverId } = route.params; // Extract passed data
  const dispatch = useDispatch();
  const messages = useSelector(
    (state) => state.chat.messages[receiverId] || []
  );
  const allMessages = useSelector((state) => state.chat.messages || []);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    // Fetch messages using RTK Query
    dispatch(
      chatsApi.endpoints.fetchChats.initiate({
        userId,
        otherUserId: receiverId,
      })
    )
      .unwrap()
      .then((data) => {
        dispatch(setMessages({ userId: receiverId, messages: data.data }));
      });
  }, [userId, receiverId, dispatch]);

  useEffect(() => {
    // Set status bar color
    StatusBar.setBarStyle("dark-content"); // For both iOS and Android
    StatusBar.setBackgroundColor("#ffffff"); // Android only

    // Listen for incoming messages
    socket.on("receive_message", (message) => {
      dispatch(addMessage({ userId: message.sender, message }));
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const handleSend = () => {
    if (currentMessage.trim()) {
      const messageData = {
        sender: userId,
        receiver: receiverId,
        message: currentMessage,
      };

      socket.emit("send_message", messageData); // Emit the message to the server
      // Optimistically update the local state
      dispatch(addMessage({ userId: receiverId, message: currentMessage }));
      setCurrentMessage(""); // Clear input
    }
  };

  // if (isLoading) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       {/* Top bar */}
  //       <TopBarBackNavigation
  //         navigation={navigation}
  //         customStyle={{
  //           padding: 16,
  //           flexDirection: "row",
  //           alignItems: "center",
  //           backgroundColor: "white",
  //         }}
  //       >
  //         <Text style={styles.headerTitle}>Loading chats...</Text>
  //       </TopBarBackNavigation>
  //     </SafeAreaView>
  //   );
  // }

  // if (error) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       {/* Top bar */}
  //       <TopBarBackNavigation
  //         navigation={navigation}
  //         customStyle={{
  //           padding: 16,
  //           flexDirection: "row",
  //           alignItems: "center",
  //           backgroundColor: "white",
  //         }}
  //       >
  //         <Text style={styles.headerTitle}>Back</Text>
  //       </TopBarBackNavigation>
  //       <View style={styles.messageBubble}>
  //         <Text style={styles.sender}>
  //           {error?.data?.message ||
  //             error?.data ||
  //             error?.message ||
  //             "An error occured"}
  //         </Text>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <TopBarBackNavigation
        navigation={navigation}
        customStyle={{
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Text style={styles.headerTitle}>{name}</Text>
      </TopBarBackNavigation>

      {/* <ScrollView contentContainerStyle={styles.chatContainer}>
        {messages?.map((chat, index) => (
          <View key={index} style={styles.messageBubble}>
            <Text style={styles.sender}>{chat.firstname}:</Text>
            <Text style={styles.message}>{chat.message}</Text>
          </View>
        ))}
      </ScrollView> */}

      {/* Chat List */}
      <FlatList
        data={messages}
        style={{ padding: 8 }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text
            style={{
              padding: 8,
              backgroundColor: item.sender === userId ? "#d1ddff" : "#ffffff",
              alignSelf: item.sender === userId ? "flex-end" : "flex-start",
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            {item.message}
          </Text>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={currentMessage}
          onChangeText={(text) => setCurrentMessage(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f8",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chatContainer: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "white",
  },
  input: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "white",
    marginRight: 8,
  },
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
  sender: { fontWeight: "bold" },
  message: { marginTop: 2 },
  sendButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#007bff", // Adjust to your theme color
    justifyContent: "center",
    alignItems: "center",
  },
});
