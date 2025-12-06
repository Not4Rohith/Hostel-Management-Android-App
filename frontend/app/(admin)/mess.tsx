import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Chip, ActivityIndicator, FAB, Portal, Modal, TextInput, Button, useTheme } from 'react-native-paper';
import { fetchMenu, updateMenuData } from '../../src/services/api';
import MealCard from '../../src/components/cards/MealCard';
import { colors } from '../../src/constants/colors';
import { Ionicons } from '@expo/vector-icons';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AdminMessScreen() {
  const theme = useTheme();
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Mon');
  
  // Edit State
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState({ Breakfast: '', Lunch: '', Snacks: '', Dinner: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    const data = await fetchMenu();
    setMenu(data || {});
    setLoading(false);
  };

  const openEditModal = () => {
    const dayMenu = menu?.[selectedDay] || {};
    
    const getValue = (field: any) => {
      if (!field) return '';
      if (typeof field === 'string') return field === 'Not Set' ? '' : field;
      if (field.item) return field.item === 'Not Set' ? '' : field.item;
      return '';
    };

    setEditData({
      Breakfast: getValue(dayMenu.Breakfast),
      Lunch: getValue(dayMenu.Lunch),
      Snacks: getValue(dayMenu.Snacks),
      Dinner: getValue(dayMenu.Dinner),
    });
    
    setModalVisible(true);
  };

  const handleSave = async () => {
    setSaving(true);
    
    // --- THE FIX IS HERE: USE LOWERCASE KEYS ---
    const payload = {
      breakfast: editData.Breakfast || "Not Set", // <--- Changed to lowercase 'b'
      lunch: editData.Lunch || "Not Set",         // <--- Changed to lowercase 'l'
      snacks: editData.Snacks || "Not Set",       // <--- Changed to lowercase 's'
      dinner: editData.Dinner || "Not Set",       // <--- Changed to lowercase 'd'
    };

    console.log("Admin UI Sending:", payload); 

    // We pass 'payload' which now has lowercase keys
    await updateMenuData(selectedDay, payload);
    
    // For Local UI update, we keep the Capitalized structure the App expects
    const updatedLocalMenu = {
      ...menu,
      [selectedDay]: {
        Breakfast: { item: payload.breakfast, time: '7:30 - 9:00 AM' },
        Lunch: { item: payload.lunch, time: '12:30 - 2:00 PM' },
        Snacks: { item: payload.snacks, time: '4:30 - 5:30 PM' },
        Dinner: { item: payload.dinner, time: '7:30 - 9:00 PM' }
      }
    };
    
    setMenu(updatedLocalMenu);
    setSaving(false);
    setModalVisible(false);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  const currentMenu = menu?.[selectedDay] || {}; 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
            <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: colors.primary }}>Mess Manager</Text>
            <Text variant="bodySmall" style={{ color: colors.secondary }}>Editing menu for: <Text style={{fontWeight:'bold'}}>{selectedDay}</Text></Text>
        </View>
        <Ionicons name="settings-outline" size={24} color={colors.primary} />
      </View>

      <View style={{ height: 50, marginBottom: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScroll}>
          {DAYS.map((day) => (
            <Chip
              key={day}
              selected={selectedDay === day}
              onPress={() => setSelectedDay(day)}
              style={selectedDay === day ? { backgroundColor: theme.colors.primaryContainer } : {}}
              showSelectedOverlay
            >
              {day}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 80 }}>
        {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((type) => (
           <MealCard 
             key={type}
             type={type} 
             item={currentMenu[type]?.item || 'Not Set'} 
             time={currentMenu[type]?.time || '--'} 
             icon="food" 
           />
        ))}
      </ScrollView>

      <FAB icon="pencil" label="Edit Menu" style={styles.fab} onPress={openEditModal} color="white" />

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
          <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginBottom: 15 }}>Update Menu ({selectedDay})</Text>
          
          <TextInput label="Breakfast Item" value={editData.Breakfast} onChangeText={t => setEditData(prev => ({...prev, Breakfast: t}))} mode="outlined" style={styles.input} />
          <TextInput label="Lunch Item" value={editData.Lunch} onChangeText={t => setEditData(prev => ({...prev, Lunch: t}))} mode="outlined" style={styles.input} />
          <TextInput label="Snacks Item" value={editData.Snacks} onChangeText={t => setEditData(prev => ({...prev, Snacks: t}))} mode="outlined" style={styles.input} />
          <TextInput label="Dinner Item" value={editData.Dinner} onChangeText={t => setEditData(prev => ({...prev, Dinner: t}))} mode="outlined" style={styles.input} />

          <Button mode="contained" onPress={handleSave} loading={saving} style={{ marginTop: 10 }}>Save Changes</Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, paddingTop: 50, backgroundColor: 'white', marginBottom: 10, flexDirection: 'row', justifyContent:'space-between', alignItems:'center' },
  dayScroll: { paddingHorizontal: 16, gap: 8 },
  content: { padding: 16 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: colors.primary },
  modal: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 },
  input: { marginBottom: 10, backgroundColor: 'white' }
});