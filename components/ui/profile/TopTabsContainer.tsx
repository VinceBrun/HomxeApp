import useTheme from '@/store/theme.store';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import React, { ReactNode } from 'react';

type Props = { 
  children: ReactNode;
};

const { Navigator } = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Navigator);

const TopTabsContainer: React.FC<Props> = ({ children }) => {
  const { colorScheme } = useTheme();
  
  const colors = colorScheme === 'dark' 
    ? {
        background: '#000000',
        primary: '#196606',
        onBackground: '#E0E0E0',
        muted: '#9BA1A6'
      } 
    : {
        background: '#FCFCFC',
        primary: '#196606',
        onBackground: '#000000',
        muted: '#687076'
      };

  return (
    <TopTabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.background,
          height: 40,
          shadowOpacity: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          padding: 0,
          alignContent: 'center',
          justifyContent: 'center',
          flex: 1,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          lineHeight: 20,
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary,
        },
        tabBarActiveTintColor: colors.onBackground,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      {children}
    </TopTabs>
  );
};

export default TopTabsContainer;
