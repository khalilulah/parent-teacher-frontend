import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome } from "@expo/vector-icons"; // Optional for icons
import { Chats, Profile } from "../screens/GeneralScreens";
import { COLORS } from "../constants/theme";

const Tab = createBottomTabNavigator();

const MainAppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "white", // Background color of the tab bar
          shadowColor: "transparent",
          height: 60,
          borderColor: COLORS.lightGray,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12, // Font size for labels
          fontWeight: "600", // Font weight for labels
          fontFamily: "Suse-SemiBold",
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.darkGray,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Chats"
        component={Chats}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons
                name={"chatbubbles-sharp"}
                size={24}
                color={COLORS.primary}
              />
            ) : (
              <Ionicons
                name={"chatbubbles-outline"}
                size={24}
                color={COLORS.darkGray}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontAwesome name={"user"} size={24} color={COLORS.primary} />
            ) : (
              <FontAwesome name={"user-o"} size={24} color={COLORS.darkGray} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainAppNavigator;
