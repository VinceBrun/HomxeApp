/**
 * Design System: Colors
 * Defines the application's color palette for light and dark themes.
 */

const brandGreen = '#196606';
const brandRed = '#CB5A48';
const brandGold = '#CBAA58'; 
const brandTabActive = '#C6AA58';
const brandOutline = '#01311F';

const black = '#000000';
const white = '#FFFFFF';
const lightGray = '#E0E0E0';
const backgroundLight = '#FCFCFC';

export const Colors = {
  light: {
    text: black,
    background: backgroundLight,
    primary: brandGreen,
    secondary: brandRed,
    tertiary: brandGold,
    buttonFill: brandGreen,
    buttonText: backgroundLight,
    outlineBorder: brandOutline,
    outlineText: black,
    card: white,
    icon: '#687076',
    tabActive: brandTabActive,
    tabInactive: white,
  },
  dark: {
    text: lightGray,
    background: black,
    primary: brandGreen,
    secondary: brandRed,
    tertiary: brandGold,
    buttonFill: brandGreen,
    buttonText: backgroundLight,
    outlineBorder: brandOutline,
    outlineText: lightGray,
    card: '#1C1C1E',
    icon: '#9BA1A6',
    tabActive: brandTabActive,
    tabInactive: white,
  },
};

