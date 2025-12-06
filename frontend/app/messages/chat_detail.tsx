import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, IconButton, useTheme, Appbar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchChats, sendDM } from '../../src/services/api'; // Use the new API functions

export default function ChatDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id, name } = useLocalSearchParams(); // 'id' here is the OTHER USER'S ID
  
  const [msgText, setMsgText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    loadThread();
    // Auto-refresh DMs every 3 seconds too
    const interval = setInterval(loadThread, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const loadThread = async () => {
    // Fetch all threads and find the one with this user
    // (Inefficient for huge apps, but perfect for this scale)
    const allThreads = await fetchChats();
    const thisThread = allThreads.find((t: any) => t.id === id);
    if (thisThread) {
        setMessages(thisThread.messages.reverse());
    }
  };

  const handleSend = async () => {
    if (!msgText.trim()) return;
    
    // Send to Backend
    await sendDM(id as string, msgText);
    setMsgText('');
    loadThread(); // Refresh UI
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex:1, backgroundColor:'white'}}>
      <Appbar.Header style={{backgroundColor: 'white', elevation: 1}}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={name as string} />
      </Appbar.Header>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        inverted 
        renderItem={({ item }) => (
          <View style={[
            styles.bubble, 
            item.sender === 'me' ? styles.me : styles.other,
            { backgroundColor: item.sender === 'me' ? theme.colors.primary : '#F0F0F0' }
          ]}>
            <Text style={{ color: item.sender === 'me' ? 'white' : 'black' }}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputArea}>
        <TextInput 
          mode="outlined" 
          value={msgText} 
          onChangeText={setMsgText} 
          placeholder="Message..." 
          style={{flex:1, backgroundColor:'white'}} 
          dense 
          outlineColor="transparent"
          activeOutlineColor="transparent"
        />
        <IconButton icon="send" mode="contained" onPress={handleSend} iconColor="white" containerColor={theme.colors.primary} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bubble: { padding: 12, borderRadius: 20, maxWidth: '80%', marginVertical: 4 },
  me: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  other: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  inputArea: { flexDirection: 'row', padding: 10, backgroundColor: 'white', alignItems: 'center', gap: 5, borderTopWidth: 1, borderTopColor: '#f0f0f0' }
});