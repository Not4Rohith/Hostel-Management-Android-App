import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Text, Avatar, List, Switch, Button, Divider, Surface, useTheme, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { fetchStudentData } from '../../src/services/api'; // This now calls the Real Backend
import { colors } from '../../src/constants/colors';
import * as Linking from 'expo-linking';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchStudentData();
    setUser(data);
    setLoading(false);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        } 
      }
    ]);
  };

  const dialNumber = (number: string) => {
    if(number) Linking.openURL(`tel:${number}`);
    else Alert.alert("No Number", "Phone number not available.");
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (!user) return <View style={styles.center}><Text>Failed to load profile.</Text></View>;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* --- HEADER --- */}
      <View style={[styles.headerBackground, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerContent}>
          <Avatar.Image size={100} source={{ uri: user.profileImage }} style={styles.avatar} />
          <Text variant="headlineMedium" style={styles.nameText}>{user.name}</Text>
          <Text variant="bodyLarge" style={styles.courseText}>{user.email}</Text>
          
          <View style={styles.idTag}>
             <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>ROLL: {user.rollNumber || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* --- INFO CARDS --- */}
      <View style={styles.contentContainer}>
        <Surface style={styles.infoCard} elevation={2}>
          <View style={styles.infoRow}>
             <InfoItem label="Room No" value={user.roomNumber || '--'} icon="door" />
             <View style={styles.verticalDivider} />
             <InfoItem label="Block" value={user.block || 'A'} icon="office-building" />
             <View style={styles.verticalDivider} />
             <InfoItem label="Phone" value={user.phone || '--'} icon="phone" />
          </View>
        </Surface>

        {/* --- EMERGENCY CONTACT --- */}
        <List.Section>
          <List.Subheader style={styles.subheader}>Emergency Contact</List.Subheader>
          <Surface style={styles.guardianCard} elevation={1}>
            <List.Item
              title={user.guardianName || "Parent"}
              description={user.guardianPhone || "No number added"}
              left={props => <List.Icon {...props} icon="shield-account-outline" />}
              right={props => (
                <IconButton 
                  icon="phone" 
                  mode="contained" 
                  containerColor={theme.colors.primaryContainer} 
                  iconColor={theme.colors.primary}
                  onPress={() => dialNumber(user.guardianPhone)}
                />
              )}
            />
          </Surface>
        </List.Section>

        {/* --- APP SETTINGS --- */}
        <List.Section>
          <List.Subheader style={styles.subheader}>Settings</List.Subheader>
          <List.Item
            title="Push Notifications"
            left={props => <List.Icon {...props} icon="bell-outline" />}
            right={() => <Switch value={notifications} onValueChange={setNotifications} color={colors.primary} />}
          />
          <Divider />
          <List.Item
            title="Change Password"
            left={props => <List.Icon {...props} icon="lock-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>

        {/* --- LOGOUT --- */}
        <View style={styles.logoutContainer}>
          <Button mode="outlined" textColor={colors.error} style={{ borderColor: colors.error }} icon="logout" onPress={handleLogout}>
            Logout
          </Button>
          <Text style={styles.versionText}>App Version 1.0.0</Text>
        </View>

      </View>
    </ScrollView>
  );
}

const InfoItem = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
  <View style={{ alignItems: 'center', flex: 1 }}>
    <Avatar.Icon size={32} icon={icon} style={{ backgroundColor: '#F0F0F0', marginBottom: 4 }} color="#666" />
    <Text variant="labelSmall" style={{ color: '#888' }}>{label}</Text>
    <Text variant="titleMedium" style={{ fontWeight: 'bold', fontSize: 13 }}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBackground: { paddingTop: 60, paddingBottom: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, alignItems: 'center' },
  headerContent: { alignItems: 'center' },
  avatar: { borderWidth: 4, borderColor: 'white', marginBottom: 10 },
  nameText: { color: 'white', fontWeight: 'bold' },
  courseText: { color: 'rgba(255,255,255,0.8)', marginBottom: 10 },
  idTag: { backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  contentContainer: { paddingHorizontal: 20, marginTop: -25 },
  infoCard: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verticalDivider: { width: 1, height: '80%', backgroundColor: '#E0E0E0' },
  subheader: { fontSize: 14, fontWeight: 'bold', color: '#666', marginTop: 10 },
  guardianCard: { backgroundColor: 'white', borderRadius: 12, overflow: 'hidden' },
  logoutContainer: { marginTop: 20, marginBottom: 40, gap: 10 },
  versionText: { textAlign: 'center', color: '#AAA', fontSize: 12 },
});