import { useEffect, useRef } from "react";
import { Modal, Pressable, Text, View, Animated } from "react-native";
import Button from "./Button";
import Input from "../components/Input"; // adjust path as needed

const CustomModal = ({
  visible,
  onClose,
  type = "logout",
  onEdit,
  onDelete,
  onShare,
  onConfirmLogout,
  inputValue,
  onChangeInput,
  placeholder,
  onSubmit,
  title,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(300);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className={`flex-1 bg-black/40 ${type === "post" ? "px-0" : "px-5"}`}
        style={{ justifyContent: type === "post" ? "flex-end" : "center" }}
      >
        {/* This View prevents modal from closing when touched */}
        <View onStartShouldSetResponder={() => true}>
          <Animated.View
            style={{
              transform: [
                {
                  translateY: type === "post" ? slideAnim : 0,
                },
              ],
            }}
            className={`bg-white rounded-xl ${
              type === "logout" ? "py-6 px-4" : "p-4"
            }`}
          >
            {type === "post" ? (
              <>
                {[
                  {
                    title: "Report",
                    variant: "textDanger",
                    handle: () => console.log("Report"),
                  },
                  {
                    title: "Edit",
                    handle: onEdit,
                  },
                  {
                    title: "Delete",
                    variant: "textDanger",
                    handle: onDelete,
                  },
                  {
                    title: "Share",
                    handle: onShare,
                  },
                  {
                    title: "Cancel",
                    variant: "textMuted",
                    handle: onClose,
                  },
                ].map((btn) => (
                  <Button
                    key={btn.title}
                    title={btn.title}
                    variant={btn.variant || "text"}
                    className="!py-4"
                    onPress={() => {
                      if (btn.handle && typeof btn.handle === "function") {
                        btn.handle();
                      }
                    }}
                    textClass="text-lg !font-medium"
                  />
                ))}
              </>
            ) : type === "input" ? (
              <>
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  {title || "Add Title Here"}
                </Text>
                <Input
                  value={inputValue}
                  onChangeText={onChangeInput}
                  placeholder={placeholder}
                  wrapClass="bg-gray-100 rounded-xl px-4 py-3 mb-4"
                  autoFocus
                />
                <View className="flex-row justify-end gap-2">
                  <Button
                    title="Cancel"
                    onPress={onClose}
                    variant="secondary"
                    className="!px-6 !py-2"
                    textClass="text-lg"
                  />
                  <Button
                    title="Save"
                    onPress={onSubmit}
                    variant="primary"
                    className="!px-6 !py-2"
                    textClass="text-lg"
                  />
                </View>
              </>
            ) : (
              <>
                <Text className="text-center text-xl font-medium text-zinc-800 mb-4">
                  {title || "Are you sure you want to logout?"}
                </Text>
                <View className="flex-row justify-evenly mt-2">
                  <Button
                    title="Cancel"
                    onPress={onClose}
                    variant="secondary"
                    className="!px-6 !py-2"
                    textClass="text-lg"
                  />
                  <Button
                    title="Logout"
                    onPress={onConfirmLogout}
                    variant="danger"
                    className="!px-6 !py-2"
                    textClass="text-lg"
                  />
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default CustomModal;
