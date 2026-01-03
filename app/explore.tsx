import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import axios from "axios";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as FileSystem from "expo-file-system/legacy";

const downloadImage = async (imageUrl: string, fileName: string) => {
  try {
    const fileUri = FileSystem.cacheDirectory + fileName;

    // Download directly to cache
    const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      alert("Sharing not available!");
    }
  } catch (err) {
    console.log("Download error:", err);
  }
};

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

type RootStackParamList = {
  Home: undefined;
  detail: { id: number };
};

export default function TabTwoScreen() {
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const fetchCharacters = async (search = searchText, pageNumber = 1) => {
    try {
      const res = await axios.get("https://api.jikan.moe/v4/characters", {
        params: {
          q: search || undefined,
          limit: 10,
          page: pageNumber,
          order_by: "favorites",
          sort: "desc",
        },
      });

      const newChars: CharacterType[] = res.data.data.map((char: any) => ({
        mal_id: char.mal_id,
        name: char.name,
        name_kanji: char.name_kanji,
        nicknames: char.nicknames,
        favorites: char.favorites,
        about: char.about,
        image: char.images.jpg.image_url,
        url: char.url,
      }));

      // Avoid duplicates
      setCharacters((prev) => {
        const existingIds = new Set(prev.map((c) => c.mal_id));
        return [...prev, ...newChars.filter((c) => !existingIds.has(c.mal_id))];
      });

      setHasNextPage(res.data.pagination.has_next_page);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCharacters("", 1);
  }, []);

  const handleSearchEnter = async () => {
    setLoading(true);
    setPage(1);
    setCharacters([]);
    await fetchCharacters(searchText, 1);
  };

  const handleLoadMore = async () => {
    if (!hasNextPage || loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchCharacters(searchText, nextPage);
  };
  const renderCharacter = ({ item }: { item: CharacterType }) => (
    <View style={styles.characterContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("detail", { id: item.mal_id })}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.name}>{item.name}</Text>
      {item.nicknames.length > 0 && <Text style={styles.nicknames}>({item.nicknames.join(", ")})</Text>}
      <View style={styles.favContainer}>
        <Ionicons name="heart" size={18} color="#eb0202ff" />
        <Text style={styles.favoritesText}>{item.favorites}</Text>

        {/* Download Button */}
        <TouchableOpacity style={styles.downloadButton} onPress={() => downloadImage(item.image, `${item.name}.jpg`)}>
          <Ionicons name="cloud-download" size={25} style={styles.downloadBtn} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && characters.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#888" value={searchText} onChangeText={(text) => setSearchText(text)} onSubmitEditing={handleSearchEnter} />
        </View>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#eb0202ff" />
          <Text style={{ color: "#fff", marginTop: 10 }}>Loading characters...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#888" value={searchText} onChangeText={(text) => setSearchText(text)} onSubmitEditing={handleSearchEnter} />
      </View>

      <FlatList
        data={characters}
        keyExtractor={(item) => item.mal_id.toString()}
        renderItem={renderCharacter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator color="#eb0202ff" /> : null}
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: "#000000ff",
  },
  searchInput: {
    color: "white",
    backgroundColor: "#0f0f0fff",
    width: "90%",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchIcon: { color: "#fff" },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  characterContainer: { marginBottom: 30 },
  image: { width: SCREEN_WIDTH - 40, height: SCREEN_HEIGHT * 0.6, borderRadius: 10, resizeMode: "cover" },
  name: { color: "#fff", fontSize: 18, fontWeight: "bold", marginTop: 10 },
  nicknames: { color: "#ccc", fontSize: 14, fontStyle: "italic" },
  favContainer: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  favoritesText: { color: "#eb0202ff", marginLeft: 6 },
  downloadButton: {
    marginLeft: 20,
    padding: 5,
    backgroundColor: "#eb0202ff",
    borderRadius: 6,
    position: "absolute",
    right: 10,
    bottom: 0,
  },
  downloadBtnContainer: {
    backgroundColor: "#eb0202ff",
  },
  downloadBtn: {
    color: "#fff",
  },
});
