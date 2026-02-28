import { OnboardingSlide } from '@/components/onboarding/OnboardingSlide';
import { PermissionSlide } from '@/components/onboarding/PermissionSlide';
import { UsernameSlide } from '@/components/onboarding/UsernameSlide';
import { useAppTheme } from '@/hooks/useTheme';
import { usePermissions } from '@/hooks/usePermissions';
import { getOrCreateDevUserId } from '@/services/session';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ScrollView as ScrollViewType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ONBOARDING_COMPLETE_KEY = 'timerapp.onboardingComplete';

async function setOnboardingComplete(): Promise<void> {
  try {
    await SecureStore.setItemAsync(ONBOARDING_COMPLETE_KEY, 'true');
  } catch {
    // ignore
  }
}

const SLIDES = [
  {
    key: 'welcome',
    title: 'Welcome to TimerApp',
    description:
      'Track your screen time, compete with friends, and build healthier digital habits.',
    icon: 'clock',
  },
  {
    key: 'challenges',
    title: 'Take on Challenges',
    description:
      'Join challenges to reduce your screen time and earn rewards. Compete with friends or go solo.',
    icon: 'trophy',
  },
  {
    key: 'leaderboard',
    title: 'Climb the Leaderboard',
    description:
      'See how you rank against friends and the world. Less screen time = higher rank!',
    icon: 'chart-line',
  },
];

type OnboardingStep = 'intro' | 'permission' | 'username';

export function OnboardingScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { hasUsageAccess, requestUsageStatsPermission, recheckPermissions } = usePermissions();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('intro');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const scrollViewRef = useRef<ScrollViewType>(null);

  const handleNextSlide = useCallback(() => {
    if (currentSlide < SLIDES.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      // Move to permission step
      setCurrentStep('permission');
    }
  }, [currentSlide]);

  const handlePermissionRequest = useCallback(async () => {
    if (Platform.OS === 'android') {
      setIsRequestingPermission(true);
      await requestUsageStatsPermission();
      // The user will return from settings, we'll re-check in app state listener
      // For now, move forward after a delay or when they return
    }
  }, [requestUsageStatsPermission]);

  const handleSkipPermission = useCallback(() => {
    setCurrentStep('username');
  }, []);

  const handleUsernameSubmit = useCallback(
    async (username: string, displayName: string) => {
      setIsCreatingUser(true);
      try {
        // Create user via dev auth (will be replaced with proper auth later)
        await getOrCreateDevUserId();
        
        // Mark onboarding as complete
        await setOnboardingComplete();
        
        // Navigate to main app
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Failed to create user:', error);
      } finally {
        setIsCreatingUser(false);
      }
    },
    [router],
  );

  // Re-check permissions when returning to app
  React.useEffect(() => {
    if (currentStep === 'permission' && isRequestingPermission) {
      const checkInterval = setInterval(async () => {
        const hasAccess = await recheckPermissions();
        if (hasAccess) {
          setIsRequestingPermission(false);
          setCurrentStep('username');
        }
      }, 1000);
      return () => clearInterval(checkInterval);
    }
  }, [currentStep, isRequestingPermission, recheckPermissions]);

  if (currentStep === 'permission') {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <PermissionSlide
            onAllow={handlePermissionRequest}
            onSkip={handleSkipPermission}
            isRequesting={isRequestingPermission}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (currentStep === 'username') {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <UsernameSlide
            onSubmit={handleUsernameSubmit}
            isLoading={isCreatingUser}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        >
          {SLIDES.map((slide, index) => (
            <View key={slide.key} style={styles.slideWrapper}>
              <OnboardingSlide
                title={slide.title}
                description={slide.description}
                icon={slide.icon}
              />
            </View>
          ))}
        </ScrollView>

        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentSlide ? colors.primary : `${colors.primary}40`,
                },
              ]}
            />
          ))}
        </View>

        {/* Navigation buttons */}
        <View style={styles.buttonContainer}>
          <View
            style={[styles.button, { backgroundColor: colors.primary }]}
            onTouchEnd={handleNextSlide}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              {currentSlide < SLIDES.length - 1 ? 'Next' : 'Get Started'}
            </Text>
          </View>
        </View>

        {/* Skip button */}
        {currentSlide < SLIDES.length - 1 && (
          <View style={styles.skipContainer}>
            <Text
              style={[styles.skipText, { color: colors.textMuted }]}
              onPress={() => setCurrentStep('permission')}
            >
              Skip
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideWrapper: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skipContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  skipText: {
    fontSize: 16,
  },
});
