import { router } from "expo-router";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ImageBackground source={require("../assets/images/anipx-bg.jpg")} style={styles.bgImg}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.title}>ANIPIX</Text>
          <Text style={styles.subTitle}>Explore and download your favorite anime images.</Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => {
              router.push("/explore");
            }}
          >
            <Text style={styles.ctaText}>Explore Now</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.footer}>AMARE MISGANA</Text>
      </ImageBackground>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "#000"
  },
  title: {
    fontSize: 96,
    color: "#eb0202ff",
    fontWeight: 500,
  },
  bgImg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subTitle: {
    color: "#d6d6d6ff",
  },
  ctaBtn: {
    marginTop: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#eb0202ff",
  },
  ctaText: {
    fontSize: 20,
    color: "#ff1b1bff",
  },
  footer: {
    color: "#ff2626ff",
    fontWeight: 600,
    marginBottom: 20,
  }
});
