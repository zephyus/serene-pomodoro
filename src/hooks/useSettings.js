import { useState, useEffect } from 'react';

const DEFAULTS = {
  focusDuration:      25,
  shortBreakDuration:  5,
  longBreakDuration:  15,
  notificationType:  'chime',
  ambientSound:      'none',
};

const STORAGE_KEY = 'serene-settings';

const useSettings = () => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting };
};

export default useSettings;
