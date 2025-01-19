import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AuthIntroLayout,
  Button,
  Input,
  TopBarBackNavigation,
} from "../../components";

const ResetPasswordScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = () => {
    if (!newPassword || !confirmNewPassword || !otp) {
      ToastAndroid.show("Please fill in all fields", ToastAndroid.SHORT);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      ToastAndroid.show("Passwords do not match", ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    // Simulate password reset logic
    setTimeout(() => {
      setLoading(false);
      ToastAndroid.show("Password reset successfully", ToastAndroid.SHORT);

      //   Navigate to login screen
      navigation.replace("Login");
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBarBackNavigation navigation={navigation}>
        {"Go Back"}
      </TopBarBackNavigation>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <AuthIntroLayout
          title={"Reset Password"}
          supportingText={
            "Enter the OTP sent to your email and set a new password."
          }
        />

        <View style={styles.inputContainer}>
          <Input
            label="OTP"
            onChangeText={setOtp}
            value={otp}
            placeholder="Enter OTP"
          />
          <Input
            label="New Password"
            onChangeText={setNewPassword}
            value={newPassword}
            placeholder="Enter new password"
            type="password"
          />
          <Input
            label="Confirm New Password"
            onChangeText={setConfirmNewPassword}
            value={confirmNewPassword}
            placeholder="Confirm new password"
            type="password"
          />
        </View>

        <Button onPress={handleResetPassword} disabled={loading}>
          {loading ? "Resetting Password..." : "Reset Password"}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 24,
  },
  inputContainer: {
    width: "100%",
    gap: 12,
  },
});

export default ResetPasswordScreen;
