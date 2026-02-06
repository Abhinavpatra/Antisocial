import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Avatar } from '@/components/ui/Avatar';
import { CoinDisplay } from '@/components/ui/CoinDisplay';
import { NetworkErrorView } from '@/components/ui/NetworkErrorView';
import { useChallenges } from '@/hooks/useChallenges';
import { useMe } from '@/hooks/useMe';
import { useAppTheme } from '@/hooks/useTheme';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TrendingCard = {
  id: string;
  title: string;
  description: string;
  duration: string;
  reward: string;
  image: string;
};

const trendingCards: TrendingCard[] = [
  {
    id: 'instagram-detox',
    title: 'Instagram Detox',
    description: 'Complete reset. No posting, no scrolling for a full day.',
    duration: '24h',
    reward: '150',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD44yUhjNyw51AV0n_NVJqNixuaniXK3e_WoejZCfz2ypou3PtPtL1oyu0wKNKxmAY_Yw9MslDfuxzWl8VD_hmEGkHN7VpjjFAsrCkAN5f0MVtCmHGqnzYT8M-A_IDH62DNkZmxdEXwYucsL_6h91DfHIsibJ-SwmKsNknRoEIHDNklsIgfAfxJAlSRrBIf4U9wiVLjD2CiUZBk3fJD5hfds6su28aMYlkba20nNCXni8aVfEKW5al1wBtxfolypA3p83ZgeISMDFY',
  },
  {
    id: 'deep-work',
    title: 'Deep Work',
    description: 'Turn off notifications and focus on a single task.',
    duration: '4h',
    reward: '80',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtRcfTxEd3PrmYgmXXWEkH-TlJAk9CejD8EOInW3sABQwOp6YRwAdakz8s13Kb0oRuVpiJWvx0liXYV8HfImhog-b5CPAgsz6VXlYJX3c1u4heHtw6L74nXaO2ooysG05M5oToscIq-sSzU-WbSLHuepoioDxsuRqDjm0fzffV8ntBLvHKBxsJIBEGPuo4__m-iSzkoXjV4Ad-GLvVOLPSsVn-sNQdcT1odvpb5U6i-RxNKK9WhYonrZU_FM1VUWJsxvRA0_-kacA',
  },
];

export function ChallengesScreen() {
  const { colors } = useAppTheme();
  const { me, refetch: refetchMe } = useMe();
  const { userId, challenges, actions, networkError, refetch, isLoading } = useChallenges();

  const active = challenges.find((c) => c.status === 'active' && c.my_status === 'joined') ?? null;

  if (networkError && challenges.length === 0 && !isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView className="flex-1">
          <ChallengesHeader
            name={me?.profile?.display_name ?? me?.profile?.username ?? '—'}
            coins={me?.coins ?? 0}
            avatarUrl={me?.profile?.avatar_url ?? undefined}
          />
          <NetworkErrorView onRetry={refetch} />
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1">
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ChallengesHeader
            name={me?.profile?.display_name ?? me?.profile?.username ?? '—'}
            coins={me?.coins ?? 0}
            avatarUrl={me?.profile?.avatar_url ?? undefined}
          />
          <CurrentFocusCard
            active={active}
            onGiveUp={async () => {
              if (!active) return;
              await actions.forfeit(active.id);
              await refetchMe();
            }}
            onCheckIn={async () => {
              if (!active) return;
              await actions.complete(active.id);
              await refetchMe();
            }}
          />
          <TrendingSection
            cards={trendingCards}
            onAdd={async (card) => {
              if (!userId) return;
              await actions.create({
                title: card.title,
                description: card.description,
                coin_reward: Number(card.reward) || 0,
              });
              await refetchMe();
            }}
          />
          <RequestsSection />
        </ScrollView>

        <Pressable
          style={({ pressed }) => [
            styles.fab,
            { backgroundColor: colors.primary, shadowColor: colors.shadow },
            pressed && styles.fabPressed,
          ]}
          onPress={async () => {
            if (!userId) return;
            await actions.create({
              title: 'New Challenge',
              description: 'Custom challenge',
              coin_reward: 50,
            });
            await refetchMe();
          }}
        >
          <FontAwesome5 name="plus" size={18} color={colors.text} />
        </Pressable>
      </ThemedView>
    </SafeAreaView>
  );
}

function ChallengesHeader({
  name,
  coins,
  avatarUrl,
}: {
  name: string;
  coins: number;
  avatarUrl?: string;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={[styles.avatarRing, { borderColor: colors.ring }]}>
          <Avatar size={36} name={name} uri={avatarUrl} />
        </View>
        <ThemedText className="text-xl font-semibold">Challenges</ThemedText>
      </View>
      <View style={[styles.coinPill, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
        <CoinDisplay value={coins} />
      </View>
    </View>
  );
}

function CurrentFocusCard({
  active,
  onGiveUp,
  onCheckIn,
}: {
  active: { title: string; description: string | null } | null;
  onGiveUp: () => void;
  onCheckIn: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText className="text-base font-semibold">Current Focus</ThemedText>
        <ThemedText className="text-xs text-textMuted">View All</ThemedText>
      </View>
      <View style={[styles.focusCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
        <View style={styles.focusHeader}>
          <View style={styles.focusInfo}>
            <View
              style={[
                styles.focusIconWrap,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <FontAwesome5 name="stopwatch" size={18} color={colors.textMuted} />
            </View>
            <View>
              <ThemedText className="text-lg font-semibold">
                {active?.title ?? 'No active challenge'}
              </ThemedText>
              <ThemedText className="text-xs text-textMuted">
                {active?.description ?? 'Start one from Trending below.'}
              </ThemedText>
            </View>
          </View>
          <View style={[styles.hardPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ThemedText className="text-[10px] text-textMuted">HARD</ThemedText>
          </View>
        </View>

        <View style={styles.progressBlock}>
          <View style={styles.progressRow}>
            <ThemedText className="text-xs text-textMuted">Progress</ThemedText>
            <ThemedText className="text-xs font-semibold">75%</ThemedText>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.surface }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.primary }]} />
          </View>
          <View style={styles.progressMeta}>
            <ThemedText className="text-[11px] text-textMuted">Started 1h 15m ago</ThemedText>
            <ThemedText className="text-[11px] text-textMuted">45m left</ThemedText>
          </View>
        </View>

        <View style={styles.focusActions}>
          <Pressable
            style={[styles.secondaryButton, { backgroundColor: colors.surface }]}
            onPress={onGiveUp}
            disabled={!active}
          >
            <ThemedText className="text-xs text-textMuted">Give Up</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={onCheckIn}
            disabled={!active}
          >
            <FontAwesome5 name="check-circle" size={14} color={colors.text} />
            <ThemedText className="text-xs font-semibold" style={{ color: colors.text }}>
              Check In
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function TrendingSection({
  cards,
  onAdd,
}: {
  cards: TrendingCard[];
  onAdd: (card: TrendingCard) => void;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.section}>
      <View style={styles.trendingHeader}>
        <FontAwesome5 name="chart-line" size={16} color={colors.primary} />
        <ThemedText className="text-base font-semibold">Trending Now</ThemedText>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingRow}>
        {cards.map((card) => (
          <View key={card.id} style={[styles.trendingCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
            <View style={styles.trendingImageWrap}>
              <Image source={{ uri: card.image }} style={styles.trendingImage} />
              <View style={styles.trendingOverlay} />
              <View style={styles.durationPill}>
                <ThemedText className="text-[10px] text-white">{card.duration}</ThemedText>
              </View>
            </View>
            <View style={styles.trendingBody}>
              <ThemedText className="text-sm font-semibold">{card.title}</ThemedText>
              <ThemedText className="text-[11px] text-textMuted">{card.description}</ThemedText>
              <View style={styles.trendingFooter}>
                <View style={styles.rewardRow}>
                  <FontAwesome5 name="coins" size={12} color={colors.primary} />
                  <ThemedText className="text-xs text-textMuted">{card.reward}</ThemedText>
                </View>
                <Pressable
                  style={[styles.addButton, { backgroundColor: colors.surface }]}
                  onPress={() => onAdd(card)}
                >
                  <FontAwesome5 name="plus" size={12} color={colors.textMuted} />
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function RequestsSection() {
  const { colors } = useAppTheme();

  return (
    <View style={styles.section}>
      <View style={styles.trendingHeader}>
        <FontAwesome5 name="fire" size={16} color={colors.textMuted} />
        <ThemedText className="text-base font-semibold">Requests</ThemedText>
      </View>
      <View style={[styles.requestCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
        <Avatar size={36} name="Alex" />
        <View style={styles.requestCopy}>
          <ThemedText className="text-sm">
            <ThemedText className="text-sm font-semibold">Alex</ThemedText> dared you
          </ThemedText>
          <ThemedText className="text-xs text-textMuted">
            “No TikTok for 3 hours straight!”
          </ThemedText>
        </View>
        <View style={styles.requestActions}>
          <Pressable style={[styles.requestIcon, { backgroundColor: colors.surface }]}>
            <FontAwesome5 name="times" size={12} color={colors.textMuted} />
          </Pressable>
          <Pressable style={[styles.requestIcon, { backgroundColor: colors.primary }]}>
            <FontAwesome5 name="check" size={12} color={colors.text} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  focusCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  focusHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  focusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  focusIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hardPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  progressBlock: {
    gap: 8,
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBar: {
    height: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    width: '75%',
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  focusActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButton: {
    flex: 2,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  trendingRow: {
    paddingRight: 20,
    gap: 16,
  },
  trendingCard: {
    width: 220,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  trendingImageWrap: {
    height: 112,
  },
  trendingImage: {
    width: '100%',
    height: '100%',
  },
  trendingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  durationPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendingBody: {
    padding: 12,
    gap: 6,
  },
  trendingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requestCopy: {
    flex: 1,
    gap: 4,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  requestIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 90,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
  },
  fabPressed: {
    transform: [{ scale: 0.96 }],
  },
});
