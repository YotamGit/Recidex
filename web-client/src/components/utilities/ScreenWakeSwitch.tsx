import { useState, useEffect, useRef, FC } from "react";
import "../../styles/utilities/ScreenWakeSwitch.css";

//mui
import Switch from "@mui/material/Switch";

type WakeLockSentinel = any; //TS version related shenanigans

interface propTypes {
  rtl: boolean;
}

const ScreenWakeSwitch: FC<propTypes> = ({ rtl }) => {
  const [wakeLockSentinel, setWakeLockSentinel] = useState<WakeLockSentinel>();
  const wakeSupported: boolean = "wakeLock" in navigator;

  function toggleScreenWake(
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) {
    if (checked && wakeSupported) {
      requestWakeLock();
    } else {
      setWakeLockSentinel(undefined);
    }
  }

  async function requestWakeLock() {
    try {
      setWakeLockSentinel(await (navigator as any).wakeLock.request("screen")); //Navigator type is missing the wakeLock for some reason so "any" it is.
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    function visibilityChangeListener() {
      if (
        wakeLockSentinel !== undefined &&
        document.visibilityState === "visible"
      ) {
        requestWakeLock();
      }
    }

    document.addEventListener("visibilitychange", visibilityChangeListener);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        visibilityChangeListener
      );
    };
  }, [wakeLockSentinel]);

  useEffect(() => {
    return () => {
      wakeLockSentinel?.release();
    };
  }, [wakeLockSentinel]);

  return wakeSupported ? (
    <div className="screen-wake-switch">
      <Switch
        checked={Boolean(wakeLockSentinel)}
        onChange={toggleScreenWake}
        inputProps={{ "aria-label": "cook-mode-switch" }}
      />
      <span className="screen-wake-switch-title">
        {rtl ? "השאר מסך דלוק" : "Keep Screen Awake"}
      </span>
    </div>
  ) : (
    <></>
  );
};

export default ScreenWakeSwitch;
