import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { AppUserContext } from '../contexts/AppUserContext';
import HistogramChart from '../components/HistogramChart.jsx';
import BottomToolbar from '../components/BottomToolbar/BottomToolbar.jsx';
import { getTotalEconomy } from '../services/EconomyService.js';
import FireIcon from '../assets/fire.svg';
import MoneyIcon from '../assets/money_hand.svg';

const DashboardScreen = ({ navigation }) => {
  const { appUser } = useContext(AppUserContext);
  const [economy, setEconomy] = useState(null);
  const [savedMoney, setSavedMoney] = useState(null);
  const [savedKcal, setSavedKcal] = useState(null);

  const sumArray = (arr) => arr.reduce((total, val) => total + val, 0);

  useEffect(() => {
    const fetchData = async () => {
      const economy = await getTotalEconomy(appUser.id);
      setEconomy(economy.data);
      setSavedMoney(sumArray(economy.data.money));
      setSavedKcal(sumArray(economy.data.kcal));
      console.log(economy.data);
    };
    fetchData();
  }, []);
  

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.topContainer}>
          <Text style={styles.helloStyle}>{"Hello " + appUser.username + "!"}</Text>
          <Text style={styles.smartSavings}>{"smart savings healthy living"}</Text>
          {!savedKcal || !savedMoney ? (
          <Text style={{ marginLeft: 25 }}>Loading charts...</Text>
        ) : (
          <View style={styles.stats}>
            <View style={{flexDirection:'row'}}>
              <FireIcon />
              <Text style={{marginLeft:8}}>{savedKcal} kcal</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <MoneyIcon/>
              <Text style={{marginLeft:8}}>{savedMoney} RON</Text>
              </View>
          </View>)
          }
        </View>

        {!economy ? (
          <Text style={{ marginLeft: 25 }}>Loading charts...</Text>
        ) : (
          <>
            <View style={styles.moneySavedLastMonth}>
              <Text style={styles.moneySavedLastMonthText}>Money Saved from Not Buying Products</Text>
              <HistogramChart data={economy.money} type='money'/>
            </View>
            <View style={styles.moneySavedLastMonth}>
              <Text style={styles.moneySavedLastMonthText}>Kcal Saved from Not Buying Products</Text>
              <HistogramChart data={economy.kcal} type='kcal'/>
            </View>
          </>
        )}
      </ScrollView>
      <View style={styles.stickyToolbar}>
        <BottomToolbar navigation={navigation} selectedTab='Dashboard' style={styles.bottomtoolbar} />
      </View>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stats: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contentContainer: {
    paddingTop: 30,
    paddingBottom: 100,
  },
  topContainer: {
    marginTop: 50,
  },
  helloStyle: {
    fontFamily: 'AbhayaLibre-Bold',
    fontSize: 40,
    marginLeft: 25,
  },
  smartSavings: {
    fontFamily: 'MonsieurLaDoulaise',
    fontSize: 45,
    color: '#00C04B',
    marginLeft: 25,
  },
  moneySavedLastMonth: {
    marginTop: 10,
    marginLeft: 25,
  },
  moneySavedLastMonthText: {
    fontFamily: 'AbhayaLibre-Medium',
    fontSize: 20,
  },
  stickyToolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    zIndex: 10,
  },
  bottomtoolbar: {},
});
