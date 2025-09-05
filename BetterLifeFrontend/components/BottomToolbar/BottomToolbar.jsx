import { TouchableOpacity, Image, View, Text, Platform, Alert } from "react-native"
import qrCodeImg from '../../assets/qrCode.png';
import historyIcon from '../../assets/Clipboard.png'
import historyIconGreen from '../../assets/historyIconGreen.png'
import chatbotIcon from '../../assets/chatbotIcon.png'
import chatbotIconGreen from '../../assets/chatbotIconGreen.png'
import styles from "./BottomToolbar.js"
import React, { useContext, useEffect, useState} from "react";
import { AppUserContext } from "../../contexts/AppUserContext.js";
import { scanBarCode } from "../../services/ScanService.js";

const ChatbotButton = ( {selectedTab} ) => {
 if (selectedTab!='Chatbot')
  return (<Image source={chatbotIcon} />)
 else
 return (<Image source={chatbotIconGreen} />)
}

const HistoryButton = ( {selectedTab} ) => {
  if (selectedTab!='History')
    return (<Image source={historyIcon} />)
  else
  return (<Image source={historyIconGreen} />)
}


const BottomToolbar = ({ navigation, selectedTab, cameraRef}) => {

  [photo, setPhoto] = useState('null');
  const { appUser } = useContext(AppUserContext);
  
  useEffect(() => {
    console.log('SelectedTab' + selectedTab);
  }, []); 

  const takeCameraPicture = async () => {
    if (cameraRef && cameraRef?.current) { 
      try {
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);
        console.log("Picture taken:", data.uri);
        setPhoto(data.uri);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    } else {
      console.log("CameraRef is not set!");
    }
  };
  if (cameraRef){
  useEffect(() => {
    console.log("CameraRef set:",cameraRef.current)
  }, [cameraRef.current]);
}

  useEffect(() => {
    console.log('Photo got rerendered',photo);
    if (photo && photo !== 'null') {
      console.log('Uploading new image');
      uploadImage();
    }
  }, [photo]);
  
  const uploadImage = async () => {
    if (!photo) {
      return;
    }
    const uri = photo;
    const formData = new FormData();
    formData.append('img_barcode', {
      uri: uri,
      type: 'image/jpeg',
      name: `photo_${Date.now()}.jpg`,
    });
    console.log("Final formData: ", formData);
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    try {
      // const response = await axios.post("http://192.168.0.183:5000/scan/scan_barcode/"+appUser.weight, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      const response = await scanBarCode(appUser.weight, formData);

      console.log("Product Name:", response.data.name);
      console.log("Barcode:", response.data.barcode);
      console.log("Weight:", response.data.weight);
      console.log("Prices:", response.data.prices);
      console.log("Min Price:", response.data.prices_min);
      console.log("Kcal:", response.data.kcal);
      console.log("Time to Burn Calories:", response.data.calculate_time_to_burn_calories);
      
      const productData = response.data;
      navigation.navigate("Scan", {
        productData: productData,
      });

    } catch (error) {
      if (error.response) {
        setTimeout(() => {
          Alert.alert("Barcode has not been found! Please take a new picture!");
        }, 100);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Axios request error:", error.message);
      }
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <View style={styles.chatbotContainer}>
          <TouchableOpacity style={styles.chatbotButton} activeOpacity={1} onPress={() => {
            navigation.navigate('Chatbot');
          }}>
            <ChatbotButton selectedTab={selectedTab}/>
          </TouchableOpacity>
          <Text style={styles.chatbotText}>Chatbot</Text>
        </View>

        <View style={styles.glow}>
          <TouchableOpacity style={styles.qrButton} activeOpacity={1} onPress={() =>{
              console.log('Qr button pressed!');
              if (selectedTab!='Camera')
                navigation.navigate('Action');
              else
                takeCameraPicture();
                }}>
            <Image source={qrCodeImg}  />
          </TouchableOpacity>
        </View>
        <View style={styles.clipboardContainer}>
          <TouchableOpacity style={styles.clipboardButton} activeOpacity={1} onPress={() =>{
            navigation.navigate('History');
          }}>
            <HistoryButton selectedTab={selectedTab}/>
          </TouchableOpacity>
          <Text style={styles.clipboardText}>History</Text> 
        </View>
      </View>

      <View style={styles.blackRectangle} />
    </View>
);
};

export default BottomToolbar;
