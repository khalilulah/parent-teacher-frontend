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
import React, { useEffect, useRef, useState } from "react";
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
  const messages = useSelector((state) => state.chat.messages[chatId] || []);
  const [currentMessage, setCurrentMessage] = useState("");
  const flatListRef = useRef(null); // Create a ref for the FlatList

  useEffect(() => {
    // Fetch messages using RTK Query
    dispatch(
      chatsApi.endpoints.fetchChats.initiate(
        { chatId },
        { forceRefetch: true } // This option bypasses the cache
      )
    )
      .unwrap()
      .then((data) => {
        dispatch(setMessages({ chatId, messages: data.data }));
        console.log("Setting message");
      });

    // Scroll to the bottom
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: false });
    }
  }, [chatId, dispatch]);

  useEffect(() => {
    // Set status bar color
    StatusBar.setBarStyle("dark-content"); // For both iOS and Android
    StatusBar.setBackgroundColor("#ffffff"); // Android only

    // Listen for incoming messages
    socket.on("receive_message", (message) => {
      dispatch(addMessage({ chatId, message }));
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const handleSend = () => {
    if (currentMessage.trim()) {
      const messageData = {
        sender: userId,
        message: currentMessage,
        chatId,
      };

      socket.emit("send_message", messageData); // Emit the message to the server
      // Optimistically update the local state
      dispatch(addMessage({ chatId, message: currentMessage }));
      setCurrentMessage(""); // Clear input
    }
  };
  useEffect(() => {
    // Join chat room
    socket.emit("join_chat", chatId);

    return () => {
      // Leave the room when the screen is closed
      socket.emit("leave_chat", chatId);
    };
  }, [chatId]);

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

      {/* Chat List */}
      <FlatList
        data={messages}
        ref={flatListRef} // Attach the ref to the FlatList
        style={{ padding: 8 }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          item.message && (
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
          )
        }
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
