import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import { Text, Card, Chip, Avatar, Portal, Modal, Button, IconButton, SegmentedButtons, Divider, useTheme } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import { fetchComplaints, resolveComplaintAPI } from '../../src/services/api';
import { colors } from '../../src/constants/colors';

export default function AdminComplaintsScreen() {
  const theme = useTheme();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [filter, setFilter] = useState('Pending'); 
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-load
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    try {
      console.log("Admin loading complaints...");
      const data = await fetchComplaints();
      console.log("Admin received:", data.length, "complaints");
      setComplaints(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markResolved = (id: string) => {
    Alert.alert("Confirm Resolve", "Mark this issue as fixed?", [
      { text: "Cancel" },
      { 
        text: "Yes, Resolved", 
        onPress: async () => {
          try {
            await resolveComplaintAPI(id);
            loadData();
            setModalVisible(false);
          } catch (error) {
            Alert.alert("Error", "Could not update status");
          }
        }
      }
    ]);
  };

  const filteredData = complaints.filter(c => c.status === filter);

  const renderItem = ({ item }: { item: any }) => (
    <Card 
      style={[styles.card, { borderLeftColor: item.status === 'Pending' ? colors.error : 'green', borderLeftWidth: 5 }]}
      onPress={() => { setSelectedComplaint(item); setModalVisible(true); }}
    >
      <Card.Title
        title={item.title}
        subtitle={`${item.category} • Room ${item.User?.roomNumber || 'N/A'}`}
        left={(props) => <Avatar.Icon {...props} icon={item.status === 'Pending' ? 'clock' : 'check'} style={{ backgroundColor: 'transparent' }} color={item.status === 'Pending' ? colors.error : 'green'} />}
        right={(props) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {item.status === 'Pending' && (
              <Button compact textColor="green" onPress={() => markResolved(item.id)}>Resolve</Button>
            )}
            <IconButton {...props} icon="chevron-right" size={20} />
          </View>
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginBottom: 15 }}>Issue Tracker</Text>
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: 'Pending', label: `Pending`, icon: 'alert-circle-outline' },
            { value: 'Resolved', label: 'History', icon: 'history' },
          ]}
        />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        renderItem={renderItem}
        refreshControl={ <RefreshControl refreshing={loading} onRefresh={loadData} /> }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Avatar.Icon size={60} icon="check-circle-outline" style={{ backgroundColor: '#E8F5E9' }} color="green" />
            <Text variant="titleMedium" style={{ marginTop: 10, color: '#666' }}>All caught up!</Text>
            <Text variant="bodySmall" style={{ color: '#999' }}>No issues found.</Text>
          </View>
        }
      />

      {/* DETAIL MODAL */}
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
          {selectedComplaint && (
            <>
              <View style={styles.modalHeader}>
                <Chip icon="account">{selectedComplaint.User?.name || 'Student'} ({selectedComplaint.User?.roomNumber})</Chip>
                <Chip style={{ backgroundColor: selectedComplaint.status === 'Pending' ? '#FFEBEE' : '#E8F5E9' }}>{selectedComplaint.status}</Chip>
              </View>
              <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginTop: 10 }}>{selectedComplaint.title}</Text>
              <Text variant="bodyMedium" style={{ color: colors.secondary, marginBottom: 10 }}>{selectedComplaint.category}</Text>
              <Divider style={{marginVertical: 10}}/>
              <View style={{ marginVertical: 5, padding: 15, backgroundColor: '#F5F5F5', borderRadius: 8 }}>
                 <Text variant="bodyMedium">{selectedComplaint.description || "No details."}</Text>
              </View>
              <Button mode="text" onPress={() => setModalVisible(false)} style={{ marginTop: 5 }}>Close</Button>
            </>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 20, paddingTop: 50, backgroundColor: 'white', elevation: 2 },
  card: { marginBottom: 10, backgroundColor: 'white' },
  emptyState: { alignItems: 'center', marginTop: 50 },
  modal: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 15 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 5 }
});