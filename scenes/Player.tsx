import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { styles } from '../styles/Player';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { observer } from 'mobx-react-lite';
import { audioControllerStore, useAudioController } from '../store/AudioController.store';

const Player = () => {

    const audioStore = useAudioController();
    const { currentAudio, sound, playback, totalCount, audioCurrentIndex, status, audioFiles, playbackPosition, playbackDuration } = audioStore;

    const calculateSeebBar = () => {
        if (playbackPosition !== null && playbackDuration !== null) {
            return playbackPosition / playbackDuration;
        }
        return 0;
    }

    const handlePlayPause = async () => {
        if (sound === null) {
            await audioStore.play(currentAudio, audioCurrentIndex);
        }
        else if (sound.isLoaded && sound.isPlaying) {
            await audioStore.pause();
        }
        else if (sound.isLoaded && !sound.isPlaying) {
            await audioStore.resume();
        }
    }

    const handleNext = async () => {
        try {
            const { isLoaded } = playback ? await playback.getStatusAsync() : { isLoaded: false };
            const isLast = audioCurrentIndex + 1 === totalCount;
            const pause = status === "Pause";
            let audioFile = isLast ? audioFiles[0] : audioFiles[audioCurrentIndex + 1];
            if (!isLoaded && !isLast) {
                await audioStore.play(audioFile, audioCurrentIndex + 1, pause);
                audioStore.setAudioCurrentindex(audioCurrentIndex + 1);
            }
            if (isLoaded && !isLast) {
                await audioStore.playNext(audioFile, audioCurrentIndex + 1, pause);
                audioStore.setAudioCurrentindex(audioCurrentIndex + 1);
            }
            if (isLast) {
                if (isLoaded) {
                    await audioStore.playNext(audioFile, 0, pause);
                }
                else {
                    await audioStore.play(audioFile, 0, pause);
                }
                audioStore.setAudioCurrentindex(0);
            }
        }
        catch (err) {
            console.log("Error in playing next video");
        }
    }

    const onUpdate = async(val) => {
        await audioStore.updateAudioTime(val);
    }

    const handlePrevious = async () => {
        try {
            const { isLoaded } = playback ? await playback.getStatusAsync() : { isLoaded: false };
            const isFirst = audioCurrentIndex - 1 < 0;
            const pause = status === "Pause";
            let audioFile = isFirst ? audioFiles[totalCount -1] : audioFiles[audioCurrentIndex - 1];
            if (!isLoaded && !isFirst) {
                console.log(audioCurrentIndex - 1);
                await audioStore.play(audioFile, audioCurrentIndex - 1, pause);
                audioStore.setAudioCurrentindex(audioCurrentIndex - 1);
            }
            if (isLoaded && !isFirst) {
                console.log(audioCurrentIndex - 1);
                await audioStore.playNext(audioFile, audioCurrentIndex - 1, pause);
                audioStore.setAudioCurrentindex(audioCurrentIndex - 1);
            }
            if (isFirst) {
                if (isLoaded) {
                    await audioStore.playNext(audioFile, totalCount - 1, pause);
                }
                else {
                    await audioStore.play(audioFile, totalCount - 1, pause);
                }
                audioStore.setAudioCurrentindex(totalCount - 1);
            }
        }
        catch (err) {
            console.log("Error in playing next video");
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.playNumber}>
                {`${audioCurrentIndex + 1} / ${totalCount}`}
            </Text>
            <View style={styles.iconContainer}>
                <MaterialIcon name='music-circle' size={300} color={status === "Playing" ? 'purple' : 'gray'} />
            </View>
            <View style={styles.audioPlayerContainer}>
                <Text numberOfLines={1} style={styles.audioText} >{currentAudio ? currentAudio.filename : "לא נבחר שיר"}</Text>
                <Slider
                    style={{ width: Dimensions.get('window').width, height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    value={calculateSeebBar()}
                    onValueChange = {onUpdate}
                    minumumTrackTintColor="#FFFFFF"
                    maximumTrackTintValue="#000000"
                />
                <View style={styles.audioController}>
                    <TouchableOpacity onPress={handlePrevious}>
                        <PlayerButton iconType="PREV" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginHorizontal: 25 }} onPress={handlePlayPause}>
                        <PlayerButton iconType={status === "Playing" ? "PLAY" : "PAUSE"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNext}>
                        <PlayerButton iconType="NEXT" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )

}

export default observer(Player);