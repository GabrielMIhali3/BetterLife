import React, {useState, useRef, useEffect} from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet, Button, Dimensions } from "react-native";
import { CameraView, useCameraPermissions } from 'expo-camera';
import  BottomToolbar  from '../components/BottomToolbar/BottomToolbar.jsx';
import DashboardIcon from '../assets/dashboardIcon.svg';

const {height, width} = Dimensions.get('window');

const ActionScreen = ({navigation}) =>{
  const [hasPermission, setHasPermission] = useState(null);
  const [facing, setFacing] = useState('back');
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  console.log(facing);

    useEffect(() => {
      const requestPermissionAsync = async () => {
        const { status } = await requestPermission();
        setHasPermission(status === 'granted');
      };

      requestPermissionAsync();
    }, [requestPermission]);

    if (hasPermission === null) {
      return <Text>Loading...</Text>;
    }

    if (hasPermission === false) {
      return (
        <View style={styles.container}>
          <Text>No access to camera</Text>
          <Button
            title="Go to Settings"
            onPress={() => {
              Linking.openURL('app-settings:');
            }}
          />
        </View>
      );
    }

  return (
      <View style={styles.container}>
          <CameraView style={styles.camera} type={facing} ref={cameraRef} />
          <TouchableOpacity style={styles.dashboardIcon} onPress={()=>{
            navigation.navigate("Dashboard");
          }}>
      <DashboardIcon />
            </TouchableOpacity>
            <View style={styles.bootomtoolbarwrapper}>
                <BottomToolbar navigation={navigation} selectedTab='Camera' style={styles.bottomtoolbar} cameraRef={cameraRef}/>
            </View>
      </View>
  );
}

const styles= StyleSheet.create({

  container: {
    flex: 1,
    position: 'relative',
    margin: 0,
    padding: 0,
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  bottomtoolbarWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 1000,
  },
  bottomtoolbar: {
    height: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashboardIcon: {
    position:'absolute',
    top: 60,
    right: 20,
    zIndex: 999,
  }
});
export default ActionScreen;