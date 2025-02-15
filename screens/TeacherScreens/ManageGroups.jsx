import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useCallback, useState } from "react";
import { COLORS } from "../../constants/theme";
import { EmptyStateLayout, GeneralScreenLayout } from "../../components";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useFetchGroupsQuery } from "../../redux/actions/chat/chatsApi";
import { GroupChat } from "../GeneralScreens";

const ManageGroups = () => {
  const loggedInUser = useSelector((state) => state.auth?.user);

  // For fetching groups
  const { data: groups, error, isLoading, refetch } = useFetchGroupsQuery();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  if (error) {
    return (
      <View style={styles.emptyViewContainer}>
        <Text style={{ color: "red" }}>
          Error: {error?.data?.message || "Failed to load requests"}
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <GeneralScreenLayout>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </GeneralScreenLayout>
    );
  }

  return (
    <GeneralScreenLayout>
      {groups?.data?.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          ListHeaderComponent={() => (
            <Text style={styles.title}>Available Groups Chats</Text>
          )}
          data={groups?.data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <GroupChat chat={item} />}
        />
      ) : (
        <View style={styles.emptyViewContainer}>
          <EmptyStateLayout
            title="You're Not in Any Group Yet"
            img="noChat"
            supportingText="Join or create a group to start chatting with others"
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
export default ManageGroups;
