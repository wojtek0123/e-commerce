import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCoreStore = defineStore('core', () => {
  const isDark = ref(false);
  const isExpanded = ref(true);
  const timer = ref<number | null>(null);
  const shouldLabelBeShowed = ref(true);

  function getTheme() {
    const isUserPreferDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    const isPreferableThemeDark = JSON.parse(
      localStorage.getItem('isDark') ?? 'null',
    );

    const isDarkTheme =
      isPreferableThemeDark === null ? isUserPreferDark : isPreferableThemeDark;

    setTheme(isDarkTheme ? 'dark' : 'light');
  }

  function getExpanded() {
    const isUserPreferExpanded = JSON.parse(
      localStorage.getItem('isExpanded') || 'false',
    ) as boolean;

    isExpanded.value = isUserPreferExpanded;
    shouldLabelBeShowed.value = isUserPreferExpanded;
  }

  function setTheme(theme: 'dark' | 'light') {
    isDark.value = theme === 'dark';

    if (theme === 'dark') {
      document.querySelector('html')?.classList.add('dark');
    }

    localStorage.setItem('isDark', JSON.stringify(isDark.value));
  }

  function toggleTheme() {
    isDark.value = !isDark.value;

    document.querySelector('html')?.classList.toggle('dark');

    localStorage.setItem('isDark', JSON.stringify(isDark.value));
  }

  function toggleExpandCollapse() {
    isExpanded.value = !isExpanded.value;

    if (timer.value) timer.value = null;

    timer.value = setTimeout(
      () => {
        shouldLabelBeShowed.value = isExpanded.value;
      },
      isExpanded.value ? 150 : 0,
    );

    localStorage.setItem('isExpanded', JSON.stringify(isExpanded.value));
  }

  return {
    isDark,
    isExpanded,
    shouldLabelBeShowed,
    getTheme,
    setTheme,
    toggleTheme,
    toggleExpandCollapse,
    getExpanded,
  };
});
