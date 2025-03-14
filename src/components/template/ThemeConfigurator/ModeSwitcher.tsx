import { useCallback, useState } from "react";
import useDarkMode from "@/utils/hooks/useDarkmode";
import Switcher from "@/components/ui/Switcher";
import useStorage from "@/utils/hooks/useStorage";
import { PiMoonFill } from "react-icons/pi";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { IoMdSunny } from "react-icons/io";
import "./index.css";

const ModeSwitcher = () => {
  const [isDark, setIsDark] = useDarkMode();
  const defaultOptions = {
    invertedIconLogic: false,
  };

  const invertedIconLogic = defaultOptions.invertedIconLogic;

  const themeSwitherFunc = (theme: boolean) => {
    setIsDark(theme ? "dark" : "light");
  };

  const onSwitchChange = useCallback(
    (e: boolean) => {
      // setIsDark(checked ? "dark" : "light");
      setIsDark(e.target.checked ? "dark" : "light");
    },
    [setIsDark],
  );
  // console.log(isDark, "isDark");
  return (
    // <Switcher
    //   defaultChecked={isDark}
    //   onChange={(checked) => onSwitchChange(checked)}
    // />
    <label className="container_switcher">
      <input
        type="checkbox"
        defaultChecked={invertedIconLogic ? !isDark : isDark}
        onChange={onSwitchChange}
      />
      <div />
    </label>
  );
};

export default ModeSwitcher;
