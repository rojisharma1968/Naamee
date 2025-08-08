import { Text, View } from "react-native";
import Input from "../../Input";
import { memo } from "react";

const EditProfilePersonalInfo = memo(({ inputFields }) => (
  <View className="bg-white rounded-xl p-6 mb-6">
    <Text className="text-xl font-semibold text-gray-900 mb-5">Personal Info</Text>
    <View className="space-y-5">
      {inputFields.map((field, index) => (
        <Input
          key={index}
          label={field.label}
          value={field.value}
          onChangeText={field.onChangeText}
          placeholder={field.placeholder}
          multiline={field.multiline || false}
          icon={field.icon}
        />
      ))}
    </View>
  </View>
));

export default EditProfilePersonalInfo