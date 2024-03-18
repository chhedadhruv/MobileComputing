import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker, Circle } from 'react-native-maps';
import axios from 'axios';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      error => setErrorMsg(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const searchLocation = async (query) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToLocation = () => {
    if (selectedLocation) {
        setLocation({
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lon,
        });
        }
    }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: location?.latitude || 0,
          longitude: location?.longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
          />
        )}
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.lat,
              longitude: selectedLocation.lon,
            }}
            title={selectedLocation.display_name}
          />
        )}
        {location && (
          <Circle
            center={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            radius={1000}
            fillColor="rgba(78, 137, 255, 0.3)"
            strokeColor="rgba(78, 137, 255, 0.8)"
          />
        )}
      </MapView>
      <View style={{ padding: 10 }}>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => searchLocation(text)}
          placeholder="Search location"
        />
        <Button title="Go to location" onPress={navigateToLocation} />
        {searchResults.map(result => (
          <Text
            key={result.place_id}
            onPress={() => setSelectedLocation(result)}
          >
            {result.display_name}
          </Text>
        ))}
      </View>
    </View>
  );
}

export default MapScreen;
