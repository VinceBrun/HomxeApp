import React, { useState } from 'react';
import { View } from 'react-native';
import Header from '@/components/ui/Header';
import CollapsibleHeaderView from '@/components/ui/profile/CollapsibleHeaderTabView';
import SettingsSection from '@/components/ui/settings/SettingsSection';
import { OptionProps } from '@/types';

const SettingsScreen = () => {
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState<boolean>(false);

  const accountSettings: OptionProps[] = [
    {
      type: 'navigator',
      destination: '/(settings)/edit-profile',
      icon: 'person-outline',
      title: 'Edit Profile',
    },
    {
      type: 'navigator',
      destination: '/(settings)/change-password',
      icon: 'lock-closed-outline',
      title: 'Change Password',
    },
    {
      type: 'toggle',
      icon: 'notifications-outline',
      title: 'Push Notifications',
      value: isPushEnabled,
      onToggle: () => setIsPushEnabled((prev: boolean) => !prev),
    },
    {
      type: 'toggle',
      icon: 'moon-outline',
      title: 'Dark Mode',
      value: isDarkMode,
      onToggle: () => setIsDarkMode((prev: boolean) => !prev),
    },
    {
      type: 'toggle',
      icon: 'finger-print-outline',
      title: 'Biometrics',
      value: isBiometricsEnabled,
      onToggle: () => setIsBiometricsEnabled((prev: boolean) => !prev),
    },
  ];

  const preferences: OptionProps[] = [
    {
      type: 'navigator',
      destination: '/language',
      icon: 'language-outline',
      title: 'Language',
    },
    {
      type: 'navigator',
      destination: '/currency',
      icon: 'cash-outline',
      title: 'Currency',
    },
    {
      type: 'navigator',
      destination: '/security',
      icon: 'shield-checkmark-outline',
      title: 'Security',
    },
    {
      type: 'navigator',
      destination: '/notifications',
      icon: 'notifications-outline',
      title: 'Notification',
    },
  ];

  const more: OptionProps[] = [
    {
      type: 'navigator',
      destination: '/about-us',
      icon: 'information-circle-outline',
      title: 'About Us',
    },
    {
      type: 'navigator',
      destination: '/privacy-policy',
      icon: 'document-text-outline',
      title: 'Privacy Policy',
    },
    {
      type: 'navigator',
      destination: '/help-support',
      icon: 'help-circle-outline',
      title: 'Help & Support',
    },
  ];

  return (
    <CollapsibleHeaderView
      header={
        <View>
          <Header title="Settings" />
        </View>
      }
      content={
        <View className="pb-10">
          <SettingsSection title="Account Settings" options={accountSettings} />
          <SettingsSection title="Preferences" options={preferences} />
          <SettingsSection title="More" options={more} />
        </View>
      }
    />
  );
};

export default SettingsScreen;
// This file defines the SettingsScreen component, which displays various settings options
// for the user, including account settings, preferences, and additional options.
