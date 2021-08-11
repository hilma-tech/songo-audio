import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { AudioFile } from '../components/AudioFile';
import OptionModal from '../modals/OptionModal';
import { observer } from 'mobx-react-lite';
import { audioControllerStore, useAudioController } from '../store/AudioController.store';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SelectAudio() {

  // const [audioFiles, setAudioFiles] = useState<Array<MediaLibrary.Asset>>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<MediaLibrary.Asset | null>(null);

  const audioStore = useAudioController();

  const { currentAudio, status, audioFiles } = audioStore;

  useEffect(() => {
    getPermission();
    audioStore.loadPreviousAudio();
  }, []);


  const dispalyAlert = (alertTitle: string, alertBody: string, askForPermission: boolean) => {
    Alert.alert(alertTitle, alertBody, askForPermission ?
      [
        { text: 'Ok', onPress: getPermission },
        { text: 'Cancel', onPress: () => { dispalyAlert("permission required", "This app needs to read audio files", true) } }
      ] : []
    )
  }

  const getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync();
    if (permission.granted) {
      //get files
      getAudioFiles();
    }
    else if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'denied' && canAskAgain) {
        dispalyAlert("permission required", "This app needs to read audio files", true)
      }
      else if (status === "granted") {
        //get files
        getAudioFiles();
      }
      else if (status === 'denied' && !canAskAgain) {
        //show an error
      }
    }
  }

  const getAudioFiles = async () => {
    const albums = await MediaLibrary.getAlbumsAsync();

    const songoAlbum = albums.find((album) => album.title.toLowerCase() === "songo");

    if (!songoAlbum) {
      dispalyAlert('Songo directory not found', 'Plese create a direcotry on your device and call it Songo', false);
      return;
    }

    let media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', album: songoAlbum.id });
    media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', first: media.totalCount, album: songoAlbum.id });
    audioStore.setTotalCount(media.totalCount);
    audioStore.setAudioFiles(media.assets);
  }

  const onAudioPress = async (audio: MediaLibrary.Asset) => {

    const { sound, playback, currentAudio } = audioStore;
    if (!sound) {
      console.log("play");
      audioStore.setAudioCurrentindex(getAudioIndex(audio.id));
      await audioStore.play(audio, getAudioIndex(audio.id));
    }
    else if (sound.isLoaded && sound.isPlaying) {
      console.log("pause");
      if (audio.id !== currentAudio?.id) {
        audioStore.setAudioCurrentindex(getAudioIndex(audio.id));
        await audioStore.playNext(audio, getAudioIndex(audio.id));
        return;
      }
      await audioStore.pause();
    }
    else if (sound.isLoaded && !sound.isPlaying && audio.id === currentAudio?.id) {
      console.log("resume");
      await audioStore.resume();
    }
    else if (sound.isLoaded && audio.id !== currentAudio?.id) {
      console.log("play next ");
      audioStore.setAudioCurrentindex(getAudioIndex(audio.id));
      await audioStore.playNext(audio, getAudioIndex(audio.id));
    }

  }

  const getAudioIndex = (id) => {
    const index = audioFiles.findIndex((audio) => audio.id === id);
    return index;
  }


  return (
    <View>

      {
        audioFiles.map(audioFile => {
          const filename = audioFile.filename.substring(0, audioFile.filename.length - 4).substring(0, 30) + '...';
          const minutes = Math.floor(audioFile.duration / 60) < 10 ? `0${Math.floor(audioFile.duration / 60)}` : Math.floor(audioFile.duration / 60);
          const seconds = Math.floor(audioFile.duration % 60) < 10 ? `0${Math.floor(audioFile.duration % 60)}` : Math.floor(audioFile.duration % 60);
          const audioDuration = `${minutes}:${seconds}`;
          const audioStatus = currentAudio?.id === audioFile.id ? status : 'Not playing';

          return (
            <View key={audioFile.id}>
              <AudioFile audioFile={audioFile} onAudioPress={onAudioPress} setShowModal={setShowModal} setCurrentItem={setCurrentItem} filename={filename} audioDuration={audioDuration} status={audioStatus} />
            </View>
          );
        })
      }
      <OptionModal item={currentItem} onAudioPress = {onAudioPress} visible={showModal} onClose={() => { setShowModal(false) }} />

    </View>

  );
}

export default observer(SelectAudio)

