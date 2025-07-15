// // Statistics.js
// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ScrollView, 
//   TouchableOpacity, 
//   ActivityIndicator,
//   Alert
// } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import axios from 'axios';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
// import { BarChart, PieChart } from 'react-native-chart-kit';
// import { Dimensions } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const api = axios.create({
//   baseURL: 'http://192.168.42.158:5000',
// });

// const screenWidth = Dimensions.get('window').width;

// const Statistics = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [exporting, setExporting] = useState(false);
//   const [dateRange, setDateRange] = useState({
//     start: new Date(new Date().setDate(new Date().getDate() - 7)),
//     end: new Date()
//   });
//   const [showDatePicker, setShowDatePicker] = useState({
//     start: false,
//     end: false
//   });

//   useEffect(() => {
//     fetchStatistics();
//   }, [dateRange]);

//   const fetchStatistics = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get('/api/violations/stats', {
//         params: {
//           startDate: dateRange.start.toISOString(),
//           endDate: dateRange.end.toISOString()
//         }
//       });
//       setStats(response.data);
//     } catch (error) {
//       console.error('Error fetching statistics:', error);
//       Alert.alert('Error', 'Failed to load statistics');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDateChange = (event, selectedDate, type) => {
//     setShowDatePicker({ ...showDatePicker, [type]: false });
//     if (selectedDate) {
//       setDateRange({ ...dateRange, [type]: selectedDate });
//     }
//   };

//   const exportToCSV = async () => {
//     if (!stats) return;
    
//     try {
//       setExporting(true);
//       const csvHeaders = 'Violation Type,Count,Percentage\n';
//       const csvRows = stats.byType.map(item => 
//         `${item.type},${item.count},${item.percentage}%`
//       ).join('\n');
      
//       const csvContent = csvHeaders + csvRows;
//     //   const fileUri = `FileSystem.documentDirectory + violation_stats_${new Date().toISOString().split('T')[0]}.csv`;
//     const fileUri = `${FileSystem.documentDirectory}violation_stats_${new Date().toISOString().split('T')[0]}.csv`;
      
//       await FileSystem.writeAsStringAsync(fileUri, csvContent, {
//         encoding: FileSystem.EncodingType.UTF8
//       });
      
//       await Sharing.shareAsync(fileUri, {
//         mimeType: 'text/csv',
//         dialogTitle: 'Export Violation Statistics',
//         UTI: 'public.comma-separated-values-text'
//       });
//     } catch (error) {
//       console.error('Export error:', error);
//       Alert.alert('Error', 'Failed to export statistics');
//     } finally {
//       setExporting(false);
//     }
//   };

//   const formatDate = (date) => {
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#1976D2" />
//         <Text style={styles.loadingText}>Loading statistics...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Violation Statistics</Text>
//         <TouchableOpacity 
//           style={styles.exportButton} 
//           onPress={exportToCSV}
//           disabled={exporting}
//         >
//           {exporting ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <>
//               <MaterialIcons name="file-download" size={20} color="white" />
//               <Text style={styles.exportButtonText}>Export</Text>
//             </>
//           )}
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.contentContainer}>
//         <View style={styles.dateRangeContainer}>
//           <TouchableOpacity 
//             style={styles.dateButton}
//             onPress={() => setShowDatePicker({ ...showDatePicker, start: true })}
//           >
//             <MaterialIcons name="date-range" size={18} color="#1976D2" />
//             <Text style={styles.dateText}>From: {formatDate(dateRange.start)}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.dateButton}
//             onPress={() => setShowDatePicker({ ...showDatePicker, end: true })}
//           >
//             <MaterialIcons name="date-range" size={18} color="#1976D2" />
//             <Text style={styles.dateText}>To: {formatDate(dateRange.end)}</Text>
//           </TouchableOpacity>
//         </View>

//         {showDatePicker.start && (
//           <DateTimePicker
//             value={dateRange.start}
//             mode="date"
//             display="default"
//             onChange={(event, date) => handleDateChange(event, date, 'start')}
//           />
//         )}

//         {showDatePicker.end && (
//           <DateTimePicker
//             value={dateRange.end}
//             mode="date"
//             display="default"
//             onChange={(event, date) => handleDateChange(event, date, 'end')}
//           />
//         )}

//         <View style={styles.summaryCard}>
//           <Text style={styles.summaryTitle}>Summary ({formatDate(dateRange.start)} - {formatDate(dateRange.end)})</Text>
//           <View style={styles.summaryRow}>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryNumber}>{stats?.totalVerified}</Text>
//               <Text style={styles.summaryLabel}>Verified</Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryNumber}>{stats?.totalPending}</Text>
//               <Text style={styles.summaryLabel}>Pending</Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryNumber}>{stats?.totalViolations}</Text>
//               <Text style={styles.summaryLabel}>Total</Text>
//             </View>
//           </View>
//         </View>

//         {stats?.byType && (
//           <>
//             <Text style={styles.chartTitle}>Violations by Type</Text>
//             <BarChart
//               data={{
//                 labels: stats.byType.map(item => item.type),
//                 datasets: [{
//                   data: stats.byType.map(item => item.count)
//                 }]
//               }}
//               width={screenWidth - 32}
//               height={220}
//               yAxisLabel=""
//               chartConfig={{
//                 backgroundColor: '#ffffff',
//                 backgroundGradientFrom: '#ffffff',
//                 backgroundGradientTo: '#ffffff',
//                 decimalPlaces: 0,
//                 color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
//                 labelColor: (opacity = 1) =>`rgba(0, 0, 0, ${opacity})`,
//                 style: {
//                   borderRadius: 16
//                 },
//                 barPercentage: 0.5
//               }}
//               style={{
//                 marginVertical: 8,
//                 borderRadius: 16
//               }}
//             />

//             <Text style={styles.chartTitle}>Violation Distribution</Text>
//             <View style={styles.pieChartContainer}>
//               <PieChart
//                 data={stats.byType.map(item => ({
//                   name: item.type,
//                   population: item.count,
//                   color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
//                   legendFontColor: '#7F7F7F',
//                   legendFontSize: 12
//                 }))}
//                 width={screenWidth - 32}
//                 height={200}
//                 chartConfig={{
//                   color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
//                 }}
//                 accessor="population"
//                 backgroundColor="transparent"
//                 paddingLeft="15"
//                 absolute
//               />
//             </View>
//           </>
//         )}

//         {stats?.dailyTrend && (
//           <>
//             <Text style={styles.chartTitle}>Daily Trend</Text>
//             <View style={styles.trendContainer}>
//               {stats.dailyTrend.map((day, index) => (
//                 <View key={index} style={styles.trendItem}>
//                   <Text style={styles.trendDay}>{day.day}</Text>
//                   <View style={styles.trendBarContainer}>
//                     <View 
//                       style={[
//                         styles.trendBar, 
//                         { 
//                           height: `${Math.min(100, (day.count / stats.dailyMax) * 100)}%`,
//                           backgroundColor: day.count > 0 ? '#1976D2' : '#E0E0E0'
//                         }
//                       ]}
//                     />
//                   </View>
//                   <Text style={styles.trendCount}>{day.count}</Text>
//                 </View>
//               ))}
//             </View>
//           </>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   loadingText: {
//     marginTop: 16,
//     color: '#333',
//     fontSize: 16,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#0A2342',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   exportButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1976D2',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   exportButtonText: {
//     color: 'white',
//     fontWeight: '600',
//     marginLeft: 6,
//     fontSize: 14,
//   },
//   contentContainer: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   dateRangeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   dateButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     padding: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     flex: 1,
//     marginHorizontal: 4,
//   },
//   dateText: {
//     marginLeft: 8,
//     color: '#333',
//     fontSize: 14,
//   },
//   summaryCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 2,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     color: '#333',
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   summaryItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   summaryNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1976D2',
//   },
//   summaryLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 4,
//   },
//   chartTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 16,
//     marginBottom: 8,
//     color: '#333',
//   },
//   pieChartContainer: {
//     alignItems: 'center',
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 8,
//     elevation: 2,
//   },
//   trendContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//   },
//   trendItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   trendDay: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 8,
//   },
//   trendBarContainer: {
//     height: 100,
//     width: 20,
//     justifyContent: 'flex-end',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 4,
//     overflow: 'hidden',
//     marginBottom: 4,
//   },
//   trendBar: {
//     width: '100%',
//     borderRadius: 4,
//   },
//   trendCount: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#333',
//   },
// });

// export default Statistics;






// Statistics.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const api = axios.create({
  baseURL: 'http://192.168.83.240:5000',
});

const screenWidth = Dimensions.get('window').width;
const violationColors = {
  "Without Helmet": "#FF6B6B", // Vibrant coral red
  "Phone Usage": "#4ECDC4",   // Tiffany blue
  "Triples": "#FFBE0B",       // Bright yellow
  "Smoking": "#8338EC",       // Electric purple
  "Stunt Riding": "#FB5607",  // Neon orange
  "Fire": "#3A86FF",          // Vivid blue
};


const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date()
  });
  const [showDatePicker, setShowDatePicker] = useState({
    start: false,
    end: false
  });

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/violations/stats', {
        params: {
          startDate: dateRange.start.toISOString(),
          endDate: dateRange.end.toISOString()
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      Alert.alert('Error', 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate, type) => {
    setShowDatePicker({ ...showDatePicker, [type]: false });
    if (selectedDate) {
      setDateRange({ ...dateRange, [type]: selectedDate });
    }
  };

  const exportToCSV = async () => {
    if (!stats) return;
    
    try {
      setExporting(true);
      const csvHeaders = 'Violation Type,Count,Percentage\n';
      const csvRows = stats.byType.map(item => 
        `${item.type},${item.count},${item.percentage}%`
      ).join('\n');
      
      const csvContent = csvHeaders + csvRows;
      const fileUri = FileSystem.documentDirectory + `violation_stats_${new Date().toISOString().split('T')[0]}.csv`;
      
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8
      });
      
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Violation Statistics',
        UTI: 'public.comma-separated-values-text'
      });
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export statistics');
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading statistics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Violation Statistics</Text>
        <TouchableOpacity 
          style={styles.exportButton} 
          onPress={exportToCSV}
          disabled={exporting}
        >
          {exporting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MaterialIcons name="file-download" size={20} color="white" />
              <Text style={styles.exportButtonText}>Export</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.dateRangeContainer}>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker({ ...showDatePicker, start: true })}
          >
            <MaterialIcons name="date-range" size={18} color="#1976D2" />
            <Text style={styles.dateText}>From: {formatDate(dateRange.start)}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker({ ...showDatePicker, end: true })}
          >
            <MaterialIcons name="date-range" size={18} color="#1976D2" />
            <Text style={styles.dateText}>To: {formatDate(dateRange.end)}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker.start && (
          <DateTimePicker
            value={dateRange.start}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange(event, date, 'start')}
          />
        )}

        {showDatePicker.end && (
          <DateTimePicker
            value={dateRange.end}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange(event, date, 'end')}
          />
        )}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Summary ({formatDate(dateRange.start)} - {formatDate(dateRange.end)})</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{stats?.totalVerified}</Text>
              <Text style={styles.summaryLabel}>Verified</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{stats?.totalPending}</Text>
              <Text style={styles.summaryLabel}>Pending</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{stats?.totalViolations}</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>
          </View>
        </View>

        {stats?.byType && (
          <>
            <Text style={styles.chartTitle}>Violations by Type</Text>
            <BarChart
              data={{
                labels: stats.byType.map(item => item.type),
                datasets: [{
                data: stats.byType.map(item => item.count)
              }]
            }}
            width={screenWidth - 32}
            height={300}
            yAxisLabel=""
            chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            barPercentage: 0.5,
            propsForLabels: {
              fontSize: 10,
            },
          }}
          verticalLabelRotation={-45}  
          style={{
             marginVertical: 8,
             borderRadius: 16
          }}
       />


            <Text style={styles.chartTitle}>Violation Distribution</Text>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={stats.byType.map(item => ({
                  name: item.type,
                  population: item.count,
                  color: violationColors[item.type] || '#A0AEC0',
                  legendFontColor: '#7F7F7F',
                  legendFontSize: 12
                }))}
                width={screenWidth - 32}
                height={200}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          </>
        )}

        {stats?.dailyrend && (
          <>
            <Text style={styles.chartTitle}>Daily Trend</Text>
            <View style={styles.trendContainer}>
              {stats.dailyTrend.map((day, index) => (
                <View key={index} style={styles.trendItem}>
                  <Text style={styles.trendDay}>{day.day}</Text>
                  <View style={styles.trendBarContainer}>
                    <View 
                      style={[
                        styles.trendBar, 
                        { 
                          height: `${Math.min(100, (day.count / stats.dailyMax) * 100)}%`,
                          backgroundColor: day.count > 0 ? '#1976D2' : '#E0E0E0'
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.trendCount}>{day.count}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    color: '#333',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#0A2342',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exportButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flex: 1,
    marginHorizontal: 4,
  },
  dateText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 14,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: 'rgb(31, 130, 163)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  

  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  pieChartContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    elevation: 2,
  },
  trendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  trendItem: {
    alignItems: 'center',
    flex: 1,
  },
  trendDay: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  trendBarContainer: {
    height: 100,
    width: 20,
    justifyContent: 'flex-end',
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  trendBar: {
    width: '100%',
    borderRadius: 4,
  },
  trendCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Statistics;






