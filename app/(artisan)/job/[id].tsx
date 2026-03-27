import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function JobDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Job Details: {id}</Text>
    </View>
  );
}
