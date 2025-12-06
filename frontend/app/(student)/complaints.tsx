import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, FAB, Modal, Portal, TextInput, Button, ActivityIndicator, SegmentedButtons, Card, Chip, useTheme } from 'react-native-paper';
import { fetchComplaints, submitComplaint, fetchLeaveRequests, submitLeaveRequest } from '../../src/services/api';
import { colors } from '../../src/constants/colors';
import ComplaintCard from '../../src/components/cards/ComplaintCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

export default function HelpScreen() {
  const [view, setView] = useState('issues'); 
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<any>(null);
  
  // Separate states to avoid overwriting
  const [complaints, setComplaints] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  
  const [issueModal, setIssueModal] = useState(false);
  const [leaveModal, setLeaveModal] = useState(false);
  
  const [newIssue, setNewIssue] = useState({ title: '', category: '' });
  const [newLeave, setNewLeave] = useState({ reason: '', from: '', to: '' });

  // 1. Load User ID on Mount
  useEffect(() => {
    const init = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const id = JSON.parse(userStr).id;
        setUserId(id);
      }
    };
    init();
  }, []);

  // 2. Load Data when User ID is ready OR screen is focused
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        loadData(userId);
      }
    }, [userId])
  );

  const loadData = async (id: any) => {
    setLoading(true);
    try {
      // Fetch independently to prevent one failure from blocking the other
      const issuesPromise = fetchComplaints();
      const leavesPromise = fetchLeaveRequests();

      const [issuesData, leavesData] = await Promise.allSettled([issuesPromise, leavesPromise]);

      if (issuesData.status === 'fulfilled') setComplaints(issuesData.value || []);
      if (leavesData.status === 'fulfilled') setLeaves(leavesData.value || []);
      
    } catch (e) {
      console.error("Load Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueSubmit = async () => {
    if (!newIssue.title || !newIssue.category) return;
    try {
      await submitComplaint({ ...newIssue, userId });
      setIssueModal(false);
      setNewIssue({ title: '', category: '' });
      loadData(userId); 
    } catch (e) { alert('Failed to submit'); }
  };

  const handleLeaveSubmit = async () => {
    if (!newLeave.reason || !newLeave.from || !userId) {
        alert("Please fill all fields.");
        return;
    }
    try {
      console.log("Submitting Gate Pass:", { ...newLeave, studentId: userId });
      await submitLeaveRequest({ ...newLeave, studentId: userId });
      setLeaveModal(false);
      setNewLeave({ reason: '', from: '', to: '' });
      loadData(userId); 
    } catch (e) { 
        console.error(e);
        alert('Failed to submit request'); 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: colors.primary, marginBottom: 15 }}>Help & Requests</Text>
         <SegmentedButtons
          value={view}
          onValueChange={setView}
          buttons={[
            { value: 'issues', label: 'Maintenance', icon: 'tools' },
            { value: 'gatepass', label: 'Gate Pass', icon: 'door-open' },
          ]}
        />
      </View>

      <View style={{flex: 1, padding: 16}}>
        {loading && complaints.length === 0 && leaves.length === 0 ? (
            <ActivityIndicator color={colors.primary} style={{marginTop: 50}} />
        ) : (
          view === 'issues' ? (
            <>
              <FlatList
                data={complaints}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <ComplaintCard 
                    title={item.title} 
                    category={item.category} 
                    status={item.status} 
                    date={item.date || item.createdAt?.split('T')[0]} 
                  />
                )}
                ListEmptyComponent={<Text style={{textAlign:'center', color:'#888', marginTop: 20}}>No issues reported.</Text>}
              />
              <FAB icon="plus" label="Report Issue" style={styles.fab} onPress={() => setIssueModal(true)} color="white" />
            </>
          ) : (
            <>
              <FlatList
                data={leaves}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <Card style={styles.card}>
                    <Card.Title 
                      title={item.reason}
                      subtitle={`${item.from} - ${item.to}`}
                      right={(props) => (
                        <Chip style={{marginRight:10, backgroundColor: item.status === 'Approved' ? '#E8F5E9' : item.status === 'Rejected' ? '#FFEBEE' : '#FFF3E0'}}>
                          {item.status}
                        </Chip>
                      )}
                    />
                  </Card>
                )}
                ListEmptyComponent={<Text style={{textAlign:'center', color:'#888', marginTop: 20}}>No gate passes found.</Text>}
              />
              <FAB icon="walk" label="Apply Leave" style={styles.fab} onPress={() => setLeaveModal(true)} color="white" />
            </>
          )
        )}
      </View>

      {/* Modals */}
      <Portal>
        <Modal visible={issueModal} onDismiss={() => setIssueModal(false)} contentContainerStyle={styles.modal}>
          <Text variant="titleLarge" style={{marginBottom:10}}>Report Issue</Text>
          <TextInput label="Problem" value={newIssue.title} onChangeText={t => setNewIssue({...newIssue, title: t})} mode="outlined" style={styles.input} />
          <TextInput label="Category" value={newIssue.category} onChangeText={t => setNewIssue({...newIssue, category: t})} mode="outlined" style={styles.input} />
          <Button mode="contained" onPress={handleIssueSubmit}>Submit</Button>
        </Modal>

        <Modal visible={leaveModal} onDismiss={() => setLeaveModal(false)} contentContainerStyle={styles.modal}>
          <Text variant="titleLarge" style={{marginBottom:10}}>Request Gate Pass</Text>
          <TextInput label="Reason" value={newLeave.reason} onChangeText={t => setNewLeave({...newLeave, reason: t})} mode="outlined" style={styles.input} />
          <View style={{flexDirection:'row', gap:10}}>
             <TextInput label="From" value={newLeave.from} onChangeText={t => setNewLeave({...newLeave, from: t})} mode="outlined" style={[styles.input, {flex:1}]} />
             <TextInput label="To" value={newLeave.to} onChangeText={t => setNewLeave({...newLeave, to: t})} mode="outlined" style={[styles.input, {flex:1}]} />
          </View>
          <Button mode="contained" onPress={handleLeaveSubmit}>Request</Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 20, paddingTop: 50, backgroundColor: 'white', elevation: 2 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: colors.primary },
  modal: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 },
  input: { marginBottom: 15 },
  card: { marginBottom: 10, backgroundColor: 'white' }
});