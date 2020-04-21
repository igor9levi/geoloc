import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n Shake or press menu button for dev menu',
});

export default function App() {
  const [location, setLocation] = useState(null);
  const [timesCalled, setTimesCalled] = useState(1);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let watcher = null;
    (async () => {
      try {
        const { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
        }
      } catch (err) {
        setErrorMsg(`FixMe: ${err.message}`);
      }

      try {
        watcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            distanceInterval: 0,
            timeInterval: 300,
          },
          (loc) => {
            const newTimesCalled = timesCalled + 1;
            setTimesCalled(timesCalled + 1);
            console.log('CHECK: ', timesCalled, newTimesCalled);
            console.log('lat, long: ', loc.coords.latitude, loc.coords.longitude);
            // TODO: Push to API here
            setLocation(loc);
          },
        );
      } catch (err) {
        setErrorMsg(`FixMe loc: ${err.message}`);
      }
      console.log('Watcher: ', watcher);
    })();

    return function cleanup() {
      watcher.remove();
    };
  }, []);

  let text = 'Loading...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{timesCalled}</Text>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
