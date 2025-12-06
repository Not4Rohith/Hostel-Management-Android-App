import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert, RefreshControl } from 'react-native';
import { Text, Avatar, ActivityIndicator, IconButton, useTheme, Button, TextInput, Chip, Surface, SegmentedButtons, Card } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { fetchAdminStats, fetchLeaveRequests, updateGatePass, sendBroadcast } from '../../src/services/api'; 
import { colors } from '../../src/constants/colors';

export default function AdminDashboard() {
  const router = useRouter();
  const { logout, user } = useAuthStore();
  
  const [stats, setStats] = useState<any>(null);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [noticeText, setNoticeText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Toggle: 'Pending' (Queue) or 'History' (Approved/Rejected)
  const [gatePassFilter, setGatePassFilter] = useState('Pending'); 

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [statsData, leavesData] = await Promise.all([fetchAdminStats(), fetchLeaveRequests()]);
      setStats(statsData);
      setLeaves(leavesData as any[]);
    } catch (e) {
      console.error("Dashboard Load Error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAllData();
  };

  const handleLeaveAction = async (id: string, action: 'Approved' | 'Rejected') => {
    // 1. Optimistic Update: Immediately update local state to reflect change
    // This forces the item to disappear from "Pending" view instantly
    setLeaves(prevLeaves => 
      prevLeaves.map(item => 
        item.id === id ? { ...item, status: action } : item
      )
    );

    try {
      await updateGatePass(id, action); // Send to DB
      Alert.alert("Success", `Request marked as ${action}`);
    } catch (error) {
      Alert.alert("Error", "Failed to update request");
      loadAllData(); // Revert on error
    }
  };

  const postNotice = async () => {
    if (!noticeText.trim()) return;
    try {
      await sendBroadcast(noticeText, user?.id || '1'); 
      Alert.alert("Sent", "Notice posted.");
      setNoticeText('');
    } catch (error) {
      Alert.alert("Error", "Failed to send.");
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (!stats) return <View style={styles.center}><Text>Failed to load.</Text></View>;

  // Filter Logic
  const filteredLeaves = leaves.filter(l => 
    gatePassFilter === 'Pending' 
      ? l.status === 'Pending' 
      : (l.status === 'Approved' || l.status === 'Rejected')
  );

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: colors.primary }}>Dashboard</Text>
          <Text variant="labelMedium" style={{ color: colors.secondary }}>{new Date().toDateString()}</Text>
        </View>
        <IconButton icon="logout" mode="contained-tonal" onPress={() => { logout(); router.replace('/(auth)/login'); }} />
      </View>

      {/* 1. OCCUPANCY CHART */}
      <Text variant="titleMedium" style={styles.sectionTitle}>Occupancy</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: ["Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{ data: [20, 35, 40, stats.occupiedRooms || 45, stats.occupiedRooms || 50] }] 
          }}
          width={Dimensions.get("window").width - 32}
          height={200}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(103, 80, 164, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "4", strokeWidth: "2", stroke: "#ffa726" }
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      {/* 2. STATS ROW */}
      <View style={styles.statsRow}>
        <Surface style={styles.statCard} elevation={1}>
          <Avatar.Icon size={36} icon="cash" style={{backgroundColor: '#FFF3E0'}} color="#F57C00" />
          <Text variant="titleLarge" style={{fontWeight:'bold', marginTop: 5}}>₹{(stats.pendingFees/1000).toFixed(0)}k</Text>
          <Text variant="labelSmall" style={{color:'#666'}}>Fees</Text>
        </Surface>
        <Surface style={styles.statCard} elevation={1}>
          <Avatar.Icon size={36} icon="alert-circle" style={{backgroundColor: '#FFEBEE'}} color="#D32F2F" />
          <Text variant="titleLarge" style={{fontWeight:'bold', marginTop: 5}}>{stats.pendingComplaints}</Text>
          <Text variant="labelSmall" style={{color:'#666'}}>Issues</Text>
        </Surface>
        <Surface style={styles.statCard} elevation={1}>
           <Avatar.Icon size={36} icon="bed" style={{backgroundColor: '#E8F5E9'}} color="#388E3C" />
           <Text variant="titleLarge" style={{fontWeight:'bold', marginTop: 5}}>{stats.occupiedRooms}</Text>
           <Text variant="labelSmall" style={{color:'#666'}}>Full</Text>
        </Surface>
      </View>

      {/* 3. GATE PASS SECTION */}
      <View style={styles.sectionHeaderRow}>
         <Text variant="titleMedium" style={{fontWeight: 'bold'}}>Gate Pass</Text>
         <SegmentedButtons
            value={gatePassFilter}
            onValueChange={setGatePassFilter}
            buttons={[
              { value: 'Pending', label: 'Queue' },
              { value: 'History', label: 'History' },
            ]}
            style={{width: 160}}
            density="small"
         />
      </View>

      {filteredLeaves.length === 0 ? (
        <View style={styles.emptyState}>
            <Text style={{color:'#999'}}>No {gatePassFilter.toLowerCase()} requests.</Text>
        </View>
      ) : (
        filteredLeaves.map((leave) => (
          <Surface key={leave.id} style={styles.passCard} elevation={1}>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start'}}>
                {/* Left: Info */}
                <View style={{flex: 1}}>
                    <View style={{flexDirection:'row', alignItems:'center', marginBottom:4}}>
                        <Text variant="titleMedium" style={{fontWeight:'bold'}}>{leave.User?.name || 'Student'}</Text>
                        <Text style={{color: colors.secondary, marginLeft: 5}}>({leave.User?.roomNumber})</Text>
                    </View>
                    
                    <Text variant="bodySmall" style={{color: '#555', marginBottom: 8}}>{leave.reason}</Text>
                    
                    <View style={styles.dateBadge}>
                        <Avatar.Icon size={20} icon="calendar" style={{backgroundColor:'transparent'}} color={colors.secondary} />
                        <Text variant="labelSmall" style={{color: colors.secondary}}>{leave.from} - {leave.to}</Text>
                    </View>
                </View>

                {/* Right: Actions or Status */}
                <View style={{marginLeft: 10, justifyContent:'center', alignItems:'flex-end'}}>
                    {leave.status === 'Pending' ? (
                        <View style={{gap: 8}}>
                            <Button 
                                mode="contained" 
                                compact 
                                buttonColor="#4CAF50" 
                                labelStyle={{fontSize: 12, marginHorizontal: 10}} 
                                onPress={() => handleLeaveAction(leave.id, 'Approved')}
                            >
                                Accept
                            </Button>
                            <Button 
                                mode="contained-tonal" 
                                compact 
                                buttonColor="#FFEBEE" 
                                textColor="#D32F2F" 
                                labelStyle={{fontSize: 12, marginHorizontal: 10}} 
                                onPress={() => handleLeaveAction(leave.id, 'Rejected')}
                            >
                                Reject
                            </Button>
                        </View>
                    ) : (
                        <Chip 
                            icon={leave.status === 'Approved' ? 'check' : 'close'} 
                            style={{backgroundColor: leave.status === 'Approved' ? '#E8F5E9' : '#FFEBEE'}}
                            textStyle={{color: leave.status === 'Approved' ? '#2E7D32' : '#C62828'}}
                        >
                            {leave.status}
                        </Chip>
                    )}
                </View>
            </View>
          </Surface>
        ))
      )}

      {/* 4. BROADCAST NOTICE */}
      <Text variant="titleMedium" style={styles.sectionTitle}>Broadcast</Text>
      <Card style={styles.noticeCard}>
        <Card.Content>
          <TextInput
            placeholder="Type announcement..."
            value={noticeText}
            onChangeText={setNoticeText}
            mode="outlined"
            multiline
            numberOfLines={2}
            style={{backgroundColor:'white', marginBottom: 10}}
            outlineColor="#E0E0E0"
          />
          <Button mode="contained" icon="bullhorn" onPress={postNotice} disabled={!noticeText}>
            Send Notice
          </Button>
        </Card.Content>
      </Card>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginTop: 40, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontWeight: 'bold', marginBottom: 12, marginTop: 5, color: '#333' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 15 },
  
  chartContainer: { alignItems: 'center', marginBottom: 20 },
  
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, padding: 15, borderRadius: 16, backgroundColor: 'white', alignItems: 'center', justifyContent:'center' },
  
  emptyState: { padding: 20, alignItems: 'center', backgroundColor: 'white', borderRadius: 12 },
  
  passCard: { 
    backgroundColor: 'white', 
    borderRadius: 16, 
    marginBottom: 12, 
    padding: 16,
  },
  dateBadge: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F5F5F5', 
    paddingRight: 8, 
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  
  noticeCard: { backgroundColor: 'white', borderRadius: 16, marginBottom: 10 },
});