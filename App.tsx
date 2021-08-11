

import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import Navigator from './navigation/Navigator';
import { AudioControllerProvider } from './store/AudioController.store';
const App = () => {


  return (
    <View style ={{flex: 1}}>
      <Navigator />
    </View>
  );
};



export default App;
