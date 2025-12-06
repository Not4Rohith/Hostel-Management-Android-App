import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, IconButton, useTheme, Chip } from 'react-native-paper';
import { fetchGeneralChat, sendGeneralMessage } from '../../services/api'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatSection({ isAdmin = false }: { isAdmin?: boolean }) {
  const theme = useTheme();
  const [msgText, setMsgText] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    // 1. Get Logged In User ID first
    const init = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id);
      }
    };
    init();

    // 2. Start Polling
    loadChat();
    const interval = setInterval(loadChat, 3000);
    return () => clearInterval(interval);
  }, [currentUserId]); // Re-run if user loads

  const loadChat = async () => {
    const msgs = await fetchGeneralChat();
    
    // Process messages to determine 'self' based on the loaded ID
    if (currentUserId) {
        const processed = msgs.map((m: any) => ({
            ...m,
            // Compare Database Sender ID with Local Storage ID
            self: m.senderId === currentUserId 
        }));
        setChatHistory(processed);
    }
  };

  const handleSend = async () => {
    if (!msgText.trim()) return;
    await sendGeneralMessage(msgText);
    setMsgText('');
    loadChat(); 
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatHistory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={{ 
            alignItems: item.self ? 'flex-end' : 'flex-start', // Alignment container
            marginBottom: 10 
          }}>
            
            {/* NAME LABEL (Only show if it's NOT me and NOT a notice) */}
            {!item.self && !item.isNotice && (
              <Text variant="labelSmall" style={{ marginLeft: 12, color: theme.colors.secondary, fontWeight: 'bold' }}>
                {item.user} {item.user.includes('Admin') ? '(Warden)' : ''}
              </Text>
            )}

            <View style={[
              styles.msgBubble, 
              item.isNotice ? { backgroundColor: '#FFF3E0', borderLeftWidth: 4, borderLeftColor: 'orange', width: '100%' } :
              item.self ? styles.msgSelf : styles.msgOther,
              !item.isNotice && { backgroundColor: item.self ? theme.colors.primaryContainer : 'white' }
            ]}>
               {item.isNotice && <Text style={{fontWeight:'bold', color:'orange', marginBottom:5}}>📢 NOTICE</Text>}
               
               <Text variant="bodyMedium">{item.text}</Text>
               <Text variant="labelSmall" style={{ alignSelf: 'flex-end', marginTop: 4, opacity: 0.6, fontSize: 10 }}>
                 {item.time}
               </Text>
            </View>
          </View>
        )}
      />
      
      <View style={styles.inputArea}>
        <TextInput
          placeholder={isAdmin ? "Post as Admin..." : "Type a message..."}
          value={msgText}
          onChangeText={setMsgText}
          style={{ flex: 1, backgroundColor: 'transparent', height: 40 }}
          underlineColor="transparent"
        />
        <IconButton icon="send" mode="contained" onPress={handleSend} size={20} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  msgBubble: { padding: 12, borderRadius: 16, maxWidth: '85%' },
  msgSelf: { borderBottomRightRadius: 0 },
  msgOther: { borderBottomLeftRadius: 0 },
  inputArea: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#E0E0E0' },
});