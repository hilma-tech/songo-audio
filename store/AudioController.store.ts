import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { createMobXContext } from '@hilma/tools';
import * as MediaLibrary from 'expo-media-library';
import { Audio, AVPlaybackStatus } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AudioControllerStore {
    audioFiles: Array<MediaLibrary.Asset> = [];
    playback: Audio.Sound | null = null;
    sound: AVPlaybackStatus | null = null;
    currentAudio: MediaLibrary.Asset | null = null;
    status: string = 'Not playing';
    totalCount: number = 0;
    audioCurrentIndex: number = 0;
    playbackPosition: number | null = null;
    playbackDuration: number | null = null;

    constructor() {
        makeObservable(this, {
            audioFiles: observable,
            playback: observable,
            sound: observable,
            currentAudio: observable,
            status: observable,
            totalCount: observable,
            audioCurrentIndex: observable,
            playbackPosition: observable,
            playbackDuration: observable,
            play: action,
            resume: action,
            pause: action,
            handleChangeState: action,
            playNext: action,
            setAudioCurrentindex: action,
            setTotalCount: action,
            setAudioFiles: action,
            setCurrentAudio: action,
            setStatus: action,
            setAudioCurrentIndex: action,
            setPlaybackPosition: action,
            onPlaybackStatusUpdate: action,
            storeAudioForNextTime: action
        });
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
            playThroughEarpieceAndroid: false
        });
    }

    async play(audio: MediaLibrary.Asset, index: number, withPause = false) {
        try {
            const playbackObj = new Audio.Sound();
            const status = await playbackObj.loadAsync({ uri: audio.uri }, { shouldPlay: !withPause ? true : false });
            this.handleChangeState(playbackObj, status, audio, !withPause ? 'Playing' : 'Pause');
            this.playback.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
            await this.storeAudioForNextTime(audio, index);

        }
        catch (err) {
            console.log("Error inside play function ", err);
        }

    }

    async pause() {
        try {
            const status = this.playback ? await this.playback.setStatusAsync({ shouldPlay: false }) : null;
            this.handleChangeState(null, status, null, 'Pause');
        }
        catch (err) {
            console.log("Error inside pause function ", err);
        }
    }

    async resume() {
        try {
            const status = this.playback ? await this.playback.playAsync() : null;
            this.handleChangeState(null, status, null, 'Playing');
        }
        catch (err) {
            console.log("Error inside resume function ", err);
        }
    }

    async playNext(audio: MediaLibrary.Asset, index: number, withPause = false) {
        try {
            await this.playback?.stopAsync();
            await this.playback?.unloadAsync();
            await this.play(audio, index, withPause);
        }
        catch (err) {
            console.log("Error inside play next function ", err);
        }
    }

    handleChangeState(playback: Audio.Sound | null, sound: AVPlaybackStatus | null, currentAudio: MediaLibrary.Asset | null, status: string, changeNull = false) {
        if (playback || changeNull) {
            this.playback = playback;
        }
        if (sound || changeNull) {
            this.sound = sound;
        }
        if (currentAudio || changeNull) {
            this.currentAudio = currentAudio;
        }
        if (status || changeNull) {
            this.status = status;
        }
    }

    onPlaybackStatusUpdate = async (playbackStatus) => {
        if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
            this.playbackPosition = playbackStatus.positionMillis;
            this.playbackDuration = playbackStatus.durationMillis;
        }
        if (playbackStatus.didJustFinish) {
            const nextAudioIndex = this.audioCurrentIndex + 1;
            if (nextAudioIndex >= this.totalCount) {
                this.setAudioCurrentindex(0);
                return await this.playNext(this.audioFiles[0], 0, this.status === "Pause");
            }
            const audio = this.audioFiles[nextAudioIndex];
            this.setAudioCurrentindex(nextAudioIndex);
            await this.playNext(audio, nextAudioIndex);

        }
    }

    storeAudioForNextTime = async (audio: MediaLibrary.Asset, index: number) => {
        await AsyncStorage.setItem('previousAudio', JSON.stringify({ audio, index }));
    }

    loadPreviousAudio = async () => {
        let previousAudio: any = await AsyncStorage.getItem('previousAudio');
        let currentAudioFile;
        let currentAudioIndex;
        if (previousAudio === null) {
            currentAudioFile = this.audioFiles[0];
            currentAudioIndex = 0;
        }
        else {
            previousAudio = JSON.parse(previousAudio);
            console.log(previousAudio.index);
            currentAudioFile = previousAudio.audio;
            currentAudioIndex = previousAudio.index;
            this.setCurrentAudio(currentAudioFile);
            this.setAudioCurrentindex(currentAudioIndex);
        }

    }

    async updateAudioTime(precentage) {
        try {
            const positionMillis = precentage * this.playbackDuration;
            const status = this.playback ? await this.playback.setStatusAsync({ shouldPlay: this.status === "Playing" ? true : false, positionMillis }) : null;
            this.handleChangeState(null, status, null, null);
            
            this.setPlaybackPosition(positionMillis);
        }
        catch (err) {
            console.log("Error inside pause function ", err);
        }
    }

    setPlaybackPosition(positionMillis){
        this.playbackPosition = positionMillis;
    }
    setAudioCurrentindex(index: number) {
        this.audioCurrentIndex = index;
    }

    setTotalCount(totalCount: number) {
        this.totalCount = totalCount;
    }

    setAudioFiles(audioFiles: Array<MediaLibrary.Asset>) {
        this.audioFiles = audioFiles;
    }

    setCurrentAudio(currentAudio: MediaLibrary.Asset | null) {
        this.currentAudio = currentAudio;
    }

    setStatus(status: string) {
        this.status = status;
    }

    setAudioCurrentIndex(index: number) {
        this.audioCurrentIndex = index;
    }

}

export const audioControllerStore = new AudioControllerStore();

export const [AudioControllerContext, AudioControllerProvider, useAudioController] = createMobXContext(audioControllerStore);