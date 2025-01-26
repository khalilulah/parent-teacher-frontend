import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopBarBackNavigation } from "../../components";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL, SOCKET_BASE_URL } from "../../utils/utilFunctions";
import { useFetchChatsQuery } from "../../redux/actions/chat/chatsApi";
import { socket } from "../../utils/socket";

const ChatScreen = ({ route, navigation }) => {
  const { chatId, name, userId, receiverId } = route.params; // Extract passed data
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const { data, isLoading, error } = useFetchChatsQuery({
    userId,
    otherUserId: receiverId,
  });

  // Sync fetched data with chatMessages
  useEffect(() => {
    if (data) {
      setChatMessages(data?.data); // Update only when `data` changes
    }
  }, [data]);

  console.log(data);

  useEffect(() => {
    // Set status bar color
    StatusBar.setBarStyle("dark-content"); // For both iOS and Android
    StatusBar.setBackgroundColor("#ffffff"); // Android only

    // Listen for incoming messages
    socket.on("receive_message", (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]); // Append new messages
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
      setChatMessages((prevMessages) => [...prevMessages, messageData]); // Optimistic update
      setCurrentMessage(""); // Clear input
    }
  };

  if (isLoading) {
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
          <Text style={styles.headerTitle}>Loading chats...</Text>
        </TopBarBackNavigation>
      </SafeAreaView>
    );
  }

  if (error) {
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
          <Text style={styles.headerTitle}>Back</Text>
        </TopBarBackNavigation>
        <View style={styles.messageBubble}>
          <Text style={styles.sender}>{error?.data?.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

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

      <ScrollView contentContainerStyle={styles.chatContainer}>
        {chatMessages?.map((chat, index) => (
          <View key={index} style={styles.messageBubble}>
            <Text style={styles.sender}>{chat.firstname}:</Text>
            <Text style={styles.message}>{chat.message}</Text>
          </View>
        ))}
      </ScrollView>
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

// import {
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
//   TouchableOpacity,
// } from "react-native";
// import React, { useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons"; // Add this for the icon

// const ChatScreen = ({ route, navigation }) => {
//   const { chatId, name } = route.params; // Extract passed data
//   const [message, setMessage] = useState("");

//   const handleSend = () => {
//     if (message.trim()) {
//       console.log("Sending message:", message); // Replace with your send logic
//       setMessage(""); // Clear input field after sending
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>{name}</Text>
//       </View>

//       {/* Chat Container */}
//       <View style={styles.chatContainer}>
//         <Text>
//           Chat content for {name} (ID: {chatId})
//         </Text>
//       </View>

//       {/* Input Container */}
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type a message..."
//           value={message}
//           onChangeText={setMessage}
//           onSubmitEditing={handleSend} // Handle send on "Enter" key press
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
//           <Ionicons name="send" size={24} color="white" />
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ChatScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f8f8",
//   },
//   header: {
//     padding: 16,
//     backgroundColor: "white",
//     elevation: 2,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   chatContainer: {
//     flex: 1,
//     padding: 16,
//   },
//   inputContainer: {
// flexDirection: "row",
// alignItems: "center",
//     padding: 8,
//     borderTopWidth: 1,
//     borderColor: "#eaeaea",
//     backgroundColor: "white",
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     backgroundColor: "#fff",
//     marginRight: 8,
//   },
//   sendButton: {
//     height: 40,
//     width: 40,
//     borderRadius: 20,
//     backgroundColor: "#007bff", // Adjust to your theme color
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
