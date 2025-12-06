import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Avatar, useTheme } from 'react-native-paper';

interface MealCardProps {
  type: string; // e.g., "Breakfast"
  item: string; // e.g., "Idli Sambar"
  time: string; // e.g., "7:30 - 9:00 AM"
  icon: string; // Material Community Icon name
}

export default function MealCard({ type, item, time, icon }: MealCardProps) {
  const theme = useTheme();

  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content style={styles.row}>
        {/* Icon Box */}
        <View style={[styles.iconBox, { backgroundColor: theme.colors.secondaryContainer }]}>
          <Avatar.Icon 
            size={36} 
            icon={icon} 
            style={{ backgroundColor: 'transparent' }} 
            color={theme.colors.primary}
          />
        </View>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.headerRow}>
            <Text variant="labelLarge" style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>
              {type.toUpperCase()}
            </Text>
            <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
              {time}
            </Text>
          </View>
          <Text variant="titleMedium" style={{ marginTop: 4 }}>
            {item}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: 'white',
    borderColor: '#E0E0E0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});