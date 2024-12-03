import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Button } from 'react-native';
import axios from 'axios';
import { Camera } from 'expo-camera';

const API_URL = 'https://api.windy.com/api/webcams/v2/list?show=webcams:location,image&key=SUA_CHAVE_DE_API';

export default function App() {
  const [webcams, setWebcams] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    axios.get(API_URL)
      .then(response => {
        setWebcams(response.data.result.webcams);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Webcams ao Redor do Mundo</Text>
      <FlatList
        data={webcams}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.webcam}>
            <Image
              source={{ uri: item.image.current.preview }}
              style={styles.webcamImage}
            />
            <Text style={styles.webcamTitle}>{item.location.city}, {item.location.country}</Text>
          </View>
        )}
      />
      <Camera style={styles.camera} ref={ref => setCameraRef(ref)}>
        <View style={styles.buttonContainer}>
          <Button
            title="Tirar Foto"
            onPress={async () => {
              if (cameraRef) {
                const photo = await cameraRef.takePictureAsync();
                setPhoto(photo);
              }
            }}
          />
        </View>
      </Camera>
      {photo && (
        <Image source={{ uri: photo.uri }} style={styles.photo} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  webcam: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  webcamImage: {
    width: 300,
    height: 200,
    marginBottom: 10,
  },
  webcamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: 300,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  photo: {
    width: 100,
    height: 150,
    marginTop: 20,
  },
});