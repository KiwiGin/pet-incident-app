import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { TextBasic } from '../TextBasic';

interface ImagePickerComponentProps {
  maxImages?: number;
  onImagesSelected: (uris: string[]) => void;
  initialImages?: string[];
}

export function ImagePickerComponent({
  maxImages = 3,
  onImagesSelected,
  initialImages = [],
}: ImagePickerComponentProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>(initialImages);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload images.'
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    if (selectedImages.length >= maxImages) {
      Alert.alert('Limit Reached', `You can only select up to ${maxImages} images.`);
      return;
    }

    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    setIsLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImages = [...selectedImages, result.assets[0].uri];
        setSelectedImages(newImages);
        onImagesSelected(newImages);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    if (selectedImages.length >= maxImages) {
      Alert.alert('Limit Reached', `You can only select up to ${maxImages} images.`);
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera permissions to take photos.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImages = [...selectedImages, result.assets[0].uri];
        setSelectedImages(newImages);
        onImagesSelected(newImages);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    onImagesSelected(newImages);
  };

  const showOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {selectedImages.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <Ionicons name="close-circle" size={24} color="#FF4444" />
            </TouchableOpacity>
          </View>
        ))}

        {selectedImages.length < maxImages && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={showOptions}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#C8E64D" />
            ) : (
              <>
                <Ionicons name="camera" size={32} color="#C8E64D" />
                <TextBasic style={styles.addText} color="#C8E64D">
                  Add Photo
                </TextBasic>
                <TextBasic style={styles.countText} color="#AAA">
                  {selectedImages.length}/{maxImages}
                </TextBasic>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#333',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#000',
    borderRadius: 12,
  },
  addButton: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C8E64D',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(200, 230, 77, 0.1)',
  },
  addText: {
    marginTop: 5,
    fontSize: 12,
  },
  countText: {
    marginTop: 2,
    fontSize: 10,
  },
});
