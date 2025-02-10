import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { useDispatch } from "react-redux";
import { COLORS } from "../../constants/theme";
import { Button, GeneralScreenLayout, Input } from "../../components";

const ManageGuardiansScreen = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    username: "",
  });

  const dispatch = useDispatch();

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = () => {
    if (!formData.firstName || !formData.surname || !formData.email) {
      ToastAndroid.show("Error: All fields are required.", ToastAndroid.SHORT);
      return;
    }
    dispatch(registerGuardian(formData))
      .then(() =>
        ToastAndroid.show("Success: Guardian registered successfully.")
      )
      .catch(() => ToastAndroid.show("Error: Failed to register guardian."));
  };

  const handleAddExisting = () => {
    if (!formData.username) {
      ToastAndroid.show("Error: Username is required.");
      return;
    }
    dispatch(addExistingGuardian(formData.username))
      .then(() => ToastAndroid.show("Success: Guardian added successfully."))
      .catch(() => ToastAndroid.show("Error: Failed to add guardian."));
  };

  return (
    <GeneralScreenLayout>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 40, // Ensure space at bottom
        }}
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tab Switch */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("new")}
            style={[
              styles.tabButton,
              activeTab === "new" && styles.activeTabButton,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "new" && styles.activeTabText,
              ]}
            >
              New Guardian
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("existing")}
            style={[
              styles.tabButton,
              activeTab === "existing" && styles.activeTabButton,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "existing" && styles.activeTabText,
              ]}
            >
              Existing Guardian
            </Text>
          </TouchableOpacity>
        </View>

        {/* New Guardian Form */}
        {activeTab === "new" && (
          <View style={{ gap: 40 }}>
            <View style={{ gap: 8 }}>
              <Input
                label="First Name"
                value={formData.firstName}
                onChangeText={(text) => handleChange("firstName", text)}
                placeholder="Enter first name"
              />

              <Input
                label="Surname"
                value={formData.surname}
                onChangeText={(text) => handleChange("surname", text)}
                placeholder="Enter surname"
              />

              <Input
                label="Email"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                placeholder="Enter email"
                keyboardType="email-address"
              />
            </View>

            <Button onPress={handleRegister}>Register Guardian</Button>
          </View>
        )}

        {/* Existing Guardian Form */}
        {activeTab === "existing" && (
          <View style={{ gap: 40 }}>
            <Input
              label="Guardian Username"
              value={formData.username}
              onChangeText={(text) => handleChange("username", text)}
              placeholder="Enter username"
            />

            <Button onPress={handleAddExisting}>Add Guardian</Button>
          </View>
        )}
      </ScrollView>
    </GeneralScreenLayout>
  );
};

const styles = {
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: COLORS.lightGray,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Suse-Bold",
    color: COLORS.darkGray,
  },
  activeTabText: {
    color: "white",
  },
};

export default ManageGuardiansScreen;
