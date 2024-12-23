
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Scanner() {
  const [permission, setPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    requestPermission();
  }, []);

  async function requestPermission() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setPermission(status === 'granted');
  }

  if (permission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (permission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No access to camera</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  async function handleBarCodeScanned({ type, data }) {
    if (scanned) return;
    setScanned(true);
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const result = await response.json();
      
      router.push({
        pathname: '/result',
        params: { text: result.body }
      });
    } catch (error) {
      console.error(error);
      alert('Error fetching data. Please try again.');
      setScanned(false);
    }
  }

  return (
    <View style={styles.container}>
      <Camera
        style={[StyleSheet.absoluteFill]}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <SafeAreaView style={styles.overlay}>
          <View style={styles.scanArea} />
          {scanned && (
            <TouchableOpacity 
              style={styles.button}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.buttonText}>Tap to Scan Again</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </Camera>
      <SafeAreaView style={styles.controls}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  backButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});