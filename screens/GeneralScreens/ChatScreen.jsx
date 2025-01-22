import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopBarBackNavigation } from "../../components";
import { Ionicons } from "@expo/vector-icons";

const ChatScreen = ({ route, navigation }) => {
  const { chatId, name } = route.params; // Extract passed data
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Set status bar color
    StatusBar.setBarStyle("dark-content"); // For both iOS and Android
    StatusBar.setBackgroundColor("#ffffff"); // Android only
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message); // Replace with your send logic
      setMessage(""); // Clear input field after sending
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/*Top bar */}
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

      <View style={styles.chatContainer}>
        <Text>
          Chat content for {name} (ID: {chatId})
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
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
    flex: 1,
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
