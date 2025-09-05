import React from 'react';
import { View, Dimensions, StyleSheet} from 'react-native';
import { Text } from 'react-native-svg';
import {
  LineChart
} from 'react-native-chart-kit'

const HistogramChart = ({ data, type }) => {
  const line = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            data: data,
            color: (opacity = 1) => `rgba(0, 192, 75, ${opacity})`,
            strokeWidth: 2, 
          },
        ],
      };

  return (<View >
           <Text>
             Bezier Line Chart
           </Text>
           <LineChart
             data={line}
             width={Dimensions.get('window').width-45} 
             height={220}
             yAxisLabel={type=='money' ? 'RON ' : 'Kcal '}
             yAxisSuffix=" "
             chartConfig={{
               backgroundColor: '#FFFFFF',
               backgroundGradientFrom: '#FFFFFF',
               backgroundGradientTo: '#FFFFFF', 
               decimalPlaces: 0, 
               color: (opacity = 1) => `rgba(0, 192, 75, ${opacity})`,
               propsForBackgroundLines: {
                stroke: `rgba(0, 192, 75, 0.2)`,
              },
               style: {
                 borderRadius: 16,
                 
               },
             }}
             bezier
             style={{
               marginVertical: 8,
               borderRadius: 0
             }}
           />
         </View>);
};

export default HistogramChart;