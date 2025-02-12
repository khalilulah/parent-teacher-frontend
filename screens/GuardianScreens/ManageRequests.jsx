import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { COLORS } from "../../constants/theme";
import { EmptyStateLayout, GeneralScreenLayout } from "../../components";
import { useFocusEffect } from "@react-navigation/native";
import { useFetchRequestsQuery } from "../../redux/actions/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { resetUnreadRequests } from "../../redux/slices/guardian/requestSlice";

const ManageRequests = () => {
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(resetUnreadRequests()); // Clear badge when screen is focused
    }, [dispatch])
  );

  const loggedInUser = useSelector((state) => state.auth?.user);
  const guardianId = loggedInUser?._id;

  // Directly use RTK Query's hook to fetch data
  const {
    data: requests,
    error,
    isLoading,
  } = useFetchRequestsQuery(guardianId);

  if (error) {
    return (
      <View style={styles.emptyViewContainer}>
        <Text style={{ color: "red" }}>
          Error: {error?.data?.message || "Failed to load requests"}
        </Text>
      </View>
    );
  }

  const handleAction = async (requestId, action) => {
    try {
      await axios.post(`/api/${action}-request`, { requestId, guardianId });
      setRequests(requests.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error(`Error ${action} request`, error);
    }
  };

  if (isLoading) {
    return (
      <GeneralScreenLayout>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </GeneralScreenLayout>
    );
  }

  return (
    <GeneralScreenLayout>
      {requests?.data?.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          ListHeaderComponent={() => (
            <Text style={styles.title}>Pending Requests</Text>
          )}
          data={requests?.data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 15,
                borderRadius: 10,
                backgroundColor: "rgba(242, 242, 242, 0.2)",
                marginBottom: 10,
              }}
            >
              <Text style={styles.roleText}>
                {item.teacher.firstname} {item.teacher.surname}
              </Text>
              <Text style={{ fontSize: 14, color: COLORS.darkGray }}>
                {item.message}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 0,
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() => handleAction(item._id, "accept")}
                  style={styles.acceptButton}
                >
                  <Text
                    style={{
                      color: COLORS.success,
                      fontFamily: "Suse-SemiBold",
                    }}
                  >
                    Accept
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAction(item._id, "reject")}
                  style={styles.rejectButton}
                >
                  <Text
                    style={{ color: COLORS.error, fontFamily: "Suse-SemiBold" }}
                  >
                    Reject
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyViewContainer}>
          <EmptyStateLayout
            title="Your Request Box is Empty"
            img="noChat"
            supportingText="Your requests will appear here as they come in"
          />
        </View>
      )}
    </GeneralScreenLayout>
  );
};

const styles = {
  emptyViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
    flexGrow: 1,
  },
  roleText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Suse-Bold",
  },
  title: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Suse-Bold",
    color: COLORS.primary,
  },
  acceptButton: {
    backgroundColor: COLORS.lightSuccess,
    color: COLORS.success,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: COLORS.lightError,
    color: COLORS.error,
    padding: 10,
    borderRadius: 5,
  },
};
export default ManageRequests;
