import * as Haptics from 'expo-haptics';

export function tap() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function medium() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export function heavy() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

export function success() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export function warning() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}

export function error() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}
