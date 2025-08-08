import { memo, useMemo } from "react";
import { TouchableOpacity } from "react-native";
import { Text, View } from "react-native";

const EditProfilePrivacySettings = memo(({ 
  privacySettings, 
  openPrivacyKey, 
  handlePrivacyChange, 
  togglePrivacyDropdown 
}) => {
  const PRIVACY_OPTIONS = useMemo(() => ["Private", "Everyone", "Followers Only"], []);

  return (
    <View className="bg-white rounded-xl px-6 pt-6 mb-6">
      <Text className="text-xl font-semibold text-gray-900 mb-5">Privacy Settings</Text>
      {Object.keys(privacySettings).map((key, index) => (
        <View
          key={key}
          className={`mb-5 ${
            index === Object.keys(privacySettings).length - 1 ? "" : "border-b border-gray-200"
          } pb-5`}
        >
          <TouchableOpacity
            onPress={() => togglePrivacyDropdown(key)}
            className="flex-row justify-between items-center"
          >
            <View>
              <Text className="text-sm text-gray-600 capitalize">Who can view your {key}</Text>
              <Text className="text-lg text-gray-800 font-medium mt-1">
                {privacySettings[key]}
              </Text>
            </View>
            <Text className="text-primary text-base font-medium">Change</Text>
          </TouchableOpacity>
          {openPrivacyKey === key && (
            <View className="mt-4 bg-gray-100 rounded-lg p-4">
              {PRIVACY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handlePrivacyChange(key, option)}
                  className="py-3"
                >
                  <Text
                    className={`text-base font-medium ${
                      privacySettings[key] === option
                        ? "text-primary font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
});


export default EditProfilePrivacySettings