import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import type { AppIconName } from "@/components/native-ui";
import { useMotionPreference } from "@/hooks/use-reduced-motion";
import { palette } from "@/lib/design";
import { OnboardingCardArtwork } from "@/components/onboarding-card-artwork";

const animations = [
  require("../assets/animations/logo-reveal.json"),
  require("../assets/animations/wallet-token.json"),
  require("../assets/animations/ecosystem-services.json"),
  require("../assets/animations/vault-network.json"),
  require("../assets/animations/final-emblem.json"),
] as const;

type ArtworkIcon = { name: AppIconName; label: string };

function IconTile({ name, label }: ArtworkIcon) {
  return (
    <View style={styles.iconTile}>
      <Ionicons name={name} size={22} color={palette.goldBright} />
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

function StaticArtwork({ index }: { index: number }) {
  if (index === 0 || index === 4) {
    return (
      <View style={[styles.seal, index === 4 ? styles.finalSeal : null]}>
        <View style={[styles.sealRing, index === 4 ? styles.finalSealRing : null]} />
        <Image source={require("../assets/images/onboarding-emblem.jpg")} style={index === 4 ? styles.finalEmblem : styles.emblem} accessible={false} />
      </View>
    );
  }

  if (index === 1) return <OnboardingCardArtwork />;

  if (index === 2) {
    return (
      <View style={styles.ecosystemStage}>
        <View style={styles.ecoTop}><IconTile name="stats-chart-outline" label="Portfolio" /></View>
        <View style={styles.ecoBottom}>
          <IconTile name="business-outline" label="Property" />
          <IconTile name="grid-outline" label="Services" />
        </View>
        <View style={styles.connectorVertical} />
        <View style={styles.connectorLeft} />
        <View style={styles.connectorRight} />
      </View>
    );
  }

  return (
    <View style={styles.vaultStage}>
      <View style={styles.vaultOuter}>
        <View style={styles.vaultInner}>
          <Ionicons name="shield-checkmark-outline" size={48} color={palette.goldBright} />
          <Text style={styles.vaultLabel}>ON-CHAIN CONTEXT</Text>
        </View>
      </View>
      <View style={[styles.networkNode, styles.nodeTop]} />
      <View style={[styles.networkNode, styles.nodeRight]} />
      <View style={[styles.networkNode, styles.nodeLeft]} />
    </View>
  );
}

export function OnboardingArtwork({ index }: { index: number }) {
  const motion = useMotionPreference();
  const [failedIndex, setFailedIndex] = useState<number | null>(null);
  const animationFailed = failedIndex === index;

  return (
    <View
      style={styles.stage}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {index === 1 ? <StaticArtwork index={index} /> : null}
      {!animationFailed ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <LottieView
            key={`onboarding-lottie-${index}`}
            source={animations[index]}
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
            autoPlay={motion === "full"}
            loop
            cacheComposition
            enableSafeModeAndroid
            onAnimationFailure={() => setFailedIndex(index)}
            testID={`onboarding-lottie-${index + 1}`}
          />
        </View>
      ) : null}
      {index !== 1 ? <StaticArtwork index={index} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    height: 250,
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    marginVertical: 5,
  },
  seal: {
    width: 156,
    height: 156,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 78,
    borderWidth: 1,
    borderColor: `${palette.gold}A8`,
    backgroundColor: `${palette.goldSoft}C8`,
    shadowColor: palette.gold,
    shadowOpacity: 0.34,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 7,
  },
  finalSeal: { width: 172, height: 172, borderRadius: 86, borderWidth: 2, backgroundColor: "#211B10" },
  finalSealRing: { margin: -18, borderRadius: 108, borderColor: `${palette.goldBright}90` },
  finalEmblem: { width: 140, height: 140, borderRadius: 70 },
  sealRing: {
    ...StyleSheet.absoluteFill,
    margin: -13,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: `${palette.gold}66`,
  },
  emblem: { width: 130, height: 130, borderRadius: 65 },
  ecosystemStage: { width: 284, height: 204, alignItems: "center", justifyContent: "space-between", paddingVertical: 8 },
  ecoTop: { zIndex: 2 },
  ecoBottom: { zIndex: 2, width: "100%", flexDirection: "row", justifyContent: "space-between" },
  iconTile: {
    width: 112,
    height: 75,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: `${palette.gold}80`,
    backgroundColor: "#121315",
  },
  tileLabel: { color: palette.text, fontSize: 10, fontWeight: "700", letterSpacing: 0.3 },
  connectorVertical: { position: "absolute", top: 78, width: 1, height: 43, backgroundColor: `${palette.gold}70` },
  connectorLeft: { position: "absolute", top: 119, left: 58, width: 82, height: 1, backgroundColor: `${palette.gold}70`, transform: [{ rotate: "-30deg" }] },
  connectorRight: { position: "absolute", top: 119, right: 58, width: 82, height: 1, backgroundColor: `${palette.gold}70`, transform: [{ rotate: "30deg" }] },
  vaultStage: { width: 212, height: 212, alignItems: "center", justifyContent: "center" },
  vaultOuter: {
    width: 164,
    height: 164,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 82,
    borderWidth: 1,
    borderColor: `${palette.gold}90`,
    backgroundColor: "#101113",
  },
  vaultInner: {
    width: 132,
    height: 132,
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderRadius: 66,
    borderWidth: 1,
    borderColor: `${palette.gold}65`,
    backgroundColor: "#171719",
  },
  vaultLabel: { color: palette.goldBright, fontSize: 7, fontWeight: "800", letterSpacing: 1.15 },
  networkNode: { position: "absolute", width: 10, height: 10, borderRadius: 5, backgroundColor: palette.goldBright, borderWidth: 2, borderColor: palette.canvas },
  nodeTop: { top: 7, left: 101 },
  nodeRight: { right: 6, bottom: 51 },
  nodeLeft: { left: 7, bottom: 51 },
});
