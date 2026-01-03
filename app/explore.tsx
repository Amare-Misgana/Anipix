import axios from "axios";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

type ImageType = {
  id: number;
  url: string;
  rating: string;
  color_dominate: number[];
  color_palette: number[][];
  artist_name: string | null;
  tags: string[];
  source_url: string | null;
};

type SelectedRatingType = {
  rating: string;
};

export default function TabTwoScreen() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageType[]>([]);
  const [selctedRating, setSelectedRating] = useState<SelectedRatingType[]>([
    {
      rating: "safe",
    },
    {
      rating: "suggestive",
    },
    // {
    //   rating: "explicit"
    // }
  ]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const ratings = selctedRating.map((r) => r.rating);
    const filtered = images.filter((img) => ratings.includes(img.rating));
    setFilteredImages(filtered);
  }, [selctedRating, images]);

  useEffect(() => {
    const getImages = async () => {
      try {
        const res = await axios.get("https://api.nekosapi.com/v4/images");
        const data: ImageType[] = await res.data.items;
        setImages(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getImages();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#eb0202ff" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading images...</Text>
      </View>
    );
  }

  if (!loading && filteredImages.length == 0) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff", marginTop: 10 }}>No Image Found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#888" value={searchText} onChangeText={(text) => setSearchText(text)} />
      </View>

      <View style={styles.container}>
        <FlatList
          data={filteredImages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.url }} style={styles.image} />
              <View style={styles.tagsContainer}>
                {item.tags.map((tag, index) => (
                  <Text key={index} style={styles.caption}>
                    {tag.charAt(0).toUpperCase() + tag.replace(/_/g, " ").slice(1)}
                  </Text>
                ))}
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  searchContainer: {
    
  },
  searchInput: {
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: SCREEN_WIDTH - 40,
    marginBottom: 30,
  },

  image: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.6, // 60% of screen height
    resizeMode: "cover",
    borderRadius: 10,
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },

  caption: {
    color: "#fff",
    fontSize: 14,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 6,
    marginBottom: 6,
  },
});
