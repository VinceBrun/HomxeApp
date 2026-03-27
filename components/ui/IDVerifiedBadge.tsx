import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Text } from 'react-native';

type Props = {
  status: 'verified' | 'pending' | 'rejected' | null;
};

const IDVerifiedBadge = ({ status }: Props) => {
  const badgeColor = useThemeColor({}, 'secondary'); 

  const getLabel = () => {
    if (status === 'verified') return 'Verified';
    if (status === 'pending') return 'Pending';
    if (status === 'rejected') return 'Rejected';
    return 'Unverified';
  };

  return (
    <Text style={{ color: badgeColor, fontSize: 10, lineHeight: 13 }}>
      {getLabel()}
    </Text>
  );
};

export default IDVerifiedBadge;
