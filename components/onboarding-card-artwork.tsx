import { Image, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

const okbondEmblem = require("../assets/images/onboarding-emblem.jpg");

export function OnboardingCardArtwork() {
  return (
    <View style={styles.stage} testID="onboarding-card-artwork">
      <View style={styles.card}>
        <Svg
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          style={StyleSheet.absoluteFill}
          viewBox="0 0 360 220"
        >
          <Defs>
            <SvgLinearGradient id="okbond-card-base" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#28251E" />
              <Stop offset="26%" stopColor="#111211" />
              <Stop offset="68%" stopColor="#070808" />
              <Stop offset="100%" stopColor="#18130B" />
            </SvgLinearGradient>
            <RadialGradient id="okbond-card-glow" cx="54%" cy="37%" rx="76%" ry="76%">
              <Stop offset="0%" stopColor="#D9B96D" stopOpacity="0.22" />
              <Stop offset="48%" stopColor="#8F6B32" stopOpacity="0.07" />
              <Stop offset="100%" stopColor="#050505" stopOpacity="0" />
            </RadialGradient>
            <SvgLinearGradient id="okbond-card-foil" x1="0%" y1="100%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#A67B36" stopOpacity="0" />
              <Stop offset="48%" stopColor="#F3D88D" stopOpacity="0.72" />
              <Stop offset="100%" stopColor="#A67B36" stopOpacity="0" />
            </SvgLinearGradient>
          </Defs>
          <Rect x="0" y="0" width="360" height="220" rx="24" fill="url(#okbond-card-base)" />
          <Rect x="0" y="0" width="360" height="220" rx="24" fill="url(#okbond-card-glow)" />
          <Path
            d="M-20 176 C82 118 154 254 382 105"
            fill="none"
            opacity="0.15"
            stroke="url(#okbond-card-foil)"
            strokeWidth="22"
          />
          <Path
            d="M-16 192 C88 132 174 245 376 127"
            fill="none"
            opacity="0.12"
            stroke="#E8C979"
            strokeWidth="1.2"
          />
          <Path
            d="M20 31 C110 6 237 20 340 5"
            fill="none"
            opacity="0.12"
            stroke="#FFF0C5"
            strokeWidth="0.8"
          />
          <Circle cx="327" cy="183" r="1.1" fill="#E9CB7D" opacity="0.58" />
          <Circle cx="309" cy="194" r="0.8" fill="#E9CB7D" opacity="0.36" />
          <Rect
            x="1"
            y="1"
            width="358"
            height="218"
            rx="23"
            fill="none"
            stroke="#D7B36A"
            strokeOpacity="0.74"
            strokeWidth="1"
          />
          <Rect
            x="8"
            y="8"
            width="344"
            height="204"
            rx="18"
            fill="none"
            stroke="#FFF0C5"
            strokeOpacity="0.075"
            strokeWidth="1"
          />
        </Svg>

        <View style={styles.topRow}>
          <View style={styles.chipOrnament} accessible={false}>
            <View style={styles.chipInset}>
              <View style={styles.chipVertical} />
              <View style={styles.chipHorizontal} />
            </View>
          </View>
          <View style={styles.phaseTag}>
            <View style={styles.phaseDot} />
            <Text style={styles.phaseText}>PHASE 01</Text>
          </View>
        </View>

        <View style={styles.brandBlock}>
          <View style={styles.logoFrame}>
            <Image
              accessibilityLabel="OKBOND emblem"
              resizeMode="cover"
              source={okbondEmblem}
              style={styles.logo}
            />
          </View>
          <Text style={styles.brandName}>OKBOND</Text>
          <Text style={styles.brandSubline}>ECOSYSTEM OVERVIEW</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerPrimary}>PUBLIC DATA · READ ONLY</Text>
          <Text style={styles.footerSecondary}>NO WALLET LINKED</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  card: {
    width: "96%",
    maxWidth: 344,
    aspectRatio: 360 / 220,
    position: "relative",
    overflow: "hidden",
    borderRadius: 24,
    backgroundColor: "#090A0A",
    borderWidth: 1,
    borderColor: "#A8864B",
    shadowColor: "#D3AE61",
    shadowOpacity: 0.28,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 9,
    transform: [{ rotate: "-2deg" }],
  },
  topRow: {
    position: "absolute",
    top: "11%",
    left: "7%",
    right: "7%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chipOrnament: {
    width: 35,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#B9985A",
    backgroundColor: "rgba(190, 155, 85, 0.14)",
  },
  chipInset: {
    width: 25,
    height: 17,
    overflow: "hidden",
    borderRadius: 4,
    borderWidth: 0.7,
    borderColor: "rgba(230, 205, 145, 0.65)",
  },
  chipVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "48%",
    width: 1,
    backgroundColor: "rgba(230, 205, 145, 0.55)",
  },
  chipHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "48%",
    height: 1,
    backgroundColor: "rgba(230, 205, 145, 0.55)",
  },
  phaseTag: {
    minHeight: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(216, 181, 105, 0.38)",
    backgroundColor: "rgba(8, 8, 8, 0.42)",
  },
  phaseDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "#E9CB7D" },
  phaseText: { color: "#D9BE80", fontSize: 7, fontWeight: "800", letterSpacing: 1.2 },
  brandBlock: {
    position: "absolute",
    top: "23%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  logoFrame: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(236, 205, 126, 0.72)",
    backgroundColor: "#080909",
    shadowColor: "#E1BC67",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  logo: { width: 58, height: 58, borderRadius: 29 },
  brandName: {
    marginTop: 5,
    color: "#F2D88B",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "700",
    letterSpacing: 3,
  },
  brandSubline: {
    marginTop: 1,
    color: "rgba(230, 219, 194, 0.78)",
    fontSize: 6.5,
    lineHeight: 9,
    fontWeight: "700",
    letterSpacing: 2,
  },
  footer: {
    position: "absolute",
    left: "7%",
    right: "7%",
    bottom: "9%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(231, 204, 144, 0.26)",
    paddingTop: 8,
  },
  footerPrimary: { color: "#D9C18A", fontSize: 6.5, fontWeight: "800", letterSpacing: 0.9 },
  footerSecondary: { color: "rgba(230, 219, 194, 0.68)", fontSize: 5.5, fontWeight: "700", letterSpacing: 0.65 },
});
