import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Avatar } from '@/components/ui/Avatar';
import { useMe } from '@/hooks/useMe';
import { useFriends } from '@/hooks/useSocial';
import { useAppTheme } from '@/hooks/useTheme';
import { FontAwesome5 } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const badges = ['Early Bird', 'Night Owl', 'Zen Master', 'Locked'];

export function ProfileScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { me } = useMe();
  const { friends, incoming } = useFriends();

  const displayName = me?.profile?.display_name ?? me?.profile?.username ?? '—';
  const username = me?.profile?.username;
  const avatarUrl = me?.profile?.avatar_url ?? undefined;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1">
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <ThemedText className="text-xl font-semibold">My Profile</ThemedText>
            <Pressable style={styles.settingsIcon} onPress={() => router.push('/settings' as Href)}>
              <FontAwesome5 name="cog" size={18} color={colors.text} />
            </Pressable>
          </View>

          <View style={styles.profileCard}>
            <View style={[styles.profileRing, { borderColor: colors.ring }]}>
              <Avatar size={86} name={displayName} uri={avatarUrl} />
              <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                <FontAwesome5 name="pen" size={12} color={colors.text} />
              </View>
            </View>
            <ThemedText className="text-2xl font-bold mt-4">{displayName}</ThemedText>
            <ThemedText className="text-sm text-textMuted">
              {username ? `@${username}` : ' '}
            </ThemedText>
          </View>

          <View style={styles.statsRow}>
            <StatPill value="124h" label="Total Focus" />
            <StatPill value="12" label="Day Streak" />
            <StatPill value="#42" label="Rank" />
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText className="text-base font-semibold">Recent Badges</ThemedText>
            <ThemedText className="text-xs font-semibold" style={{ color: colors.primary }}>
              View All
            </ThemedText>
          </View>

          <View style={styles.badgeRow}>
            {badges.map((badge) => (
              <View
                key={badge}
                style={[
                  styles.badgePill,
                  { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                ]}
              >
                <FontAwesome5
                  name={badge === 'Locked' ? 'lock' : 'award'}
                  size={14}
                  color={badge === 'Locked' ? colors.textMuted : colors.primary}
                />
                <ThemedText className="text-[10px] text-textMuted">{badge}</ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.actionList}>
            <ActionRow
              icon="user-cog"
              label="Account Settings"
              onPress={() => router.push('/settings' as Href)}
            />
            <ActionRow icon="history" label="Activity History" onPress={() => {}} />
            <ActionRow
              icon="user-friends"
              label={`Friends (${friends.length})${incoming.length ? ` • ${incoming.length} requests` : ''}`}
              onPress={() => router.push('/search' as Href)}
            />
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

function StatPill({ value, label }: { value: string; label: string }) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.statPill, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
      <ThemedText className="text-lg font-bold">{value}</ThemedText>
      <ThemedText className="text-[10px] text-textMuted uppercase tracking-widest">
        {label}
      </ThemedText>
    </View>
  );
}

function ActionRow({
  icon,
  label,
  onPress,
}: {
  icon: 'user-cog' | 'history' | 'user-friends';
  label: string;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.actionRow, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
    >
      <View style={[styles.actionIcon, { backgroundColor: colors.surface }]}>
        <FontAwesome5 name={icon} size={16} color={colors.textMuted} />
      </View>
      <ThemedText className="text-sm font-semibold">{label}</ThemedText>
      <FontAwesome5 name="chevron-right" size={12} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  profileRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    marginTop: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statPill: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
  sectionHeader: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: {
    marginTop: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 12,
  },
  badgePill: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionList: {
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 12,
  },
  actionRow: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
