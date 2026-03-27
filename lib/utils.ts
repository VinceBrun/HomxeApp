import { Platform } from "react-native";

export const isIOS = () => {
  return Platform.OS === "ios";
};

export const hideEmail = (email: string) => {
  const [user, domain] = email.split("@");
  const visibleCount = Math.min(2, user.length); 
  const hiddenUser = `${user.substring(0, visibleCount)}${"*".repeat(user.length - visibleCount)}`;
  const visibleDomain = domain
    .split(".")
    .map((part, index, array) => {
      if (index === 0)
        return `${part.substring(0, 1)}${"*".repeat(part.length - 1)}`;
      return index === array.length - 1 ? part : "*".repeat(part.length);
    })
    .join(".");

  return `${hiddenUser}@${visibleDomain}`;
};
