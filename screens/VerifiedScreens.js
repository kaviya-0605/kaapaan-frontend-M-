



// // VerifiedScreens.js
// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   Dimensions,
//   TouchableOpacity,
//   RefreshControl,
//   Modal,
//   Animated,
//   Easing,
//   Alert,
// } from 'react-native';
// import axios from 'axios';
// import { MaterialIcons } from '@expo/vector-icons';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';

// const { width, height } = Dimensions.get('window');
// const CARD_WIDTH = (width - 40) / 2;

// const api = axios.create({
//   baseURL: 'http://192.168.42.158:5000',
// });

// const VIOLATION_TYPES = {
//   noHelmet: { label: 'No Helmet', color: '#34D399', icon: 'motorcycle' },
//   phoneUsage: { label: 'Phone Usage', color: '#9CA3AF', icon: 'smartphone' },
//   tripling: { label: 'Triple Riding', color: '#F87171', icon: 'people' },
//   wrongway: { label: 'Wrong Way', color: '#3B82F6', icon: 'location-off' },
//   fire: { label: 'Fire', color: '#EF4444', icon: 'whatshot' },
//   noPlate: { label: 'No Plate', color: '#F59E0B', icon: 'confirmation-number' },
//   smoking: { label: 'Smoking', color: '#6B7280', icon: 'smoking-rooms' },
//   stuntRiding: { label: 'Stunt Riding', color: '#8B5CF6', icon: 'two-wheeler' },
//   triples: { label: 'Triples', color: '#EC4899', icon: 'groups' },
//   withHelmet: { label: 'With Helmet', color: '#10B981', icon: 'security' },
//   withoutHelmet: { label: 'Without Helmet', color: '#EF4444', icon: 'report' },
// };

// const VerifiedScreens = ({ navigation }) => {
//   const [verifiedData, setVerifiedData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [exporting, setExporting] = useState(false);
//   const fadeAnim = useState(new Animated.Value(0))[0];
//   const scaleAnim = useState(new Animated.Value(0.8))[0];
//   const slideAnim = useRef(new Animated.Value(height)).current;

//   const fetchVerified = async () => {
//     try {
//       const res = await api.get('/api/violations');
//       const filtered = res.data.filter((v) => v.verified === true);
//       setVerifiedData(filtered);
//     } catch (err) {
//       console.error('Fetch verified error:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       slideAnim.setValue(height);
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 400,
//         easing: Easing.out(Easing.cubic),
//         useNativeDriver: true,
//       }).start();
//     });

//     fetchVerified();

//     return () => {
//       unsubscribe();
//       slideAnim.setValue(height);
//     };
//   }, [navigation]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchVerified();
//   };

//   const handleBack = () => {
//     Animated.timing(slideAnim, {
//       toValue: height,
//       duration: 350,
//       easing: Easing.in(Easing.ease),
//       useNativeDriver: true,
//     }).start(() => navigation.goBack());
//   };

//   const openModal = (item) => {
//     setSelectedItem(item);
//     setModalVisible(true);
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 200,
//         easing: Easing.out(Easing.ease),
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 5,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   const closeModal = () => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 150,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 0.8,
//         duration: 150,
//         useNativeDriver: true,
//       }),
//     ]).start(() => setModalVisible(false));
//   };

//   const renderViolationBadge = (type, count) => {
//     if (count <= 0) return null;
//     const config = VIOLATION_TYPES[type];
//     return (
//       <View style={[styles.badge, { backgroundColor: config.color }]} key={type}>
//         <MaterialIcons name={config.icon} size={14} color="white" />
//         <Text style={styles.badgeText}>{config.label}</Text>
//       </View>
//     );
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity style={styles.card} onPress={() => openModal(item)} activeOpacity={0.8}>
//       <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
//       {item.plateImageUrl && <Image source={{ uri: item.plateImageUrl }} style={styles.plateImage} resizeMode="contain" />}
//       <View style={styles.cardFooter}>
//         <View style={styles.badgeContainer}>
//           {Object.entries(VIOLATION_TYPES).map(([key]) => renderViolationBadge(key, item[key]))}
//         </View>
//       </View>
//       <View style={styles.verifiedTag}>
//         <MaterialIcons name="verified" size={16} color="#4CAF50" />
//         <Text style={styles.verifiedText}>Verified</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   const generateCSVContent = () => {
//     let csv = 'ID,Date,Time,Location,' + Object.keys(VIOLATION_TYPES).map(k => VIOLATION_TYPES[k].label).join(',') + ',Image URL\n';
//     verifiedData.forEach(item => {
//       const date = new Date(item.analyzedAt).toLocaleDateString();
//       const time = new Date(item.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//       const violations = Object.keys(VIOLATION_TYPES).map(k => item[k] || 0).join(',');
//       csv += `"${item._id}","${date}","${time}","${item.location || 'N/A'}",${violations},"${item.imageUrl}"\n`;
//     });
//     return csv;
//   };

//   const handleExport = async () => {
//     if (verifiedData.length === 0) {
//       Alert.alert('No Data', 'There are no verified violations to export.');
//       return;
//     }

//     setExporting(true);

//     try {
//       const csvContent = generateCSVContent();
//       const filename = `TraffiScan_Export_${new Date().toISOString().split('T')[0]}.csv`;
//       const fileUri = FileSystem.cacheDirectory + filename;

//       await FileSystem.writeAsStringAsync(fileUri, csvContent, {
//         encoding: FileSystem.EncodingType.UTF8,
//       });

//       if (!(await Sharing.isAvailableAsync())) {
//         Alert.alert('Sharing not available', 'Your device does not support sharing files.');
//         return;
//       }

//       await Sharing.shareAsync(fileUri, {
//         mimeType: 'text/csv',
//         dialogTitle: 'Export Verified Violations',
//         UTI: 'public.comma-separated-values-text',
//       });

//     } catch (error) {
//       console.error('Export failed:', error);
//       Alert.alert('Export Failed', 'Unable to export data. Please try again.');
//     } finally {
//       setExporting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#1976D2" />
//         <Text style={styles.loadingText}>Loading verified cases...</Text>
//       </View>
//     );
//   }

//   return (
//     <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
//       <View style={styles.topBar}>
//         <Text style={styles.appName}>Verified Violations</Text>
//       </View>

//       <View style={styles.header}>
//         <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//           <MaterialIcons name="arrow-back" size={24} color="#1976D2" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Verified ({verifiedData.length})</Text>
//         <TouchableOpacity
//           style={[styles.exportButton, exporting && styles.exportButtonDisabled]}
//           onPress={handleExport}
//           disabled={exporting}
//         >
//           <MaterialIcons name="file-download" size={20} color="white" />
//           <Text style={styles.exportButtonText}>Export</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={verifiedData}
//         renderItem={renderItem}
//         keyExtractor={(item) => item._id}
//         numColumns={2}
//         columnWrapperStyle={styles.columnWrapper}
//         contentContainerStyle={styles.listContent}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1976D2" />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyTitle}>No verified cases</Text>
//             <Text style={styles.emptySubtitle}>Please verify cases from main screen.</Text>
//           </View>
//         }
//       />

//       <Modal visible={modalVisible} transparent animationType="fade">
//         <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
//           <Animated.View style={[styles.modalContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
//             {selectedItem && (
//               <>
//                 <Image source={{ uri: selectedItem.imageUrl }} style={styles.modalImage} resizeMode="contain" />
//                 <View style={styles.modalDetails}>
//                   <Text>ID: {String(selectedItem._id)}</Text>
//                   <Text>Date: {new Date(selectedItem.analyzedAt).toLocaleString()}</Text>
//                 </View>
//               </>
//             )}
//           </Animated.View>
//         </TouchableOpacity>
//       </Modal>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'white' },
//   topBar: { padding: 20, backgroundColor: '#0A2342' },
//   appName: { fontSize: 20, color: 'white', fontWeight: 'bold', textAlign: 'center' },
//   header: { flexDirection: 'row', alignItems: 'center', padding: 10 },
//   backButton: { paddingRight: 10 },
//   headerTitle: { flex: 1, fontSize: 20, fontWeight: 'bold' },
//   exportButton: { backgroundColor: '#1976D2', padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center' },
//   exportButtonDisabled: { backgroundColor: '#90CAF9' },
//   exportButtonText: { color: 'white', marginLeft: 5 },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
//   loadingText: { marginTop: 10, color: '#555' },
//   listContent: { padding: 10 },
//   columnWrapper: { justifyContent: 'space-between' },
//   card: { backgroundColor: '#E0F2F1', borderRadius: 8, overflow: 'hidden', marginBottom: 10, width: CARD_WIDTH },
//   image: { width: '100%', height: CARD_WIDTH * 0.75 },
//   plateImage: { width: '100%', height: 40, backgroundColor: '#ddd' },
//   cardFooter: { padding: 8 },
//   badgeContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
//   badge: { flexDirection: 'row', alignItems: 'center', padding: 4, borderRadius: 4, margin: 2 },
//   badgeText: { color: 'white', marginLeft: 4, fontSize: 10 },
//   verifiedTag: { position: 'absolute', top: 8, right: 8, backgroundColor: 'white', padding: 4, borderRadius: 4, flexDirection: 'row', alignItems: 'center' },
//   verifiedText: { marginLeft: 4, fontWeight: 'bold', fontSize: 10 },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
//   modalContent: { width: '90%', backgroundColor: 'white', borderRadius: 10, padding: 10 },
//   modalImage: { width: '100%', height: height * 0.4, marginBottom: 10 },
//   modalDetails: { marginVertical: 10 },
//   emptyContainer: { justifyContent: 'center', alignItems: 'center', padding: 40 },
//   emptyTitle: { fontSize: 18, fontWeight: 'bold' },
//   emptySubtitle: { fontSize: 14, color: '#777', textAlign: 'center' },
// });

// export default VerifiedScreens;










// // VerifiedScreens.js
// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   Dimensions,
//   TouchableOpacity,
//   RefreshControl,
//   Modal,
//   Animated,
//   Easing,
//   Alert,
// } from 'react-native';
// import axios from 'axios';
// import { MaterialIcons } from '@expo/vector-icons';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';

// const { width, height } = Dimensions.get('window');
// const CARD_WIDTH = (width - 40) / 2;

// const api = axios.create({
//   // baseURL: 'http://192.168.42.158:5000',
//     baseURL: 'http://192.168.42.158:5000',

// });

// const VIOLATION_TYPES = {
//   noHelmet: { label: 'No Helmet', color: '#34D399', icon: 'motorcycle' },
//   phoneUsage: { label: 'Phone Usage', color: '#9CA3AF', icon: 'smartphone' },
//   tripling: { label: 'Triple Riding', color: '#F87171', icon: 'people' },
//   wrongway: { label: 'Wrong Way', color: '#3B82F6', icon: 'location-off' },
//   fire: { label: 'Fire', color: '#EF4444', icon: 'whatshot' },
//   noPlate: { label: 'No Plate', color: '#F59E0B', icon: 'confirmation-number' },
//   smoking: { label: 'Smoking', color: '#6B7280', icon: 'smoking-rooms' },
//   stuntRiding: { label: 'Stunt Riding', color: '#8B5CF6', icon: 'two-wheeler' },
//   triples: { label: 'Triples', color: '#EC4899', icon: 'groups' },
//   withHelmet: { label: 'With Helmet', color: '#10B981', icon: 'security' },
//   withoutHelmet: { label: 'Without Helmet', color: '#EF4444', icon: 'report' },
// };

// const VerifiedScreens = ({ navigation }) => {
//   const [verifiedData, setVerifiedData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [exporting, setExporting] = useState(false);
//   const fadeAnim = useState(new Animated.Value(0))[0];
//   const scaleAnim = useState(new Animated.Value(0.8))[0];
//   const slideAnim = useRef(new Animated.Value(height)).current;

//   const fetchVerified = async () => {
//     try {
//       const res = await api.get('/api/violations/all');
//       const filtered = res.data.filter((v) => v.verified === true);
//       setVerifiedData(filtered);
//     } catch (err) {
//       console.error('Fetch verified error:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       slideAnim.setValue(height);
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 400,
//         easing: Easing.out(Easing.cubic),
//         useNativeDriver: true,
//       }).start();
//     });

//     fetchVerified();

//     return () => {
//       unsubscribe();
//       slideAnim.setValue(height);
//     };
//   }, [navigation]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchVerified();
//   };

//   const handleBack = () => {
//     Animated.timing(slideAnim, {
//       toValue: height,
//       duration: 350,
//       easing: Easing.in(Easing.ease),
//       useNativeDriver: true,
//     }).start(() => navigation.goBack());
//   };

//   const openModal = (item) => {
//     setSelectedItem(item);
//     setModalVisible(true);
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 200,
//         easing: Easing.out(Easing.ease),
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 5,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   const closeModal = () => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 150,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 0.8,
//         duration: 150,
//         useNativeDriver: true,
//       }),
//     ]).start(() => setModalVisible(false));
//   };

//   const renderViolationBadge = (type, count) => {
//     if (count <= 0) return null;
//     const config = VIOLATION_TYPES[type];
//     return (
//       <View style={[styles.badge, { backgroundColor: config.color }]} key={type}>
//         <MaterialIcons name={config.icon} size={14} color="white" />
//         <Text style={styles.badgeText}>{config.label}</Text>
//       </View>
//     );
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity style={styles.card} onPress={() => openModal(item)} activeOpacity={0.8}>
//       <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
//       {item.plateImageUrl && <Image source={{ uri: item.plateImageUrl }} style={styles.plateImage} resizeMode="contain" />}
//       <View style={styles.cardFooter}>
//         <View style={styles.badgeContainer}>
//           {Object.entries(VIOLATION_TYPES).map(([key]) => renderViolationBadge(key, item[key]))}
//         </View>
//       </View>
//       <View style={styles.verifiedTag}>
//         <MaterialIcons name="verified" size={16} color="#4CAF50" />
//         <Text style={styles.verifiedText}>Verified</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   const generateCSVContent = () => {
//     let csv = 'ID,Date,Time,Location,' + Object.keys(VIOLATION_TYPES).map(k => VIOLATION_TYPES[k].label).join(',') + ',Image URL\n';
//     verifiedData.forEach(item => {
//       const date = new Date(item.analyzedAt).toLocaleDateString();
//       const time = new Date(item.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//       const violations = Object.keys(VIOLATION_TYPES).map(k => item[k] || 0).join(',');
//       csv += `"${item._id}","${date}","${time}","${item.location || 'N/A'}",${violations},"${item.imageUrl}"\n`;
//     });
//     return csv;
//   };

//   const handleExport = async () => {
//     if (verifiedData.length === 0) {
//       Alert.alert('No Data', 'There are no verified violations to export.');
//       return;
//     }

//     setExporting(true);

//     try {
//       const csvContent = generateCSVContent();
//       const filename = `TraffiScan_Export_${new Date().toISOString().split('T')[0]}.csv`;
//       const fileUri = FileSystem.cacheDirectory + filename;

//       await FileSystem.writeAsStringAsync(fileUri, csvContent, {
//         encoding: FileSystem.EncodingType.UTF8,
//       });

//       if (!(await Sharing.isAvailableAsync())) {
//         Alert.alert('Sharing not available', 'Your device does not support sharing files.');
//         return;
//       }

//       await Sharing.shareAsync(fileUri, {
//         mimeType: 'text/csv',
//         dialogTitle: 'Export Verified Violations',
//         UTI: 'public.comma-separated-values-text',
//       });

//     } catch (error) {
//       console.error('Export failed:', error);
//       Alert.alert('Export Failed', 'Unable to export data. Please try again.');
//     } finally {
//       setExporting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#1976D2" />
//         <Text style={styles.loadingText}>Loading verified cases...</Text>
//       </View>
//     );
//   }

//   return (
//     <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
//       <View style={styles.topBar}>
//         <Text style={styles.appName}>Verified Violations</Text>
//       </View>

//       <View style={styles.header}>
//         <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//           <MaterialIcons name="arrow-back" size={24} color="#1976D2" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Verified ({verifiedData.length})</Text>
//         <TouchableOpacity
//           style={[styles.exportButton, exporting && styles.exportButtonDisabled]}
//           onPress={handleExport}
//           disabled={exporting}
//         >
//           <MaterialIcons name="file-download" size={20} color="white" />
//           <Text style={styles.exportButtonText}>Export</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={verifiedData}
//         renderItem={renderItem}
//         keyExtractor={(item) => item._id}
//         numColumns={2}
//         columnWrapperStyle={styles.columnWrapper}
//         contentContainerStyle={styles.listContent}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1976D2" />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyTitle}>No verified cases</Text>
//             <Text style={styles.emptySubtitle}>Please verify cases from main screen.</Text>
//           </View>
//         }
//       />

//       <Modal visible={modalVisible} transparent animationType="fade">
//         <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
//           <Animated.View style={[styles.modalContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
//             {selectedItem && (
//               <>
//                 <Image source={{ uri: selectedItem.imageUrl }} style={styles.modalImage} resizeMode="contain" />
//                 <View style={styles.modalDetails}>
//                   <Text>ID: {String(selectedItem._id)}</Text>
//                   <Text>Date: {new Date(selectedItem.analyzedAt).toLocaleString()}</Text>
//                 </View>
//               </>
//             )}
//           </Animated.View>
//         </TouchableOpacity>
//       </Modal>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'white' },
//   topBar: { padding: 20, backgroundColor: '#0A2342' },
//   appName: { fontSize: 20, color: 'white', fontWeight: 'bold', textAlign: 'center' },
//   header: { flexDirection: 'row', alignItems: 'center', padding: 10 },
//   backButton: { paddingRight: 10 },
//   headerTitle: { flex: 1, fontSize: 20, fontWeight: 'bold' },
//   exportButton: { backgroundColor: '#1976D2', padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center' },
//   exportButtonDisabled: { backgroundColor: '#90CAF9' },
//   exportButtonText: { color: 'white', marginLeft: 5 },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
//   loadingText: { marginTop: 10, color: '#555' },
//   listContent: { padding: 10 },
//   columnWrapper: { justifyContent: 'space-between' },
//   card: { backgroundColor: '#E0F2F1', borderRadius: 8, overflow: 'hidden', marginBottom: 10, width: CARD_WIDTH },
//   image: { width: '100%', height: CARD_WIDTH * 0.75 },
//   plateImage: { width: '100%', height: 40, backgroundColor: '#ddd' },
//   cardFooter: { padding: 8 },
//   badgeContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
//   badge: { flexDirection: 'row', alignItems: 'center', padding: 4, borderRadius: 4, margin: 2 },
//   badgeText: { color: 'white', marginLeft: 4, fontSize: 10 },
//   verifiedTag: { position: 'absolute', top: 8, right: 8, backgroundColor: 'white', padding: 4, borderRadius: 4, flexDirection: 'row', alignItems: 'center' },
//   verifiedText: { marginLeft: 4, fontWeight: 'bold', fontSize: 10 },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
//   modalContent: { width: '90%', backgroundColor: 'white', borderRadius: 10, padding: 10 },
//   modalImage: { width: '100%', height: height * 0.4, marginBottom: 10 },
//   modalDetails: { marginVertical: 10 },
//   emptyContainer: { justifyContent: 'center', alignItems: 'center', padding: 40 },
//   emptyTitle: { fontSize: 18, fontWeight: 'bold' },
//   emptySubtitle: { fontSize: 14, color: '#777', textAlign: 'center' },
// });

// export default VerifiedScreens;







// VerifiedScreens.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2;

const api = axios.create({
  // baseURL: 'http://192.168.42.158:5000',
    baseURL: 'http://192.168.42.158:5000',

});

const VIOLATION_TYPES = {
  noHelmet: { label: 'No Helmet', color: '#34D399', icon: 'motorcycle' },
  phoneUsage: { label: 'Phone Usage', color: '#9CA3AF', icon: 'smartphone' },
  tripling: { label: 'Triple Riding', color: '#F87171', icon: 'people' },
  wrongway: { label: 'Wrong Way', color: '#3B82F6', icon: 'location-off' },
  fire: { label: 'Fire', color: '#EF4444', icon: 'whatshot' },
  noPlate: { label: 'No Plate', color: '#F59E0B', icon: 'confirmation-number' },
  smoking: { label: 'Smoking', color: '#6B7280', icon: 'smoking-rooms' },
  stuntRiding: { label: 'Stunt Riding', color: '#8B5CF6', icon: 'two-wheeler' },
  triples: { label: 'Triples', color: '#EC4899', icon: 'groups' },
  withHelmet: { label: 'With Helmet', color: '#10B981', icon: 'security' },
  withoutHelmet: { label: 'Without Helmet', color: '#EF4444', icon: 'report' },
};

const VerifiedScreens = ({ navigation }) => {
  const [verifiedData, setVerifiedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [exporting, setExporting] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const slideAnim = useRef(new Animated.Value(height)).current;

  const fetchVerified = async () => {
    try {
      const res = await api.get('/api/violations/all');
      const filtered = res.data.filter((v) => v.verified === true);
      setVerifiedData(filtered);
    } catch (err) {
      console.error('Fetch verified error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      slideAnim.setValue(height);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });

    fetchVerified();

    return () => {
      unsubscribe();
      slideAnim.setValue(height);
    };
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVerified();
  };

  const handleBack = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 350,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => navigation.goBack());
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false));
  };

  const renderViolationBadge = (type, count) => {
    if (count <= 0) return null;
    const config = VIOLATION_TYPES[type];
    return (
      <View style={[styles.badge, { backgroundColor: config.color }]} key={type}>
        <MaterialIcons name={config.icon} size={14} color="white" />
        <Text style={styles.badgeText}>{config.label}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)} activeOpacity={0.8}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
      {item.plateImageUrl && <Image source={{ uri: item.plateImageUrl }} style={styles.plateImage} resizeMode="contain" />}
      <View style={styles.cardFooter}>
        <View style={styles.badgeContainer}>
          {Object.entries(VIOLATION_TYPES).map(([key]) => renderViolationBadge(key, item[key]))}
        </View>
      </View>
      <View style={styles.verifiedTag}>
        <MaterialIcons name="verified" size={16} color="#4CAF50" />
        <Text style={styles.verifiedText}>Verified</Text>
      </View>
    </TouchableOpacity>
  );

  const generateCSVContent = () => {
    let csv = 'ID,Date,Time,Location,' + Object.keys(VIOLATION_TYPES).map(k => VIOLATION_TYPES[k].label).join(',') + ',Image URL\n';
    verifiedData.forEach(item => {
      const date = new Date(item.analyzedAt).toLocaleDateString();
      const time = new Date(item.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const violations = Object.keys(VIOLATION_TYPES).map(k => item[k] || 0).join(',');
      csv += `"${item._id}","${date}","${time}","${item.location || 'N/A'}",${violations},"${item.imageUrl}"\n`;
    });
    return csv;
  };

  const handleExport = async () => {
    if (verifiedData.length === 0) {
      Alert.alert('No Data', 'There are no verified violations to export.');
      return;
    }

    setExporting(true);

    try {
      const csvContent = generateCSVContent();
      const filename = `TraffiScan_Export_${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = FileSystem.cacheDirectory + filename;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Sharing not available', 'Your device does not support sharing files.');
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Verified Violations',
        UTI: 'public.comma-separated-values-text',
      });

    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert('Export Failed', 'Unable to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading verified cases...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.topBar}>
        <Text style={styles.appName}>Verified Violations</Text>
      </View>

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1976D2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verified ({verifiedData.length})</Text>
        <TouchableOpacity
          style={[styles.exportButton, exporting && styles.exportButtonDisabled]}
          onPress={handleExport}
          disabled={exporting}
        >
          <MaterialIcons name="file-download" size={20} color="white" />
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={verifiedData}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1976D2" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No verified cases</Text>
            <Text style={styles.emptySubtitle}>Please verify cases from main screen.</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            {selectedItem && (
              <>
                <Image source={{ uri: selectedItem.imageUrl }} style={styles.modalImage} resizeMode="contain" />
                <View style={styles.modalDetails}>
                  <Text>ID: {String(selectedItem._id)}</Text>
                  <Text>Date: {new Date(selectedItem.analyzedAt).toLocaleString()}</Text>
                </View>
              </>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D1D5DB' },
  topBar: { padding: 20, backgroundColor: '#0A2342' },
  appName: { fontSize: 20, color: 'white', fontWeight: 'bold', textAlign: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  backButton: { paddingRight: 10 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: 'bold' },
  exportButton: { backgroundColor: '#1976D2', padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center' },
  exportButtonDisabled: { backgroundColor: '#90CAF9' },
  exportButtonText: { color: 'white', marginLeft: 5 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  loadingText: { marginTop: 10, color: '#555' },
  listContent: { padding: 10 },
  columnWrapper: { justifyContent: 'space-between' },
  card: { backgroundColor: '#E0F2F1', borderRadius: 8, overflow: 'hidden', marginBottom: 10, width: CARD_WIDTH },
  image: { width: '100%', height: CARD_WIDTH * 0.75 },
  plateImage: { width: '100%', height: 40, backgroundColor: '#ddd' },
  cardFooter: { padding: 8 },
  badgeContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', padding: 4, borderRadius: 4, margin: 2 },
  badgeText: { color: 'white', marginLeft: 4, fontSize: 10 },
  verifiedTag: { position: 'absolute', top: 8, right: 8, backgroundColor: 'white', padding: 4, borderRadius: 4, flexDirection: 'row', alignItems: 'center' },
  verifiedText: { marginLeft: 4, fontWeight: 'bold', fontSize: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: 'white', borderRadius: 10, padding: 10 },
  modalImage: { width: '100%', height: height * 0.4, marginBottom: 10 },
  modalDetails: { marginVertical: 10 },
  emptyContainer: { justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold' },
  emptySubtitle: { fontSize: 14, color: '#777', textAlign: 'center' },
});

export default VerifiedScreens;

