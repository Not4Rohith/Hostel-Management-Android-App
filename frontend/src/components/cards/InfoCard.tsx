import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Avatar, useTheme } from 'react-native-paper';

interface InfoCardProps {
  title: string;
  value: string;
  icon: string;
  color?: string;
}

export default function InfoCard({ title, value, icon, color }: InfoCardProps) {
  const theme = useTheme();
  
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.content}>
        <Avatar.Icon 
          size={48} 
          icon={icon} 
          style={{ backgroundColor: color || theme.colors.primaryContainer }} 
          color={theme.colors.primary}
        />
        <View style={styles.textContainer}>
          <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>{title}</Text>
          <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>{value}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    marginHorizontal: 5,
    flex: 1, // Allows cards to share space in a row
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 15,
  },
});