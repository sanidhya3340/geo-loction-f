import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
// import { Location } from "expo";
import * as Location from "expo-location";

export default function Form(props) {
  const [hasGalleryPermission, setHasGalleryPermission] = React.useState(null);
  const [hasLocationPermission, setHasLocationPermission] =
    React.useState(null);
  const [image, setImage] = React.useState(null);
  const [location, setLocation] = React.useState();
  const [name, setName] = React.useState("");
  const [place, setPlace] = React.useState("");
  const [mobile, setMobile] = React.useState();

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestCameraPermissionsAsync();
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(status, typeof status, "permission");
      setHasGalleryPermission(galleryStatus === "granted");
      setHasLocationPermission(status == "granted");
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    console.log("called");

    if (!hasLocationPermission) {
      console.log("returning");
      return;
    }
    console.log("forward");
    let { coords } = await Location.getCurrentPositionAsync();
    if (coords) {
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      for (let item of response) {
        let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;

        setLocation(address);
      }
    }
  };

  const postData = async () => {
    console.log("post called");
    const data = {
      name: name,
      place: place,
      mobile: mobile,
      imgUri: image,
      location: location,
    };
    try {
      await fetch("http://10.0.2.2:8000/userapi/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((response) => {
        // response.json().then((data) => {
        Alert.alert("Data Created");
        // });
      });
    } catch (error) {
      console.error(error, data, "error");
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>Please enter your details:-</Text>
        <Text style={styles.normalText}>Name:</Text>
        <TextInput
          onChangeText={(v) => setName(v)}
          value={name}
          style={styles.textInput}
        />
        <Text>Place</Text>
        <TextInput
          onChangeText={(v) => setPlace(v)}
          value={place}
          style={styles.textInput}
        />
        <Text style={styles.normalText}>Mobile</Text>
        <TextInput
          onChangeText={(v) => setMobile(v)}
          maxLength={10}
          value={mobile}
          style={styles.textInput}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => {
            pickImage();
          }}
        >
          <Text style={{ color: "white" }}>Pick a Image</Text>
        </TouchableOpacity>
        <Image style={{ height: 200 }} source={{ uri: image }} />
        {location && <Text>{location}</Text>}
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => {
            getLocation();
          }}
        >
          <Text style={{ color: "white" }}>Get Location</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={postData} style={styles.button}>
          <Text style={{ color: "white" }}>POST</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("Details")}
          style={styles.button}
        >
          <Text style={{ color: "white" }}>All Details</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginBottom: 12,
  },
  container: {
    margin: 12,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
  },
  normalText: {
    marginVertical: 4,
  },
  button: {
    marginTop: 12,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
  },
  imagePicker: {
    marginVertical: 12,
    padding: 6,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
});
