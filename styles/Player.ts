import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
    playNumber:{
        marginTop: '2%',
        marginRight: '4%',
        textAlign: 'right',
        fontSize: 16,
        color: 'gray',
        fontWeight: 'bold'
    },
    iconContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    audioText:{
        fontSize: 16,
        padding: 15,
    },
    audioController:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10
    }
});
