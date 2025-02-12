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
import {
  useAddExistingGuardianMutation,
  useLoginMutation,
  useRegisterGuardianMutation,
} from "../../redux/actions/auth/authApi";

const ManageGuardiansScreen = () => {
  const [registerGuardian, { isLoading, error }] =
    useRegisterGuardianMutation();
  const [
    addExistingGuardian,
    {
      isLoading: isAddExistingGuardianLoading,
      error: addExistingGuardianError,
    },
  ] = useAddExistingGuardianMutation();

  const [activeTab, setActiveTab] = useState("new");
  const [formData, setFormData] = useState({
    firstname: "",
    surname: "",
    email: "",
    guardianUsername: "",
  });

  const dispatch = useDispatch();

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    try {
      if (!formData.firstname || !formData.surname || !formData.email) {
        ToastAndroid.show(
          "Error: All fields are required.",
          ToastAndroid.SHORT
        );
        return;
      }
      const res = await registerGuardian(formData).unwrap();
      const successMewssage = res?.message;
      ToastAndroid.show(
        `${successMewssage || "Success: Guardian registered successfully."}`,
        ToastAndroid.SHORT
      );

      //   Reset form
      setFormData({
        firstname: "",
        surname: "",
        email: "",
        guardianUsername: formData?.guardianUsername,
      });
    } catch (error) {
      console.error(error);
      const errorMewssage = error?.data?.message;
      ToastAndroid.show(
        `${errorMewssage || "An error occured. Please try again"}`,
        ToastAndroid.SHORT
      );
    }
  };

  const handleAddExisting = async () => {
    try {
      if (!formData.guardianUsername) {
        ToastAndroid.show("Error: Username is required.", ToastAndroid.SHORT);
        return;
      }

      const res = await addExistingGuardian(formData).unwrap();

      const successMewssage = res?.message;
      ToastAndroid.show(
        `${successMewssage || "Success: Guardian registered successfully."}`,
        ToastAndroid.SHORT
      );

      //   Reset form
      setFormData({
        firstname: formData?.firstname,
        surname: formData?.surname,
        email: formData?.email,
        guardianUsername: "",
      });
    } catch (error) {
      console.error(error);
      const errorMewssage = error?.data?.message;
      ToastAndroid.show(
        `${errorMewssage || "An error occured. Please try again"}`,
        ToastAndroid.SHORT
      );
    }
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
                value={formData.firstname}
                onChangeText={(text) => handleChange("firstname", text)}
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

            <Button onPress={handleRegister} disabled={isLoading}>
              {isLoading ? "Please wait ..." : "Register Guardian"}
            </Button>
          </View>
        )}

        {/* Existing Guardian Form */}
        {activeTab === "existing" && (
          <View style={{ gap: 40 }}>
            <Input
              label="Guardian Username"
              value={formData.guardianUsername}
              onChangeText={(text) => handleChange("guardianUsername", text)}
              placeholder="Enter username"
            />

            <Button
              onPress={handleAddExisting}
              disabled={isAddExistingGuardianLoading}
            >
              {isAddExistingGuardianLoading
                ? "Please wait ..."
                : "Add Guardian"}
            </Button>
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
