import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Avatar, FAB, Portal, Modal, TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../constants/colors';
import { MOCK_LOST_FOUND_DATA, submitLostFoundItem } from '../../services/api';
import { LostItem } from '../../types'; // <--- THIS FIXES THE TYPESCRIPT ERROR
// Import the new auto-send function
import { autoSendFoundMessage } from '../../services/api';


export default function LostFoundSection() {
  // Explicitly tell State that this is an array of LostItem
  const [lostItems, setLostItems] = useState<LostItem[]>(MOCK_LOST_FOUND_DATA as LostItem[]);
  
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [foundModalVisible, setFoundModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [newItem, setNewItem] = useState<Partial<LostItem>>({ type: 'LOST' });
  const [foundProof, setFoundProof] = useState({ contact: '', image: null as string | null });
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Image Picker Logic
  const pickImage = async (target: 'post' | 'proof') => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (target === 'post') {
        setNewItem({ ...newItem, image: result.assets[0].uri });
      } else {
        setFoundProof({ ...foundProof, image: result.assets[0].uri });
      }
    }
  };

  const handlePostItem = async () => {
    if (!newItem.item || !newItem.location) return;
    setLoading(true);
    
    const postData: LostItem = { 
      id: Date.now().toString(), 
      item: newItem.item!,
      location: newItem.location!,
      contact: newItem.contact!,
      date: 'Just Now',
      type: 'LOST',
      image: newItem.image
    };
    
    await submitLostFoundItem(postData);
    setLostItems([postData, ...lostItems]);
    setLoading(false);
    setPostModalVisible(false);
    setNewItem({ type: 'LOST' });
  };

  const openFoundModal = (id: string) => {
    setSelectedItemId(id);
    setFoundProof({ contact: '', image: null });
    setFoundModalVisible(true);
  };

  const handleSubmitFound = async () => { // Make it async
  if (!foundProof.image || !foundProof.contact.trim()) return;

  // 1. Update UI locally
  const updatedList = lostItems.map(item => 
    item.id === selectedItemId ? { ...item, type: 'FOUND' as const, foundBy: foundProof.contact } : item
  );
  setLostItems(updatedList);

  // 2. AUTO DM LOGIC
  const itemDetails = lostItems.find(i => i.id === selectedItemId);
  if (itemDetails) {
      // Simulate sending DM to the person who lost it (itemDetails.contact)
      await autoSendFoundMessage(itemDetails.item, foundProof.contact, itemDetails.contact);
      alert(`Proof uploaded! A message has been sent to ${itemDetails.contact}`);
  }

  setFoundModalVisible(false);
};

  return (
    <View style={styles.container}>
      <FlatList
        data={lostItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => {
          const isFound = item.type === 'FOUND';
          return (
            <Card style={[styles.card, isFound && { opacity: 0.8 }]}>
              {/* NO MORE ERROR HERE because type is defined */}
              {item.image && <Card.Cover source={{ uri: item.image }} style={{ height: 150 }} />}
              
              <Card.Title 
                title={item.item} 
                titleStyle={{ textDecorationLine: isFound ? 'line-through' : 'none' }}
                subtitle={`${item.location} • ${item.date}`}
                left={(props) => <Avatar.Icon {...props} icon={isFound ? "check" : "help"} style={{ backgroundColor: isFound ? 'green' : colors.error }} color="white" />}
              />
              <Card.Content>
                <Text variant="bodyMedium">Contact: <Text style={{ fontWeight: 'bold' }}>{item.contact}</Text></Text>
                {/* NO MORE ERROR HERE */}
                {/* {isFound && <Text variant="bodyMedium" style={{ color: 'green', marginTop: 5 }}>Resolved by: {item.foundBy}</Text>} */}
              </Card.Content>
              
              {!isFound && (
                <Card.Actions>
                    <Button mode="contained-tonal" textColor={colors.primary} icon="eye-check" onPress={() => openFoundModal(item.id)}>
                        I Found This!
                    </Button>
                </Card.Actions>
              )}
            </Card>
          );
        }}
      />
      
      <FAB icon="plus" label="Report Lost" style={styles.fab} onPress={() => setPostModalVisible(true)} color="white" />

      {/* --- POST MODAL --- */}
      <Portal>
        <Modal visible={postModalVisible} onDismiss={() => setPostModalVisible(false)} contentContainerStyle={styles.modal}>
          <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginBottom: 15 }}>Report Lost Item</Text>
          <TouchableOpacity onPress={() => pickImage('post')} style={styles.imagePicker}>
            {newItem.image ? <Image source={{ uri: newItem.image }} style={styles.imgPreview} /> : 
              <View style={{ alignItems: 'center' }}><Avatar.Icon size={40} icon="camera" style={{ backgroundColor: '#F0F0F0' }} color={colors.secondary} /><Text>Add Photo</Text></View>}
          </TouchableOpacity>
          <TextInput label="Item Name" onChangeText={t => setNewItem({...newItem, item: t})} mode="outlined" style={styles.input} />
          <TextInput label="Location" onChangeText={t => setNewItem({...newItem, location: t})} mode="outlined" style={styles.input} />
          <TextInput label="Contact" onChangeText={t => setNewItem({...newItem, contact: t})} mode="outlined" style={styles.input} />
          <Button mode="contained" onPress={handlePostItem} loading={loading}>Post Report</Button>
        </Modal>
      </Portal>

      {/* --- FOUND MODAL --- */}
      <Portal>
        <Modal visible={foundModalVisible} onDismiss={() => setFoundModalVisible(false)} contentContainerStyle={styles.modal}>
          <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: 'green' }}>I Found This!</Text>
          <TouchableOpacity onPress={() => pickImage('proof')} style={[styles.imagePicker, !foundProof.image && { borderColor: colors.error }]}>
            {foundProof.image ? <Image source={{ uri: foundProof.image }} style={styles.imgPreview} /> : 
              <View style={{ alignItems: 'center' }}><Text style={{ color: colors.error }}>Upload Proof (Required)</Text></View>}
          </TouchableOpacity>
          <TextInput label="My Contact" value={foundProof.contact} onChangeText={t => setFoundProof({...foundProof, contact: t})} mode="outlined" style={styles.input} />
          <Button mode="contained" onPress={handleSubmitFound} disabled={!foundProof.image || !foundProof.contact} style={{ marginTop: 10 }}>Confirm</Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { marginBottom: 12, backgroundColor: 'white', overflow: 'hidden' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: colors.primary },
  modal: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 },
  input: { marginBottom: 12 },
  imagePicker: { height: 150, backgroundColor: '#F0F0F0', borderRadius: 8, marginBottom: 15, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#CCC' },
  imgPreview: { width: '100%', height: '100%', borderRadius: 8 }
});