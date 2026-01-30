import { render } from '@testing-library/react-native';

/**
 * Custom render function that includes providers (Theme, Auth, etc.)
 * This will be expanded as we add more context providers.
 */
export function renderWithProviders(ui: React.ReactElement, options = {}) {
  return render(ui, options);
}

// Mock factories will be added here as models are defined
export const MockFactories = {
  // Placeholder for user, challenge, usage mocks
};
