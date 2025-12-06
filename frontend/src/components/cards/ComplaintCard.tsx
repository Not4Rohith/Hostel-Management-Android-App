import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Chip, IconButton, useTheme } from 'react-native-paper';

interface ComplaintCardProps {
  title: string;
  category: string;
  status: string; // 'Pending' | 'Resolved'
  date: string;
}

export default function ComplaintCard({ title, category, status, date }: ComplaintCardProps) {
  const theme = useTheme();
  const isResolved = status === 'Resolved';

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.row}>
        {/* Left Side: Info */}
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{title}</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>{date} • {category}</Text>
        </View>

        {/* Right Side: Status Chip */}
        <Chip 
          icon={isResolved ? "check" : "clock"} 
          style={{ backgroundColor: isResolved ? '#E8F5E9' : '#FFEBEE' }}
          textStyle={{ color: isResolved ? '#2E7D32' : '#C62828' }}
        >
          {status}
        </Chip>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});