import React, { useState } from "react";
import { Image, Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import icons from "@/constants/ICONS";

interface FormFieldProps extends TextInputProps {
    title: string;
    value: string;
    placeholder: string;
    handleChangeText: (text: string) => void;
    otherStyles?: string;
}

const FormField: React.FC<FormFieldProps> = ({
    title,
    value,
    placeholder,
    handleChangeText,
    otherStyles = "",
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

            <View className="w-full h-16 px-4 border border-black-200 focus:border-secondary flex flex-row items-center">
                <TextInput
                    className="flex-1 text-white font-psemibold text-base"
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#7B7B8B"
                    onChangeText={handleChangeText}
                    secureTextEntry={title === "Password" && !showPassword}
                    {...props}
                />

                {title === "Password" && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image
                            source={!showPassword ? icons.Eye : icons.EyeHide}
                            className="w-6 h-6"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default FormField;
