import React, {useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Linking } from 'react-native';
import { TextInput } from 'react-native';
import { Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { askChatBotAfterScan } from '../services/ChatBotService.js';
import { createProduct, findProductByName } from '../services/ProductService.js';
import { AppUserContext } from "../contexts/AppUserContext";
import { createScanHistory } from '../services/scanHistoryService.js';
import { getLocations } from '../services/ScanService.js';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import FlameIcon from '../assets/fire.svg';
import WeightIcon from '../assets/weight.svg';
import StepsIcon from '../assets/steps.svg';

const stores = [
    { id: 'auchan', name: 'Auchan', logo: require('../assets/auchanLogo.png')},
    { id: 'carrefour', name: 'Carrefour', logo: require('../assets/CarrefourLogo.png') },
    { id: 'kaufland', name: 'Kaufland', logo: require('../assets/KauflandLogo.png')},
    { id: 'mega', name: 'Mega Image', logo: require('../assets/Mega_ImageLogo.png')},
    { id: 'profi', name: 'Profi', logo: require('../assets/profiLogo.png')}
];

const ScanScreen = ({ route, navigation }) => {
    const [selectedStore, setSelectedStore] = useState(null);
    const { appUser} = useContext(AppUserContext);
    const [messageAI, setMessageAI] = useState('');

    const [showInput, setShowInput] = useState(0);
    const fadeAnim = useState(new Animated.Value(0))[0];
    
    const { productData } = route.params;
    const [productId, setProductId] = useState(null);


    const [location, setLocation] = useState(null);
    const [nearestStore, setNearestStore] = useState(null);

    const [sliderValue, setSliderValue] = useState(50);

    useEffect(() => {
        if (productData && productData.name){
            findProductByName(productData.name).then((response) => {
                const id = response.data.id;
                setProductId(id);
            }).catch(error => {
                if (error.response && error.response.status === 404){
                    const product = {
                        'name': productData.name,
                        'kcal': productData.kcal,
                        'weight': productData.weight
                    };
                    createProduct(product).then((response) => {
                        const id = response.data.id;
                        setProductId(id);
                    }).catch(error => {
                        console.log(error.response.data);
                    });
                }
            });
        }
        const fetchLocation = async () => {
                
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    const userLocation = await Location.getCurrentPositionAsync({});
                    setLocation(userLocation.coords);
                    const response = await getLocations({
                        current_coordinates: [userLocation.coords.latitude, userLocation.coords.longitude],
                        stores: productData['prices_min'][0]
                    });
                    setNearestStore(response.data);
                }
          };
      
          fetchLocation();
    }, []);

    useEffect(() => {
        if (messageAI !== '') {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
            setShowInput(2);
        }
    }, [messageAI]);
    

    const handleStoreClick = () => {
        if (selectedStore){
            const scanHistory = {
                'user_id' : appUser.id,
                'product_id': productId,
                'purchased': true,
                'price': productData.prices[selectedStore],
                'scanned_at': new Date().toISOString()
            };

            createScanHistory(scanHistory).then((response) => {
                console.log(response.data);
                navigation.navigate("Action");
            }).catch( error => {
                console.log(error.response.data);
            });
        }
        else{
            Alert.alert("Nu ai selectat magazinul!");
        }
    };

    const handleCancel = () => {
            const scanHistory = {
                'user_id' : appUser.id,
                'product_id': productId,
                'purchased': false,
                'price': Math.min(...Object.values(productData.prices)),
                'scanned_at': new Date().toISOString()
            };

            createScanHistory(scanHistory).then((response) => {
                console.log(response.data);
                navigation.navigate("Action");
            }).catch( error => {
                console.log(error.response.data);
            });
    };

    const handlePress = () => {
        setShowInput(1);
        askChatBotAfterScan(appUser.id, productId).then((response) => {
            console.log(response.data);
            setMessageAI(response.data['response']);
        }).catch(err => {
            console.log(err?.response?.data || err.message);
            setMessageAI("Sorry, something went wrong!");
        });
    };
    

    useEffect(() => {
        if (messageAI!='')
            setShowInput(2);
    },[messageAI])

    const openGoogleMaps = (coords) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`;
        Linking.openURL(url);
      };

    
    
    return (
        <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Product Details</Text>               
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.label}>{productData.name}</Text>
                    <Text style={styles.label}><WeightIcon width={20} height={20}/> {productData.weight}g</Text>
                    <Text style={styles.label}><FlameIcon width={20} height={20}/> {productData.kcal}kcal/100g</Text>
                    <Text style={styles.label}><StepsIcon width={20} height={20}/> {productData.calculate_time_to_burn_calories} minutes</Text>
                    <Text style={styles.label}>Prices:</Text>
                    
                    {stores.map((store) => (store.name in productData.prices && (
                        <TouchableOpacity key={store.id} style={[styles.storeCard, selectedStore === store.name && styles.selectedCard]} onPress={() => setSelectedStore(store.name)}>
                            {store.logo && <Image source={store.logo} style={styles.storeLogo} />}
                            <Text style={styles.storeName}>{store.name}</Text>
                            <Text style={styles.price}>{productData.prices[store.name]} RON</Text>
                        </TouchableOpacity>
                    )))}

                    <Slider
                        minimumValue={0}
                        maximumValue={100}
                        step={10}
                        value={sliderValue}
                        onSlidingComplete={value => setSliderValue(value)}
                        thumbTintColor="#7D2AE8"
                        minimumTrackTintColor="#3F9FFF"
                        maximumTrackTintColor="#D3D3D3"
                    />
                    <Text style={styles.label}>Choose the amount for consumption:</Text>
                    <Text style={styles.sliderValue}>Walking time to burn these calories: {productData.calculate_time_to_burn_calories * sliderValue/100} minutes for {sliderValue}% of product</Text>

                </View>

                <View>
                {showInput == 0 ? (
                    <TouchableOpacity onPress={handlePress} style={styles.chatbotButtonContainer}>
                        <LinearGradient
                            colors={['#7D2AE8', '#3F9FFF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.chatbotButton}
                        >
                            <Ionicons name="aperture-outline" size={22} color="white" style={styles.chatbotIcon} />
                            <Text style={styles.chatbotButtonText}>Ask the AI Assistant</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ) : showInput == 1 ? (
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontStyle: 'italic', color: '#999' }}>AI is typing...</Text>
                    </View>
                ) : showInput == 2 ? (
                    <Animated.View style={[styles.textAreaContainer, { opacity: fadeAnim }]}>
                        <LinearGradient
                            colors={['#7D2AE8', '#3F9FFF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.textAreaBorder}
                        >
                            <View style={styles.textArea}>
                                <TextInput
                                    placeholder="AI is typing..."
                                    placeholderTextColor="#B0A8D9"
                                    multiline
                                    editable={false}
                                    style={styles.textAreaInput}
                                    value={messageAI}
                                />
                            </View>
                        </LinearGradient>
                    </Animated.View>
                ) : null}
            </View>


                <View style={styles.containerMaps}>
                    <Text style={styles.textMaps}>The nearest store with the lowest price:</Text>

                    <TouchableOpacity style={styles.googleMapsButton} onPress={() => openGoogleMaps(nearestStore[Object.keys(nearestStore)[0]][1])}>
                        <Image source={require('../assets/googleMapsLogo.png')} style={styles.googleMapsIcon} />
                        <Text style={styles.buttonTextMaps}>Google Maps</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.ContainerBuy}>
                    <Text style={{ textAlign: 'center', fontSize: 25, fontWeight: 'bold' }}>Do you still wish to purchase the product?</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20}}>
                        <TouchableOpacity style={styles.buttonNo} onPress={handleCancel}>
                            <Text style={styles.buttonTextNo}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonYes} onPress={handleStoreClick}>
                            <Text style={styles.buttonTextYes}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    buttonNo: {
        backgroundColor: '#6DBE61',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonYes: {
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderColor: '#6DBE61',
        alignItems: 'center',
    },
    buttonTextNo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    buttonTextYes: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    ContainerBuy: {
        marginTop: 20,
        marginBottom: 30, 
        textAlign: 'center',
    },
    container: {
        backgroundColor: 'white',
        flex:1,
        padding: 16,
        marginTop: 40,
    },
    scrollView: {
        flexGrow: 1, 
        paddingHorizontal: 16,
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
    },
    infoContainer: {
        borderRadius: 12,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
    },
    storeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 10,
        padding: 12,
        marginVertical: 5,
    },
    selectedCard: {
        backgroundColor: '#DFFFD6',
        borderColor: 'darkgreen',
    },
    storeLogo: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    storeName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
    },



    chatbotButtonContainer: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    chatbotButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#7D2AE8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    chatbotIcon: {
        marginRight: 8,
    },
    chatbotButtonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textAreaContainer: {
        marginTop: 10,
    },
    textAreaBorder: {
        borderRadius: 12,
        padding: 2,
    },
    textArea: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 14,
        minHeight: 100,
    },
    textAreaInput: {
        fontSize: 15,
        color: '#7A5EB5',
        fontWeight: '500',
    },



    containerMaps: {
        marginTop: 20,
    },
    googleMapsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F3F4',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        shadowColor: '#333',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    googleMapsIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    buttonTextMaps: {
        color: '#4285F4', 
        fontSize: 16,
        fontWeight: 'bold',
    },
    textMaps:{
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },

    
});

export default ScanScreen;
