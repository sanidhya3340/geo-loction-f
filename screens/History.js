import { View, Text, Image, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";

export default function History() {
  const [userDetails, setUserDetails] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await fetch("http://10.0.2.2:8000/userapi/");
        let json = await res.json();
        setUserDetails(json);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);
  return (
    <ScrollView>
      {userDetails.map((item, key) => {
        return (
          <View style={{ margin: 12, padding: 12, borderWidth: 1 }} key={key}>
            <View style={{ flexDirection: "row" }}>
              <Text>Name: </Text>
              <Text>{item.name}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text>Mobile: </Text>
              <Text>{item.mobile}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text>Place: </Text>
              <Text>{item.place}</Text>
            </View>
            <View style={{ flexDirection: "row", flexShrink: 1 }}>
              <Text>Location: </Text>
              <Text>{item.location}</Text>
            </View>
            <Text>Image</Text>
            <Image style={{ height: 200 }} source={{ uri: item.imgUri }} />
          </View>
        );
      })}
    </ScrollView>
  );
}
