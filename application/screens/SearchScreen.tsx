import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Avatar } from '@/components/ui/Avatar';
import { NetworkErrorView } from '@/components/ui/NetworkErrorView';
import { useFriendSuggestions, useFriends, useUserSearch } from '@/hooks/useSocial';
import { useAppTheme } from '@/hooks/useTheme';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SearchUserRow = {
  user_id: string;
  id?: string;
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  subtitle?: string;
  status?: 'add' | 'cancel';
  mutual_friends_count?: number;
};

export function SearchScreen() {
  const { colors } = useAppTheme();
  const { results, setQuery, query, networkError: searchNetworkError } = useUserSearch();
  const { incoming, outgoing, actions, networkError: friendsNetworkError, refetch: refetchFriends } = useFriends();
  const { suggestions, refetch: refetchSuggestions } = useFriendSuggestions();

  const pendingCount = incoming.length + outgoing.length;
  const isOffline = searchNetworkError || friendsNetworkError;

  // Convert API suggestions to display format
  const suggestedFriends: SearchUserRow[] = suggestions.map((s) => ({
    user_id: s.user_id,
    username: s.username,
    display_name: s.display_name,
    avatar_url: s.avatar_url,
    subtitle: s.mutual_friends_count > 0 
      ? `${s.mutual_friends_count} mutual friend${s.mutual_friends_count !== 1 ? 's' : ''}`
      : 'Active user',
    status: 'add' as const,
    mutual_friends_count: s.mutual_friends_count,
  }));

  if (isOffline && results.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView className="flex-1">
          <NetworkErrorView onRetry={() => { void refetchFriends(); void refetchSuggestions(); }} />
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1">
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Pressable style={styles.headerIcon}>
              <FontAwesome5 name="arrow-left" size={18} color={colors.text} />
            </Pressable>
            <ThemedText className="text-lg font-bold">Find Friends</ThemedText>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.searchWrap}>
            <View style={[styles.searchBar, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
              <FontAwesome5 name="search" size={14} color={colors.textMuted} />
              <TextInput
                placeholder="Search by username"
                placeholderTextColor={colors.textMuted}
                style={[styles.searchInput, { color: colors.text }]}
                value={query}
                onChangeText={setQuery}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Pressable
              style={[
                styles.pendingCard,
                { backgroundColor: `${colors.primary}1A`, borderColor: `${colors.primary}33` },
              ]}
            >
              <View style={styles.pendingLeft}>
                <View style={[styles.pendingIcon, { backgroundColor: `${colors.primary}33` }]}>
                  <FontAwesome5 name="user-plus" size={14} color={colors.primary} />
                </View>
                <ThemedText className="text-base font-semibold">Pending Requests</ThemedText>
              </View>
              <View style={styles.pendingRight}>
                <View style={[styles.pendingBadge, { backgroundColor: colors.primary }]}>
                  <ThemedText className="text-xs font-bold" style={{ color: colors.text }}>
                    {pendingCount}
                  </ThemedText>
                </View>
                <FontAwesome5 name="chevron-right" size={12} color={colors.primary} />
              </View>
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText className="text-lg font-bold">Suggested Friends</ThemedText>
            <ThemedText className="text-xs font-semibold" style={{ color: colors.primary }}>
              SEE ALL
            </ThemedText>
          </View>

          <View style={styles.list}>
            {(results.length
              ? (results as unknown as SearchUserRow[])
              : suggestedFriends
            ).map((friend) => (
              <View
                key={friend.user_id ?? friend.id}
                style={[styles.friendCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
              >
                <View style={styles.friendAvatar}>
                  <Avatar size={44} name={friend.username ?? friend.user_id ?? ''} uri={friend.avatar_url ?? undefined} />
                </View>
                <View style={styles.friendInfo}>
                  <ThemedText className="text-base font-semibold">
                    {friend.username ?? friend.id}
                  </ThemedText>
                  <ThemedText className="text-xs text-textMuted">
                    {friend.subtitle ?? friend.display_name ?? ''}
                  </ThemedText>
                </View>
                <Pressable
                  style={[
                    styles.friendAction,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => {
                    const targetUserId = friend.user_id ?? friend.id;
                    if (targetUserId) void actions.request(String(targetUserId));
                  }}
                >
                  <ThemedText
                    className="text-sm font-semibold"
                    style={{ color: colors.text }}
                  >
                    Add
                  </ThemedText>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  searchBar: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  pendingCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pendingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pendingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionHeader: {
    marginTop: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: {
    marginTop: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  friendCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  friendAvatar: {
    position: 'relative',
  },
  friendInfo: {
    flex: 1,
    gap: 4,
  },
  friendAction: {
    minWidth: 80,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
