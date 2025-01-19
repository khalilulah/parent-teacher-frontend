import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AuthIntroLayout,
  Button,
  Input,
  TopBarBackNavigation,
} from "../../components";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (!email) {
      ToastAndroid.show("Please enter your email address", ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    // Simulate OTP sending logic
    setTimeout(() => {
      setLoading(false);
      ToastAndroid.show("OTP sent successfully", ToastAndroid.SHORT);
      // Navigate to OTP verification screen
      navigation.navigate("ResetPassword");
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar with Back Navigation */}
      <TopBarBackNavigation navigation={navigation}>
        {"Go Back"}
      </TopBarBackNavigation>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Forgot Password Intro Layout (Logo, Title and supporting text) */}
        <AuthIntroLayout
          title={"Forgot Password"}
          supportingText={
            "Enter your registered email address. An OTP will be sent to verify your account."
          }
        />

        <View style={styles.inputContainer}>
          {/* Email Input */}
          <Input
            label="Email address"
            onChangeText={setEmail}
            value={email}
            type="email-address"
            placeholder="Enter your email"
          />
        </View>

        {/* CTA - Send OTP */}
        <Button onPress={handleSendOTP} disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
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

export default ForgotPasswordScreen;
