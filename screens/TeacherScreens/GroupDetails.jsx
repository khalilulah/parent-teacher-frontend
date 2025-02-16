import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  StyleSheet,
  ScrollView,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";

import {
  useModifyGroupUsersMutation,
  useRenameGroupMutation,
  useDeleteGroupMutation,
  useFetchUsersQuery,
} from "../../redux/actions/chat/chatsApi";
import {
  Button,
  ConfirmationModal,
  Input,
  TopBarBackNavigation,
} from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";

const GroupDetails = ({ navigation, route }) => {
  const { chat, currentUserId } = route.params; // Pass currentUserId from navigation
  console.log(route.params);
  const [newGroupName, setNewGroupName] = useState(chat.name);
  const [renameGroup, { isLoading: isRenaming }] = useRenameGroupMutation();
  const [deleteGroup, { isLoading: isDeleting }] = useDeleteGroupMutation();
  const [modifyGroupUsers, { isLoading: isModifyingUsers }] =
    useModifyGroupUsersMutation();

  // Fetch all users to add
  const { data: users = [] } = useFetchUsersQuery();
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const openConfirmationModal = (userId, action) => {
    setSelectedUser(userId);
    setSelectedAction(action);
    setModalVisible(true);
  };

  const handleRenameGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      await renameGroup({
        chatId: chat.chatId,
        newName: newGroupName,
      }).unwrap();
      ToastAndroid.show("Group renamed!", ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to rename group";
      ToastAndroid.show(`${errorMessage}`, ToastAndroid.SHORT);
    }
  };

  // const handleDeleteGroup = async () => {
  //   try {
  //     await deleteGroup(chat._id).unwrap();
  //     ToastAndroid.show("Group deleted", ToastAndroid.SHORT);
  //     navigation.goBack();
  //   } catch (error) {
  //     ToastAndroid.show("Failed to delete", ToastAndroid.SHORT);
  //   }
  // };

  const confirmAction = async () => {
    setModalVisible(false);
    try {
      if (selectedAction === "remove") {
        await modifyGroupUsers({
          groupId: chat._id,
          userId: selectedUser,
          action: "remove",
        }).unwrap();
        ToastAndroid.show("User removed", ToastAndroid.SHORT);
      } else if (selectedAction === "delete") {
        await deleteGroup(chat._id).unwrap();
        ToastAndroid.show("Group deleted", ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      ToastAndroid.show("Action failed", ToastAndroid.SHORT);
    }
  };
  const handleModifyUser = async (userId, action) => {
    if (userId === currentUserId && action === "remove") {
      ToastAndroid.show("You cannot remove yourself!", ToastAndroid.SHORT);
      return;
    }
    try {
      await modifyGroupUsers({ groupId: chat._id, userId, action }).unwrap();
      ToastAndroid.show(`User ${action}ed`, ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show("Failed to modify user", ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
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

      <ScrollView contentContainerStyle={styles.content} style={styles.content}>
        <Text style={styles.headerGroupTitle}>Manage Group</Text>

        {/* Rename Group */}
        <Input
          label="Rename Group"
          value={newGroupName}
          onChangeText={setNewGroupName}
        />
        <Button onPress={handleRenameGroup} disabled={isRenaming}>
          {isRenaming ? "Renaming..." : "Rename Group"}
        </Button>

        {/* Users List */}
        <Text style={styles.sectionTitle}>Group Members</Text>
        <FlatList
          data={chat.participants}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.userRow}>
              {/* {console.log(item)}
              {console.log(currentUserId)} */}
              <Text style={styles.userName}>
                {item.firstname} {item.surname}
              </Text>
              {item._id !== currentUserId && (
                <TouchableOpacity
                  onPress={() => openConfirmationModal(item._id, "remove")}
                >
                  <MaterialIcons name="delete" size={24} color={COLORS.error} />
                </TouchableOpacity>
              )}
            </View>
          )}
        />

        {/* Add Users */}
        <Button onPress={() => setShowAddUserModal(true)}>Add Users</Button>

        {/* Delete Group */}
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <View
          style={{
            backgroundColor: COLORS.lightError,
            padding: 16,
            borderRadius: 8,
            gap: 20,
          }}
        >
          <Text style={{ fontFamily: "Suse-SemiBold" }}>
            Once you delete a repository, there is no going back. Please be
            certain.
          </Text>
          <Button
            variant="danger"
            onPress={() => openConfirmationModal(null, "delete")}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Group"}
          </Button>
        </View>
      </ScrollView>

      {/* Add User Modal */}
      <Modal
        visible={showAddUserModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddUserModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Users</Text>
            <FlatList
              data={users?.data?.filter(
                (user) => !chat.participants.some((p) => p._id === user._id)
              )}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.addUserRow}
                  onPress={() => {
                    handleModifyUser(item._id, "add");
                    setShowAddUserModal(false);
                  }}
                >
                  <Text style={styles.userName}>
                    {item.firstname} {item.surname}
                  </Text>
                  <Text style={styles.addText}>Add</Text>
                </TouchableOpacity>
              )}
            />
            <Button
              variant="secondary"
              onPress={() => setShowAddUserModal(false)}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>

      <ConfirmationModal
        visible={modalVisible}
        message={`Are you sure you want to ${
          selectedAction === "delete" ? "delete this group" : "remove this user"
        }?`}
        onConfirm={confirmAction}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default GroupDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 10,
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Suse-Bold",
  },
  headerGroupTitle: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "500",
    fontFamily: "Suse-Bold",
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 30,
    marginBottom: 10,
    fontWeight: "500",
    fontFamily: "Suse-Bold",
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  userName: {
    fontSize: 14,
    fontFamily: "Suse-Regular",
  },
  removeText: {
    color: "red",
    fontWeight: "bold",
  },
  addText: {
    color: "green",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addUserRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
