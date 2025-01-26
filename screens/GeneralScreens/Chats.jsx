// import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
// import React, { useEffect, useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import * as NavigationBar from "expo-navigation-bar";
// import { COLORS } from "../../constants/theme";
// import { AuthIntroLayout, EmptyStateLayout } from "../../components";
// import SingleChat from "./SingleChat";

// const Chats = () => {
//   const [chatMesasages, setChatMessages] = useState([1, 2, 3, 4]);

//   // Set phone's nav background color
//   useEffect(() => {
//     // Changes bg color to white
//     NavigationBar.setBackgroundColorAsync("white");

//     // Changes button color to dark gray
//     NavigationBar.setButtonStyleAsync("dark");
//   }, []);
//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Logo */}
//       <View style={styles.topBar}>
//         <Image
//           style={styles.loginImage}
//           source={require("../../assets/icons/logoMini.png")}
//         />
//       </View>

//       {/* Main body */}
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {chatMesasages?.length > 0 ? (
//           chatMesasages?.map((singleMessage, index) => {
//             return <SingleChat key={index} />;
//           })
//         ) : (
//           <View style={styles.emptyViewContainer}>
//             <EmptyStateLayout
//               title={"Looking for messages?"}
//               img={"noChat"}
//               supportingText={
//                 " Conversations will appear here as you start chatting."
//               }
//             />
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Chats;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: COLORS.offWhite,
//     flex: 1,
//   },
//   topBar: {
//     padding: 16,
//     paddingTop: 24,
//     paddingBottom: 0,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   loginImage: {
//     resizeMode: "contain",
//     height: 30,
//   },
//   emptyViewContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//     gap: 6,
//   },
//   scrollContainer: {
//     flex: 1,
//     alignItems: "center",
//     padding: 16,
//     paddingTop: 40,
//     gap: 8,
//   },
// });

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { COLORS } from "../../constants/theme";
import { EmptyStateLayout } from "../../components";
import SingleChat from "./SingleChat";
import { useSelector } from "react-redux";
import { socket } from "../../utils/socket";

const Chats = ({ navigation }) => {
  const loggedInUser = useSelector((state) => state.auth?.user); //Logged in user

  const userId = loggedInUser?._id; // Replace with the actual user ID

  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    // Set phone's nav background color
    NavigationBar.setBackgroundColorAsync("white");
    NavigationBar.setButtonStyleAsync("dark");

    socket.emit("identify_user", userId); // Send user ID to the server

    socket.on("user_identified", () => {
      socket.emit("get_users", userId);
    });
  }, []);

  useEffect(() => {
    // Listen for incoming users
    socket.on("send_users", (data) => {
      setChatMessages(data);
    });

    return () => {
      socket.off("send_users");
    };
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
        {chatMessages?.length > 0 ? (
          chatMessages.map((chat, index) => (
            <SingleChat
              key={index}
              chat={chat}
              navigation={navigation}
              userId={userId}
            />
          ))
        ) : (
          <View style={styles.emptyViewContainer}>
            <EmptyStateLayout
              title={"Looking for messages?"}
              img={"noChat"}
              supportingText={
                "Conversations will appear here as you start chatting."
              }
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
    paddingBottom: 0,
    flexDirection: "row",
    alignItems: "center",
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
    gap: 6,
  },
  scrollContainer: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    paddingTop: 40,
    gap: 8,
  },
  singleChat: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    width: "100%",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
});
