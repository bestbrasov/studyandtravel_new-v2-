import { ref } from 'vue';
import messages from './locales/messages.json' with { type: 'json' };

const messageIds = new Map(Object.entries(messages).map(([id, message]) => [message.ro, id]));
export const languageStorageKey = 'study-travel-language';

export function translateMessage(id, language = 'ro') {
  return messages[id]?.[language] ?? messages[id]?.ro ?? id;
}

export function translateContent(text, language = 'ro') {
  const id = messageIds.get(text);
  if (id) return translateMessage(id, language);
  // Keep the original season dates intact; only the label changes.
  if (language === 'en' && typeof text === 'string') return text.replace(/^Înscrieri:/, 'Applications:');
  return text;
}

export function readLanguage(storage) {
  try { return storage?.getItem(languageStorageKey) === 'en' ? 'en' : 'ro'; }
  catch { return 'ro'; }
}

export function useLanguage() {
  let storage;
  try { storage = window.localStorage; } catch { /* Storage can be disabled. */ }
  const locale = ref(readLanguage(storage));
  const t = id => translateMessage(id, locale.value);
  const translateText = text => translateContent(text, locale.value);
  function toggleLanguage() {
    locale.value = locale.value === 'ro' ? 'en' : 'ro';
    try { storage?.setItem(languageStorageKey, locale.value); } catch { /* Switching still works. */ }
  }
  return { locale, t, translateText, toggleLanguage };
}
