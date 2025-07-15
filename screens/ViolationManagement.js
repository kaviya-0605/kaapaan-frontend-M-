

// // ViolationManagement.js
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   Alert,
//   RefreshControl,
//   Dimensions,
//   Animated,
// } from 'react-native';
// import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';
// import { MaterialIcons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');
// const CARD_WIDTH = (width - 48) / 2;

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


// const ViolationManagement = () => {
//   const [violations, setViolations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedViolations, setSelectedViolations] = useState([]);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const navigation = useNavigation();
//   const animationRefs = useRef({});

//   const formatDateTime = (isoString) => {
//     if (!isoString) return 'N/A';
//     const date = new Date(isoString);
//     return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//     })}`;
//   };

//   const fetchViolations = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get('/api/violations/all');
//       const processed = response.data.map((v) => ({
//         ...v,
//         formattedTime: formatDateTime(v.analyzedAt),
//         hasViolations: Object.keys(VIOLATION_TYPES).some((k) => v[k] > 0),
//       }));
//       setViolations(processed.filter((v) => !v.verified && v.hasViolations));
//     } catch (error) {
//       console.error('Fetch violations error:', error);
//       Alert.alert('Error', 'Failed to fetch violations');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchViolations();
//   }, []);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await fetchViolations();
//     setRefreshing(false);
//   }, []);

//   const toggleSelection = (id) => {
//     setSelectedViolations((prev) =>
//       prev.includes(id) ? prev.filter((vId) => vId !== id) : [...prev, id]
//     );
//   };

//   const handleVerifySelected = async () => {
//     if (selectedViolations.length === 0) return;
//     setIsVerifying(true);

//     const animations = selectedViolations.map((id) => {
//       const anim = animationRefs.current[id];
//       return Animated.parallel([
//         Animated.timing(anim.opacity, {
//           toValue: 0,
//           duration: 500,
//           useNativeDriver: true,
//         }),
//         Animated.timing(anim.scale, {
//           toValue: 0,
//           duration: 500,
//           useNativeDriver: true,
//         }),
//       ]);
//     });

//     try {
//       await Promise.all(animations.map((anim) => anim.start()));
//       await api.patch('/api/violations/verify-multiple', {
//         ids: selectedViolations,
//       });
//       await fetchViolations();
//       setSelectedViolations([]);
//       Alert.alert('Success', 'Selected violations verified successfully');
//     } catch (error) {
//       console.error('Verify selected error:', error);
//       Alert.alert('Error', 'Failed to verify selected violations');
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const renderViolationTag = (type, count) => {
//     if (count <= 0) return null;
//     const config = VIOLATION_TYPES[type];
//     return (
//       <View style={[styles.tag, { backgroundColor: config.color }]} key={type}>
//         <MaterialIcons name={config.icon} size={14} color="black" />
//         <Text style={styles.tagText}>{config.label}</Text>
//       </View>
//     );
//   };

//   const renderItem = ({ item }) => {
//     if (!animationRefs.current[item._id]) {
//       animationRefs.current[item._id] = {
//         opacity: new Animated.Value(1),
//         scale: new Animated.Value(1),
//       };
//     }

//     return (
//       <Animated.View
//         style={{
//           opacity: animationRefs.current[item._id].opacity,
//           transform: [{ scale: animationRefs.current[item._id].scale }],
//         }}
//       >
//         <TouchableOpacity
//           style={[styles.card, selectedViolations.includes(item._id) && styles.selectedCard]}
//           onPress={() => toggleSelection(item._id)}
//           activeOpacity={0.8}
//         >
//           <View style={styles.cardHeader}>
//             <Text style={styles.plateText}></Text>
//             <View style={styles.badge}>
//               <Text style={styles.badgeText}>{item.verified ? 'VERIFIED' : 'PENDING'}</Text>
//             </View>
//           </View>

//           <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />

//           {item.plateImageUrl && (
//             <Image source={{ uri: item.plateImageUrl }} style={styles.plateImage} resizeMode="contain" />
//           )}

//           <View style={styles.violationTags}>
//             {Object.entries(VIOLATION_TYPES).map(([key]) =>
//               renderViolationTag(key, item[key])
//             )}
//           </View>

//           <View style={styles.timeContainer}>
//             <MaterialIcons name="access-time" size={14} color="#555" />
//             <Text style={styles.timeText}>{item.formattedTime}</Text>
//           </View>

//           {selectedViolations.includes(item._id) && (
//             <View style={styles.checkmark}>
//               <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
//             </View>
//           )}
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#1976D2" />
//         <Text style={styles.loadingText}>Loading violations...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.topbar}>
//         <Text style={styles.appName}>TRAFFICSCAN</Text>
//         <TouchableOpacity
//           style={styles.verifiedButton}
//           onPress={() => navigation.navigate('VerifiedScreens')}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.verifiedButtonText}>Verified Cases</Text>
//           <MaterialIcons name="verified-user" size={20} color="#1976D2" />
//         </TouchableOpacity>
//       </View>

//       {/* <View style={styles.header}>
//         <View style={styles.headerRow}>
//           <Text style={styles.headerTitle}>Violation Management</Text>
//           <TouchableOpacity
//             style={styles.statsButton}
//             onPress={() => navigation.navigate('Statistics')}
//             activeOpacity={0.7}
//           >
//             <MaterialIcons name="bar-chart" size={20} color="#1976D2" />
//             <Text style={styles.statsButtonText}>Statistics</Text>
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.headerSubtitle}>{violations.length} pending violations</Text>
//       </View> */}

      
// <View style={styles.header}>
//   <View style={styles.headerRow}>
//     <Text style={styles.headerTitle}>Violation Management</Text>
//     <TouchableOpacity
//       style={styles.statsButton}
//       onPress={() => navigation.navigate('Statistics')}
//       activeOpacity={0.7}
//     >
//       <MaterialIcons name="bar-chart" size={20} color="#1976D2" />
//       <Text style={styles.statsButtonText}>Statistics</Text>
//     </TouchableOpacity>
//   </View>
//   <Text style={styles.headerSubtitle}>{violations.length} pending violations</Text>
// </View>

//       <FlatList
//         data={violations}
//         renderItem={renderItem}
//         keyExtractor={(item) => item._id}
//         numColumns={2}
//         contentContainerStyle={styles.listContent}
//         columnWrapperStyle={styles.columnWrapper}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1976D2" />}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <MaterialIcons name="check-circle" size={48} color="#4CAF50" />
//             <Text style={styles.emptyText}>No violations found</Text>
//             <Text style={styles.emptySubtext}>All cases are handled</Text>
//           </View>
//         }
//       />

//       {selectedViolations.length > 0 && (
//         <View style={styles.footer}>
//           <TouchableOpacity
//             style={[styles.verifyButton, isVerifying && { backgroundColor: '#388E3C' }]}
//             onPress={handleVerifySelected}
//             disabled={isVerifying}
//             activeOpacity={0.7}
//           >
//             {isVerifying ? (
//               <ActivityIndicator color="white" />
//             ) : (
//               <>
//                 <MaterialIcons name="verified-user" size={20} color="white" />
//                 <Text style={styles.verifyButtonText}>
//                   Verify {selectedViolations.length} violation(s)
//                 </Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '	#9e9e9e',
//   },
//   topbar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 30,
//     backgroundColor: '#0A2342',
//     borderBottomWidth: 1,
//     borderBottomColor: 'white',
//   },
//   appName: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     letterSpacing: 1.5,
//     textShadowColor: 'rgba(25, 118, 210, 0.5)',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//   },
//   verifiedButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(32, 122, 211, 0.1)',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#1976D2',
//   },
//   verifiedButtonText: {
//     color: 'white',
//     fontWeight: '600',
//     marginRight: 4,
//     fontSize: 14,
//   },
//   header: {
//     padding: 16,
//     backgroundColor: '#B0C4DE',
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   headerTitle: { 
//     fontSize: 20, 
//     fontWeight: '600', 
//     color: 'black' 
//   },
//   statsButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(42, 48, 50, 0)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   statsButtonText: {
//     color: 'black',
//     fontWeight: '600',
//     marginLeft: 4,
//     fontSize: 14,
//   },
//   headerSubtitle: { 
//     fontSize: 14, 
//     color: 'gray' 
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#0A2342',
//   },
//   loadingText: { 
//     marginTop: 16, 
//     color: '#E0E0E0', 
//     fontSize: 16 
//   },
//   listContent: { 
//     paddingHorizontal: 16, 
//     paddingBottom: 100 
//   },
//   columnWrapper: { 
//     justifyContent: 'space-between' 
//   },
//   card: {
//     width: CARD_WIDTH,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 10,
//     marginBottom: 16,
//     overflow: 'hidden',
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   selectedCard: {
//     borderColor: '#4CAF50',
//     borderWidth: 2,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 8,
//     backgroundColor: '#f5f5f5',
//   },
//   plateText: { 
//     fontWeight: 'bold', 
//     fontSize: 14, 
//     color: 'black' 
//   },
//   badge: {
//     backgroundColor: '#DC143C',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   badgeText: { 
//     color: 'white', 
//     fontSize: 10, 
//     fontWeight: 'bold' 
//   },
//   image: {
//     width: '100%',
//     height: CARD_WIDTH * 0.75,
//     backgroundColor: '#eee',
//   },
//   plateImage: {
//     width: '100%',
//     height: 40,
//     backgroundColor: '#ddd',
//     borderTopWidth: 1,
//     borderColor: '#ccc',
//   },
//   violationTags: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     padding: 8,
//     paddingBottom: 4,
//   },
//   tag: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 6,
//     paddingVertical: 3,
//     borderRadius: 4,
//     marginRight: 4,
//     marginBottom: 4,
//   },
//   tagText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: '600',
//     marginLeft: 2,
//   },
//   timeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 8,
//     paddingTop: 0,
//   },
//   timeText: { 
//     fontSize: 11, 
//     color: '#555', 
//     marginLeft: 4 
//   },
//   checkmark: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: 'rgba(255,255,255,0.8)',
//     borderRadius: 12,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 32,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#E0E0E0',
//     marginTop: 16,
//     textAlign: 'center',
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#9E9E9E',
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 16,
//     left: 16,
//     right: 16,
//   },
//   verifyButton: {
//     flexDirection: 'row',
//     backgroundColor: '#4CAF50',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 4,
//   },
//   verifyButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     marginLeft: 8,
//     fontSize: 16,
//   },
// });

// export default ViolationManagement;






import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  RefreshControl,
  Dimensions,
  Animated,
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const api = axios.create({
  baseURL: 'http://192.168.83.240:5000',
});

const VIOLATION_TYPES = {
  noHelmet: { label: 'No Helmet', color: '#34D399', icon: 'motorcycle' },
  phoneUsage: { label: 'Phone Usage', color: 'rgb(22, 135, 143)', icon: 'smartphone' },
  tripling: { label: 'Triple Riding', color: '#F87171', icon: 'people' },
  wrongway: { label: 'Wrong Way', color: '#3B82F6', icon: 'location-off' },
  fire: { label: 'Fire', color: 'rgb(206, 111, 9)', icon: 'whatshot' },
  noPlate: { label: 'No Plate', color: '#F59E0B', icon: 'confirmation-number' },
  smoking: { label: 'Smoking', color: 'rgb(11, 98, 127)', icon: 'smoking-rooms' },
  stuntRiding: { label: 'Stunt Riding', color: 'rgb(174, 39, 212)', icon: 'two-wheeler' },
  triples: { label: 'Triples', color: 'rgb(214, 100, 178)', icon: 'groups' },
  withHelmet: { label: 'With Helmet', color: 'rgb(19, 40, 158)', icon: 'security' },
  withoutHelmet: { label: 'Without Helmet', color: '#4169E1', icon: 'report' },
};

const ViolationManagement = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const policeId = route.params?.policeId || 'Unknown'; // <== RECEIVED from login

  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedViolations, setSelectedViolations] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const animationRefs = useRef({});

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/violations/all');
      const processed = response.data.map((v) => ({
        ...v,
        formattedTime: formatDateTime(v.analyzedAt),
        hasViolations: Object.keys(VIOLATION_TYPES).some((k) => v[k] > 0),
      }));
      setViolations(processed.filter((v) => !v.verified && v.hasViolations));
    } catch (error) {
      console.error('Fetch violations error:', error);
      Alert.alert('Error', 'Failed to fetch violations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchViolations();
    setRefreshing(false);
  }, []);

  const toggleSelection = (id) => {
    setSelectedViolations((prev) =>
      prev.includes(id) ? prev.filter((vId) => vId !== id) : [...prev, id]
    );
  };

  const handleVerifySelected = async () => {
    if (selectedViolations.length === 0) return;

    // ✅ Alert if policeId is missing
    if (!policeId || policeId === 'Unknown') {
      Alert.alert('Missing Officer ID', 'Police ID is not available. Please log in again.');
      setIsVerifying(false);
      return;
    }

    setIsVerifying(true);

    const animations = selectedViolations.map((id) => {
      const anim = animationRefs.current[id];
      return Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(anim.scale, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]);
    });

    try {
      await Promise.all(animations.map((anim) => anim.start()));
      await api.patch('/api/violations/verify-multiple', {
        ids: selectedViolations,
        verifiedBy: policeId,
      });

      await fetchViolations();
      setSelectedViolations([]);
      Alert.alert('Success', `Verified by Officer ${policeId}`);
    } catch (error) {
      console.error('Verify selected error:', error);
      Alert.alert('Error', 'Failed to verify selected violations');
    } finally {
      setIsVerifying(false);
    }
  };

  const renderViolationTag = (type, count) => {
    if (count <= 0) return null;
    const config = VIOLATION_TYPES[type];
    return (
      <View style={[styles.tag, { backgroundColor: config.color }]} key={type}>
        <MaterialIcons name={config.icon} size={14} color="black" />
        <Text style={styles.tagText}>{config.label}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    if (!animationRefs.current[item._id]) {
      animationRefs.current[item._id] = {
        opacity: new Animated.Value(1),
        scale: new Animated.Value(1),
      };
    }

    return (
      <Animated.View
        style={{
          opacity: animationRefs.current[item._id].opacity,
          transform: [{ scale: animationRefs.current[item._id].scale }],
        }}
      >
        <TouchableOpacity
          style={[styles.card, selectedViolations.includes(item._id) && styles.selectedCard]}
          onPress={() => toggleSelection(item._id)}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.plateText}></Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.verified ? 'VERIFIED' : 'PENDING'}</Text>
            </View>
          </View>

          <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />

          {item.plateImageUrl && (
            <Image source={{ uri: item.plateImageUrl }} style={styles.plateImage} resizeMode="contain" />
          )}

          <View style={styles.violationTags}>
            {Object.entries(VIOLATION_TYPES).map(([key]) =>
              renderViolationTag(key, item[key])
            )}
          </View>

          <View style={styles.timeContainer}>
            <MaterialIcons name="access-time" size={14} color="#555" />
            <Text style={styles.timeText}>{item.formattedTime}</Text>
          </View>

          {selectedViolations.includes(item._id) && (
            <View style={styles.checkmark}>
              <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading violations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Topbar and header */}
      <View style={styles.topbar}>
        <Text style={styles.appName}>TRAFFICSCAN</Text>
        <TouchableOpacity
          style={styles.verifiedButton}
          onPress={() => navigation.navigate('VerifiedScreens')}
        >
          <Text style={styles.verifiedButtonText}>Verified Cases</Text>
          <MaterialIcons name="verified-user" size={20} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Violation Management</Text>
          <TouchableOpacity
            style={styles.statsButton}
            onPress={() => navigation.navigate('Statistics')}
          >
            <MaterialIcons name="bar-chart" size={20} color="#1976D2" />
            <Text style={styles.statsButtonText}>Statistics</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>{violations.length} pending violations</Text>
      </View>

      <FlatList
        data={violations}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="check-circle" size={48} color="#4CAF50" />
            <Text style={styles.emptyText}>No violations found</Text>
            <Text style={styles.emptySubtext}>All cases are handled</Text>
          </View>
        }
      />

      {selectedViolations.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.verifyButton, isVerifying && { backgroundColor: '#388E3C' }]}
            onPress={handleVerifySelected}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MaterialIcons name="verified-user" size={20} color="white" />
                <Text style={styles.verifyButtonText}>
                  Verify {selectedViolations.length} violation(s)
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({/* your existing styles */


  container: {
    flex: 1,
    backgroundColor: '#D1D5DB',
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 30,
    backgroundColor: '#0A2342',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(25, 118, 210, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  verifiedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(32, 122, 211, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1976D2',
  },
  verifiedButtonText: {
    color: 'white',
    fontWeight: '600',
    marginRight: 4,
    fontSize: 14,
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: 'black' 
  },
  statsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statsButtonText: {
    color: '#1976D2',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
  },
  headerSubtitle: { 
    fontSize: 14, 
    color: 'gray' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A2342',
  },
  loadingText: { 
    marginTop: 16, 
    color: '#E0E0E0', 
    fontSize: 16 
  },
  listContent: { 
    paddingHorizontal: 16, 
    paddingBottom: 100 
  },
  columnWrapper: { 
    justifyContent: 'space-between' 
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f5f5f5',
  },
  plateText: { 
    fontWeight: 'bold', 
    fontSize: 14, 
    color: '#333' 
  },
  badge: {
    backgroundColor: '#DC143C',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: { 
    color: 'white', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    backgroundColor: '#eee',
  },
  plateImage: {
    width: '100%',
    height: 40,
    backgroundColor: '#ddd',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  violationTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    paddingBottom: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingTop: 0,
  },
  timeText: { 
    fontSize: 11, 
    color: '#555', 
    marginLeft: 4 
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E0E0E0',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 4,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  verifyButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },


});

export default ViolationManagement;
