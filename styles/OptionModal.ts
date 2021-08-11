import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        zIndex: 1000
    },
    title: {
        fontSize: 20,
        color: '#191919',
        padding: 20,
        paddingBottom: 0
    },
    optionContainer: {
        padding: 20,
    },
    option: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 10,
        letterSpacing: 1
    },
    modalOp:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: 'rgba(0,0,0, 0.2)'
    }
});
