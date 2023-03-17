import { ScreenMode } from "../types/types";
import { isScreenModeDesktop } from "../utils/utils";

interface Props {
  screenMode: ScreenMode;
}

export const Header: React.FC<Props> = ({ screenMode }) => {
  const isDesktop = isScreenModeDesktop(screenMode);

  return (
    <div className={isDesktop ? "header-container-desktop" : "header-container-mobile-tablet"}>
      {new Array(isDesktop ? 6 : 4).fill(null).map((value, key) => <div key={key} />)}
    </div>
  )
};