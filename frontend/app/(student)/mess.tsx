import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Chip, ActivityIndicator, useTheme } from 'react-native-paper';
import { fetchMenu } from '../../src/services/api'; // This calls the real backend
import MealCard from '../../src/components/cards/MealCard';
import { colors } from '../../src/constants/colors';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MessScreen() {
  const theme = useTheme();
  const [menu, setMenu] = useState<any>({}); // Default to empty object
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Default to current day
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [selectedDay, setSelectedDay] = useState(DAYS[todayIndex] || 'Mon');

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      console.log("Fetching Menu for Student...");
      const data = await fetchMenu();
      console.log("Menu Received:", data); // Debug log
      setMenu(data || {}); // Ensure it's never null
    } catch (e) {
      console.error("Failed to load menu", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMenu();
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  // SAFETY CHECK: If data for the selected day doesn't exist, show "Not Updated"
  const currentMenu = menu[selectedDay] || { 
    Breakfast: { item: 'Not updated', time: '--' },
    Lunch: { item: 'Not updated', time: '--' }, 
    Snacks: { item: 'Not updated', time: '--' }, 
    Dinner: { item: 'Not updated', time: '--' } 
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: colors.primary }}>Weekly Menu</Text>
        <Text variant="bodyMedium" style={{ color: colors.secondary }}>Check what's cooking</Text>
      </View>

      {/* Day Selector */}
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

      {/* Menu List */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <MealCard type="Breakfast" item={currentMenu.Breakfast?.item} time={currentMenu.Breakfast?.time} icon="coffee" />
        <MealCard type="Lunch" item={currentMenu.Lunch?.item} time={currentMenu.Lunch?.time} icon="food-variant" />
        <MealCard type="Snacks" item={currentMenu.Snacks?.item} time={currentMenu.Snacks?.time} icon="cupcake" />
        <MealCard type="Dinner" item={currentMenu.Dinner?.item} time={currentMenu.Dinner?.time} icon="food-turkey" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, paddingTop: 50, backgroundColor: 'white', marginBottom: 10 },
  dayScroll: { paddingHorizontal: 16, gap: 8 },
  content: { padding: 16 },
});