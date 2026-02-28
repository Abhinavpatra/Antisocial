import { useAppTheme } from '@/hooks/useTheme';
import React, { useState } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type UsernameSlideProps = {
  onSubmit: (username: string, displayName: string) => void;
  isLoading: boolean;
  defaultUsername?: string;
};

export function UsernameSlide({ onSubmit, isLoading, defaultUsername }: UsernameSlideProps) {
  const { colors } = useAppTheme();
  const [username, setUsername] = useState(defaultUsername ?? '');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = () => {
    if (username.trim().length >= 3) {
      onSubmit(username.trim(), displayName.trim() || username.trim());
    }
  };

  const isValid = username.trim().length >= 3;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { width: SCREEN_WIDTH }]}>
          <Text style={[styles.title, { color: colors.text }]}>Create Your Profile</Text>
          <Text style={[styles.description, { color: colors.textMuted }]}>
            Choose a username to get started. You can always change it later.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textMuted }]}>Username</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceAlt,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Choose a username"
              placeholderTextColor={colors.textMuted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
            />
            <Text style={[styles.hint, { color: colors.textMuted }]}>
              {username.length}/20 characters (min 3)
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textMuted }]}>Display Name (optional)</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceAlt,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="How should we call you?"
              placeholderTextColor={colors.textMuted}
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              maxLength={30}
            />
          </View>

          <View
            style={[
              styles.button,
              { backgroundColor: isValid ? colors.primary : colors.surfaceAlt },
              { opacity: isLoading ? 0.7 : 1 },
            ]}
            onTouchEnd={isValid && !isLoading ? handleSubmit : undefined}
          >
            <Text
              style={[
                styles.buttonText,
                { color: isValid ? colors.text : colors.textMuted },
              ]}
            >
              {isLoading ? 'Creating...' : 'Get Started'}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
