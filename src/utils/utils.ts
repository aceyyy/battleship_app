import { ScreenMode } from "../types/types";

export const setValueFromScreenMode = (isBoardWidth: boolean) => {
  const width = window.innerWidth;

  if (width < 900) {
    return isBoardWidth ? window.innerWidth - 40 : ScreenMode.MOBILE;
  } else if (width < 1200) {
    return isBoardWidth ? window.innerWidth - 131 : ScreenMode.TABLET;
  } else {
    return isBoardWidth ? window.innerWidth - 690 : ScreenMode.DESKTOP;
  }
};

export const isScreenModeDesktop = (screenMode: ScreenMode) => {
  if (screenMode === ScreenMode.DESKTOP) {
    return true;
  }

  return false;
};

export const isScreenModeTablet = (screenMode: ScreenMode) => {
  if (screenMode === ScreenMode.TABLET) {
    return true;
  }

  return false;
};

export const isScreenModeMobile = (screenMode: ScreenMode) => {
  if (screenMode === ScreenMode.MOBILE) {
    return true;
  }

  return false;
};