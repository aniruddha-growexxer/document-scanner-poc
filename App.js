/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import {
  Button,
  SafeAreaView,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Colors, Header } from 'react-native/Libraries/NewAppScreen';
import ImageCropPicker from 'react-native-image-crop-picker';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const documentScannerElement = useRef(null);
  const [data, setData] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const takePicture = async () => {
    setIsLoading(true);
    await ImageCropPicker.openCamera({
      width: 500,
      height: 500,
      compressImageMaxWidth: 640,
      compressImageMaxHeight: 480,
    }).then(async image => {
      console.log('image is ', image);
      // setImageUri(data.uri);
      await uploadImage(image.path);
    })
      .catch(e => {
        console.log('error is', e);
      });
    setIsLoading(false);
  };

  const uploadImage = async (imagePath) => {
    const formData = new FormData();
    formData.append('image', { uri: imagePath, name: 'image.jpg', type: 'image/jpeg' });
    try {
      const response = await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'arraybuffer',
      });
      // console.log(response.data);
      const imageData = Buffer.from(response.data, 'base64');
      const base64Image = `data:image/jpeg;base64,${imageData.toString('base64')}`;
      setImageUri(base64Image);
    } catch (error) {
      console.error(error);
    }
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <View style={{ flex: 1 }}>

            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
              {isLoading ? (
                <View style={{ marginBottom: 20 }}>
                  <ActivityIndicator size="large" />
                </View>
              ) : imageUri ? (
                <Text style={{ marginBottom: 20 }}>Image captured!</Text>
              ) : (
                <TouchableOpacity onPress={() => takePicture()}>
                  <Text style={{ fontSize: 20, marginBottom: 20, color: 'red' }}>Take Photo</Text>
                </TouchableOpacity>
              )}
            </View>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    height: 400,
    width: 300,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
