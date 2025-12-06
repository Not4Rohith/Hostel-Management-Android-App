import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Linking, ScrollView } from 'react-native';
import { Text, Searchbar, Card, Avatar, Portal, Modal, IconButton, Button, Chip, useTheme, Divider, FAB, TextInput } from 'react-native-paper';
import { fetchRooms, addNewStudent } from '../../src/services/api';
import { colors } from '../../src/constants/colors';

export default function RoomsScreen() {
  const theme = useTheme();
  
  // Data State
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Room Detail Modal State
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Add Student Modal State
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', rollNo: '', roomNo: '', phone: '', parentPhone: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchRooms(); // This now fetches real students and converts to rooms
    setRooms(data as any[]);
    setLoading(false);
  };

  // --- ACTION: CALL PHONE ---
  const makeCall = (number: string) => {
    if (number) Linking.openURL(`tel:${number}`);
  };

  // --- ACTION: ADD STUDENT ---
  const handleAddStudent = async () => {
    if(!formData.email || !formData.password) return;
    
    setLoading(true);
    await addNewStudent(formData);
    setAddModalVisible(false);
    
    // Reset Form
    setFormData({ name: '', email: '', password: '', rollNo: '', roomNo: '', phone: '', parentPhone: '' });
    
    // Reload Grid to show new student
    await loadData(); 
    setLoading(false);
  };

  // --- SEARCH LOGIC ---
  const filteredStudents = searchQuery 
    ? rooms.flatMap(r => r.occupants.map((s: any) => ({ ...s, roomNo: r.roomNo })))
           .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleRoomPress = (room: any) => {
    setSelectedRoom(room);
    setDetailModalVisible(true);
  };

  // --- RENDER: ROOM GRID ITEM ---
  const renderRoom = ({ item }: { item: any }) => {
    const isFull = item.occupants.length >= item.capacity;
    
    return (
      <Card 
        style={[styles.roomCard, isFull ? { borderColor: colors.error } : { borderColor: 'green' }]} 
        mode="outlined"
        onPress={() => handleRoomPress(item)}
      >
        <View style={styles.roomInner}>
          <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>{item.roomNo}</Text>
          <View style={styles.bedRow}>
            {Array.from({ length: item.capacity }).map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.bedDot, 
                  { backgroundColor: index < item.occupants.length ? theme.colors.primary : '#E0E0E0' }
                ]} 
              />
            ))}
          </View>
          <Text variant="labelSmall" style={{ color: isFull ? colors.error : 'green', marginTop: 5 }}>
            {isFull ? 'FULL' : `${item.capacity - item.occupants.length} Beds Left`}
          </Text>
        </View>
      </Card>
    );
  };

  // --- RENDER: SEARCH RESULT ITEM ---
  const renderStudentResult = ({ item }: { item: any }) => (
    <Card style={{ marginBottom: 10, backgroundColor: 'white' }} onPress={() => {
       const parentRoom = rooms.find(r => r.roomNo === item.roomNo);
       if(parentRoom) handleRoomPress(parentRoom);
    }}>
      <Card.Title
        title={item.name}
        subtitle={`${item.rollNo} • Room ${item.roomNo}`}
        left={(props) => <Avatar.Text {...props} size={40} label={item.name.substring(0,2)} />}
        right={(props) => <IconButton {...props} icon="phone" onPress={() => makeCall(item.phone)} />}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Search Student..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{ minHeight: 0 }}
        />
      </View>

      {/* Content Switcher */}
      {searchQuery ? (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.rollNo || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          renderItem={renderStudentResult}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium" style={styles.gridTitle}>All Rooms</Text>
          <FlatList
            data={rooms}
            keyExtractor={(item) => item.roomNo}
            numColumns={3}
            contentContainerStyle={styles.gridContent}
            renderItem={renderRoom}
          />
        </View>
      )}

      {/* ADD STUDENT FAB */}
      <FAB
        icon="plus"
        label="Add Student"
        style={styles.fab}
        onPress={() => setAddModalVisible(true)}
        color="white"
      />

      {/* --- MODAL 1: ROOM DETAILS --- */}
      <Portal>
        <Modal visible={detailModalVisible} onDismiss={() => setDetailModalVisible(false)} contentContainerStyle={styles.modal}>
          {selectedRoom && (
            <>
              <View style={styles.modalHeader}>
                <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>Room {selectedRoom.roomNo}</Text>
                <Chip icon="bed">{selectedRoom.occupants.length} / {selectedRoom.capacity} Occupied</Chip>
              </View>
              <Divider style={{ marginVertical: 10 }} />
              
              <Text variant="titleMedium" style={{ marginBottom: 10 }}>Occupants</Text>
              {selectedRoom.occupants.length === 0 ? (
                <Text style={{ fontStyle: 'italic', color: '#888' }}>This room is empty.</Text>
              ) : (
                selectedRoom.occupants.map((student: any, index: number) => (
                  <View key={index} style={styles.studentRow}>
                    <Avatar.Text size={40} label={student.bed || 'A'} style={{ backgroundColor: theme.colors.secondaryContainer }} color={theme.colors.onSecondaryContainer} />
                    <View style={{ marginLeft: 15, flex: 1 }}>
                      <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>{student.name}</Text>
                      <Text variant="bodySmall">Roll: {student.rollNumber}</Text>
                      <Text variant="bodySmall" style={{color:'#888'}}>Parent: {student.guardianPhone}</Text>
                    </View>
                    <IconButton icon="phone" size={20} onPress={() => makeCall(student.phone)} />
                  </View>
                ))
              )}
              <Button mode="text" onPress={() => setDetailModalVisible(false)} style={{ marginTop: 20 }}>Close</Button>
            </>
          )}
        </Modal>
      </Portal>

      {/* --- MODAL 2: ADD STUDENT FORM --- */}
      <Portal>
        <Modal visible={addModalVisible} onDismiss={() => setAddModalVisible(false)} contentContainerStyle={styles.modal}>
          <Text variant="titleLarge" style={{marginBottom:10, fontWeight:'bold'}}>Add New Student</Text>
          <TextInput label="Name" onChangeText={t => setFormData({...formData, name: t})} style={styles.input} mode="outlined" dense />
          <View style={{flexDirection:'row', gap:5}}>
             <TextInput label="Room No" onChangeText={t => setFormData({...formData, roomNo: t})} style={[styles.input, {flex:1}]} mode="outlined" dense />
             <TextInput label="Roll No" onChangeText={t => setFormData({...formData, rollNo: t})} style={[styles.input, {flex:1}]} mode="outlined" dense />
          </View>
          <TextInput label="Email (Login ID)" onChangeText={t => setFormData({...formData, email: t})} style={styles.input} autoCapitalize='none' mode="outlined" dense />
          <TextInput label="Password" onChangeText={t => setFormData({...formData, password: t})} style={styles.input} mode="outlined" dense />
          <TextInput label="Phone" onChangeText={t => setFormData({...formData, phone: t})} style={styles.input} keyboardType='phone-pad' mode="outlined" dense />
          <TextInput label="Parent Phone" onChangeText={t => setFormData({...formData, parentPhone: t})} style={styles.input} keyboardType='phone-pad' mode="outlined" dense />
          
          <Button mode="contained" onPress={handleAddStudent} loading={loading} style={{marginTop:10}}>Create Account</Button>
        </Modal>
      </Portal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 16, backgroundColor: 'white', elevation: 2 },
  searchBar: { backgroundColor: '#F0F0F0', borderRadius: 10 },
  gridTitle: { marginLeft: 16, marginTop: 10, fontWeight: 'bold', color: '#666' },
  gridContent: { padding: 10, paddingBottom: 80 },
  roomCard: { flex: 1, margin: 5, backgroundColor: 'white', borderWidth: 1, borderRadius: 12 },
  roomInner: { padding: 10, alignItems: 'center', justifyContent: 'center', minHeight: 100 },
  bedRow: { flexDirection: 'row', gap: 5, marginVertical: 8 },
  bedDot: { width: 12, height: 12, borderRadius: 6 },
  listContent: { padding: 16 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: colors.primary },
  modal: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 15, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  studentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  input: { marginBottom: 8, backgroundColor:'white' }
});