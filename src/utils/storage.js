import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = 'echopath_v2';
export async function load() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export async function save(data) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}
