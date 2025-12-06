import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, ActivityIndicator, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { fetchStudentData } from '../../src/services/api';
import InfoCard from '../../src/components/cards/InfoCard';
import { colors } from '../../src/constants/colors';

export default function StudentDashboard() {
  const user = useAuthStore((state) => state.user);
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  // 1. Fetch Data on Component Mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await fetchStudentData();
    setStudentData(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.welcomeText}>Hello, {user?.name}</Text>
        <Text variant="bodyMedium" style={{ color: colors.secondary }}>Welcome back to your space.</Text>
      </View>

      {/* Room Details Grid */}
      <View style={styles.gridContainer}>
        <View style={styles.row}>
          <InfoCard title="Room No" value={studentData.roomNumber} icon="door" />
          <InfoCard title="Block" value={studentData.block} icon="office-building" />
        </View>
        <View style={styles.row}>
          <InfoCard title="Bed ID" value={studentData.bedId} icon="bed" />
          <InfoCard 
            title="Fees Due" 
            value={`₹${studentData.feesPending}`} 
            icon="cash" 
            color={studentData.feesPending > 0 ? colors.error : undefined} // Red icon if fees pending
          />
        </View>
      </View>

      {/* Quick Actions Section */}
      <Text variant="titleLarge" style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionRow}>
        <Button mode="contained-tonal" icon="alert-circle" onPress={() => router.push('/(student)/complaints')}>
          Complaint
        </Button>
        <Button mode="contained-tonal" icon="food" onPress={() => router.push('/(student)/mess')}>
          Today's Menu
        </Button>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  welcomeText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  gridContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
});