import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

type CharacterType = {
  mal_id: number;
  name: string;
  name_kanji: string;
  nicknames: string[];
  favorites: number;
  about: string;
  image: string;
  url: string;
};

export default function DetailScreen() {
  const [character, setCharacter] = useState<CharacterType | null>(null);
  const [loading, setLoading] = useState(true);

  // <- DO NOT destructure as { params }
  const params = useLocalSearchParams(); // params.id is a string (or undefined)

  useEffect(() => {
    const id = params.id ? Number(params.id) : NaN;
    if (Number.isNaN(id)) {
      setLoading(false);
      console.warn("Detail: invalid id param:", params.id);
      return;
    }

    const getCharacter = async (id: number) => {
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/characters/${id}`);
        const data = res.data.data;
        setCharacter({
          mal_id: data.mal_id,
          name: data.name,
          name_kanji: data.name_kanji,
          nicknames: data.nicknames,
          favorites: data.favorites,
          about: data.about,
          image: data.images.jpg.image_url,
          url: data.url,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getCharacter(id);
  }, [params.id]); // re-run when params.id changes

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: true, title: character?.name || "Loading..." }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#eb0202ff" />
          <Text style={styles.loadingText}>Loading character...</Text>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safeView} edges={["bottom"]}>
      <ScrollView style={styles.scroll}>
        <Stack.Screen options={{ headerShown: true, title: character?.name || "Detail" }} />
        <View style={styles.container}>
          <Image source={{ uri: character?.image }} style={styles.image} />
          <Text style={styles.name}>{character?.name}</Text>
          <Text style={styles.kanji}>{character?.name_kanji}</Text>
          {character?.nicknames?.length ? <Text style={styles.nicknames}>({character.nicknames.join(", ")})</Text> : null}
          <Text style={styles.favorites}>
            <Ionicons name="heart" size={18} color="#eb0202ff" /> {character?.favorites} favorites
          </Text>
          <Text style={styles.about}>{character?.about}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeView: {backgroundColor: "#000"},
  scroll: { backgroundColor: "#1c1c1c" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1c1c1c" },
  loadingText: { color: "#fff", marginTop: 10 },
  container: { padding: 20, backgroundColor: "#1c1c1c", flex: 1 },
  image: { width: SCREEN_WIDTH - 40, height: SCREEN_HEIGHT * 0.6, borderRadius: 12, marginBottom: 20 },
  name: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  kanji: { color: "#ccc", fontSize: 18, marginVertical: 4 },
  nicknames: { color: "#aaa", fontStyle: "italic", marginBottom: 6 },
  favorites: { color: "#eb0202ff", marginBottom: 12 },
  about: { color: "#ddd", lineHeight: 20 },
});
