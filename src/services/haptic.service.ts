import * as Haptics from 'expo-haptics';

export class HapticService {
  static light(): void {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  static medium(): void {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  static heavy(): void {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  static success(): void {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  static error(): void {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  static warning(): void {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  static selection(): void {
    Haptics.selectionAsync();
  }
}
