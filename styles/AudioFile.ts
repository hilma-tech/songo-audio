import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
    audioContainer:{
        width:  Dimensions.get('window').width,
        height: 100,
        backgroundColor: 'white',
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    audioInfoContainer:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '90%'
    },
    audioDurationAndStatus:{
        display: 'flex',
        flexDirection: 'row',
    },
    audioText:{
        color: 'black'
    },
    audioStatus:{
        marginLeft: 5
    },
    main:{
        margin: 20
    }
});