import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CoinDisplay } from '@/components/ui/CoinDisplay';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 20, gap: 24 }}>
          <View className="items-center gap-2">
            <ThemedText type="title">Design System</ThemedText>
            <ThemedText className="text-center text-textMuted">
              Core components and theme verification
            </ThemedText>
          </View>

          <Card className="gap-4">
            <ThemedText type="subtitle">Typography & Colors</ThemedText>
            <ThemedText>Default Text</ThemedText>
            <ThemedText type="defaultSemiBold">SemiBold Text</ThemedText>
            <ThemedText type="link">Link Text</ThemedText>
            <ThemedText className="text-primary font-bold">Primary Color</ThemedText>
            <ThemedText className="text-textMuted">Muted Text</ThemedText>
          </Card>

          <Card className="gap-4">
            <ThemedText type="subtitle">Buttons</ThemedText>
            <Button label="Primary Button" onPress={() => {}} />
            <Button label="Secondary Button" variant="secondary" onPress={() => {}} />
            <Button label="Ghost Button" variant="ghost" onPress={() => {}} />
            <Button label="Outline Button" variant="outline" onPress={() => {}} />
          </Card>

          <Card className="gap-4">
            <ThemedText type="subtitle">Data Display</ThemedText>
            <View className="flex-row justify-between items-center">
              <Avatar name="User Name" />
              <CoinDisplay value={1250} />
            </View>
            <View className="flex-row gap-2 flex-wrap">
              <Badge label="Early Adopter" />
              <Badge label="Speedster" />
              <Badge label="Socialite" />
            </View>
          </Card>

          <Card className="gap-4 items-center">
            <ThemedText type="subtitle">Progress Visualization</ThemedText>
            <View className="flex-row gap-8">
              <ProgressRing progress={0.75} label="75%" />
              <ProgressRing progress={0.3} size={60} strokeWidth={6} />
            </View>
          </Card>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
