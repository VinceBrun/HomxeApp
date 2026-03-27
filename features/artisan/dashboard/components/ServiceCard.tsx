import { View, Text } from 'react-native';

type Props = { name: string; rate?: string };

export default function ServiceCard({ name, rate }: Props) {
  return (
    <View style={{ padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }}>
      <Text style={{ fontWeight: '600' }}>{name}</Text>
      {rate && <Text>{rate}</Text>}
    </View>
  );
}
