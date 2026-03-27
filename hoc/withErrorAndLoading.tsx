import Loader from '@/components/Loader';
import { Text } from '@/components/ui/Text';
import React, { ComponentType } from 'react';
import { View } from 'react-native';

const GenericErrorComp: React.FC<{ message: string }> = ({ message }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="h2" style={{ textAlign: 'center', paddingHorizontal: 20 }}>
        {message}
      </Text>
    </View>
  );
};

export interface WithErrorAndLoadingProps {
  isLoading?: boolean;
  error?: Error | null;
  customErrorComponentMap?: Record<number, React.ReactNode>;
  customLoadingComponent?: React.ReactNode;
  skipErrorAndLoadingHandling?: boolean;
}

function withErrorAndLoading<P extends object>(WrappedComponent: ComponentType<P>) {
  type Props = P & WithErrorAndLoadingProps;

  const WithErrorAndLoading: React.FC<Props> = ({
    isLoading,
    error,
    customErrorComponentMap,
    customLoadingComponent,
    skipErrorAndLoadingHandling,
    ...props
  }) => {
    if (skipErrorAndLoadingHandling) return <WrappedComponent {...(props as P)} />;

    if (isLoading) return customLoadingComponent || <Loader size={30} />;

    if (error) {
      return <GenericErrorComp message={error.message} />;
    }

    return <WrappedComponent {...(props as P)} />;
  };

  return WithErrorAndLoading;
}

export default withErrorAndLoading;
