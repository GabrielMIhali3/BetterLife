import React, {useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, LayoutAnimation, UIManager, Platform} from "react-native";
import { AppUserContext } from "../contexts/AppUserContext";
import { AppScanHistoryContext } from '../contexts/AppScanHistoryContext.js';
import  BottomToolbar  from '../components/BottomToolbar/BottomToolbar.jsx';
import { MaterialIcons } from "@expo/vector-icons";
import StepsIcon from "../assets/steps.svg";
import NutritionIcon from "../assets/nutrition.svg";
import MoneyIcon from "../assets/money.svg";
import DenyIcon from "../assets/denied.svg";
import ConfirmIcon from "../assets/confirm.svg";
import DashboardIcon from '../assets/dashboardIcon.svg'
import { getScanHistory } from '../services/scanHistoryService.js';
import { calculateTimeToBurnCalories } from '../utils/calorieCalculator.js';
import { getProductData } from '../services/ProductService.js';

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental){
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HistoryScreen = ({navigation}) => {
      const { appUser, setAppUser} = useContext(AppUserContext);
      const { appScanHistory, setAppScanHistory} = useContext(AppScanHistoryContext);
      const [ expandedIndex, setExpandedIndex] = useState(null);
      const [ data, setData] = useState(null);
      const [loading, setLoading] = useState(true);

      const dummy_data = [
        { id: "1", name: "Product A", date: "2025-03-27", time: "14:30", price: "$10", steps: "2 Steps", nutrition: "200 kcal" },
        { id: "2", name: "Product B", date: "2025-03-26", time: "13:00", price: "$15", steps: "3 Steps", nutrition: "300 kcal" },
        { id: "3", name: "Product C", date: "2025-03-25", time: "12:00", price: "$20", steps: "5 Steps", nutrition: "500 kcal" },
        { id: "4", name: "Product A", date: "2025-03-27", time: "14:30", price: "$10", steps: "2 Steps", nutrition: "200 kcal" },
        { id: "5", name: "Product B", date: "2025-03-26", time: "13:00", price: "$15", steps: "3 Steps", nutrition: "300 kcal" },
        { id: "6", name: "Product C", date: "2025-03-25", time: "12:00", price: "$20", steps: "5 Steps", nutrition: "500 kcal" },
        { id: "7", name: "Product A", date: "2025-03-27", time: "14:30", price: "$10", steps: "2 Steps", nutrition: "200 kcal" },
        { id: "8", name: "Product B", date: "2025-03-26", time: "13:00", price: "$15", steps: "3 Steps", nutrition: "300 kcal" },
        { id: "9", name: "Product C", date: "2025-03-25", time: "12:00", price: "$20", steps: "5 Steps", nutrition: "500 kcal" },
      ];


      console.log("ignoring...",appScanHistory);

      useEffect(() => {
        const fetchData = async () => {
            try {
                let current_id = 1;
                const results = [];

                const scanHistory_result = await getScanHistory(appUser.id);
                const scanHistory=scanHistory_result.data;
                console.log("SCAN HISTORY ",scanHistory);
                
                await setAppScanHistory(scanHistory);

                for (const element of scanHistory) {
                    // const response = await axios.get(`http://192.168.0.183:5000/product/getById/${element.product_id}`);
                    const response = await getProductData(element.product_id);

                    const current_product = response.data;

                    console.log("Fetched current product:", current_product);

                    const time = calculateTimeToBurnCalories(appUser.weight,current_product.kcal,current_product.weight);

                    results.push({
                        id: current_id,
                        name: current_product.name,
                        date_time: element.scanned_at.split(" ").slice(0,5).join(" "),
                        price: element.price,
                        steps: time,
                        nutrition: current_product.kcal,
                        purchased: element.purchased,
                    });

                    console.log('Purchase status: ',element.purchased);
                    current_id += 1;
                }
                results.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
                setData(results);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

      if (loading) return (<View><Text>Loading...</Text></View>);


      const toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
      }

      const renderItem = ({ item, index }) => (
        <TouchableOpacity onPress={() => toggleExpand(index)} style={{ backgroundColor: "#00C04B2F", margin: 10, marginTop:-3, padding: 15, borderRadius: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ marginLeft:-5}}>
                <MaterialIcons name={expandedIndex === index ? "expand-less" : "expand-more"}  size={24} color="green" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: "bold", flex: 1, marginLeft:5}}>{item.name}</Text>
                <View pointerEvents="box-none">
                {item.purchased ? <ConfirmIcon /> : <DenyIcon />}
                </View>
            </View>

            <Text style={{ color: "gray", marginLeft: 23}}>{item.date_time}</Text>

            {expandedIndex === index && (
                <View style={{ marginTop: 10, marginLeft: 23}}>
                    <View style={{ flexDirection:"row", alignItems:"center"}}>
                        <MoneyIcon width={20} height={20}/><Text > Price: {item.price} lei</Text>
                    </View>
                    <View style={{ flexDirection:"row", alignItems:"center"}}>
                      <StepsIcon width={20} height={20}/><Text> Walk time: {item.steps} minutes</Text>
                    </View>
                    <View style={{ flexDirection:"row", alignItems:"center"}}>
                     <NutritionIcon width={20} height={20}/><Text> Nutrition: {item.nutrition} kcal</Text>
                    </View>
                </View>
            )}
        </TouchableOpacity>
      );

      console.log('Logged in user data:',appUser);
      console.log('User scan history:',appScanHistory);
      console.log('Data is:',data);
      return (
          <View style={styles.container}>
            <Text style={styles.title} >History</Text>
              <TouchableOpacity style={styles.dashboardIcon} onPress={()=>{
            navigation.navigate("Dashboard");
          }}><DashboardIcon/></TouchableOpacity>
              <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{paddingBottom: 80}}
              />
              <BottomToolbar navigation={navigation} selectedTab='History' style={styles.bottomtoolbar}/>
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
  title: {
    padding:15,
    marginTop:40,
    fontFamily: "Poppins-Bold",
    fontSize: 30,
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
  },
});
export default HistoryScreen;