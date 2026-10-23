import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export type MotionPreference = "pending" | "reduced" | "full";

export function useMotionPreference(): MotionPreference {
  const [preference, setPreference] = useState<MotionPreference>("pending");

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) setPreference(enabled ? "reduced" : "full");
      })
      .catch(() => {
        if (mounted) setPreference("full");
      });
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", (enabled) => {
      setPreference(enabled ? "reduced" : "full");
    });
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return preference;
}
