import React, { FC } from 'react';
import { View, Text, Dimensions } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const PlayerButton: FC<{ iconType: string, size: number, color: string, otherProps }> = ({ iconType, size = 40, color = 'black' }) => {
    const getIconName = (type: string) => {
        switch (type) {
            case 'PLAY':
                return 'pause-circle-outline'
            case 'PAUSE':
                return 'play-circle-outline'
            case 'NEXT':
                return 'skip-forward'
            case 'PREV':
                return 'skip-backward'

        }
    }

    return (
        <MaterialIcon name={getIconName(iconType)} size={size} color={color} />
    );
}

export default PlayerButton;
