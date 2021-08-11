import React, { FC } from 'react'
import * as MediaLibrary from 'expo-media-library';
import { styles } from '../styles/AudioFile';
import IconEnt from 'react-native-vector-icons/Entypo';

import { Text, View, Alert, Dimensions, TouchableOpacity } from 'react-native';

export const AudioFile: FC<{ audioFile: MediaLibrary.Asset, onAudioPress: Function, setShowModal: Function, setCurrentItem: Function, filename: string, audioDuration: string, status : string}> = ({ audioFile, onAudioPress, setShowModal, setCurrentItem, filename, audioDuration, status}) => {

  return (
    <View style={styles.audioContainer}>
      <TouchableOpacity onPress={() => { onAudioPress(audioFile) }} style={styles.audioInfoContainer}>
        <Text style={styles.audioText}>{filename}</Text>
        <View style = {styles.audioDurationAndStatus}>
          <Text style={styles.audioText}>{audioDuration}</Text>
          <Text style ={styles.audioStatus}>{status}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setShowModal(true);
          setCurrentItem(audioFile);
        }}>
        <IconEnt name="dots-three-vertical" style={{ fontSize: 20 }} color="black" />
      </TouchableOpacity>
    </View>
  );
}