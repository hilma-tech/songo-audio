import React, { FC } from 'react';
import { Modal, View, Text, TouchableWithoutFeedback } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { styles } from '../styles/OptionModal';
import { useAudioController } from '../store/AudioController.store';
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';

const OptionModal: FC<{ visible: boolean, onClose: Function, item: MediaLibrary.Asset | null, onAudioPress: Function}> = ({ visible, onClose, item, onAudioPress }) => {

    const audioStore = useAudioController();

    const { audioFiles, status, currentAudio } = audioStore;
    const navigation = useNavigation();

    const handlePlayPress = async () => {
        await onClose();
        await onAudioPress(item);
        !(status === "Playing" && currentAudio?.id === item?.id )&& navigation.navigate("Player");
    }
    return (
        <Modal animationType={'slide'} transparent={true} visible={visible}>
            <View style={styles.modal}>
                <Text style={styles.title}>{item ? item?.filename.substring(0, item?.filename.length - 4).substring(0, 30) + '...' : null}</Text>
                <View style={styles.optionContainer}>
                    <TouchableWithoutFeedback onPress={handlePlayPress}>
                        <Text style={styles.option}>{status === "Playing" && currentAudio?.id === item?.id ? "Pause" : "Play"}</Text>
                    </TouchableWithoutFeedback>
                    {/* <TouchableWithoutFeedback>
                        <Text style={styles.option}>Add to Playlist</Text>
                    </TouchableWithoutFeedback> */}
                </View>
            </View>
            <TouchableWithoutFeedback onPress={() => { onClose(); }}>
                <View style={styles.modalOp} />
            </TouchableWithoutFeedback>
        </Modal>
    );
}

export default OptionModal;