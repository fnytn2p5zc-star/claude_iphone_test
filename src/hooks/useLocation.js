import { useState, useCallback } from 'react';

const STORAGE_KEY = 'weather_app_location';
const DEFAULT_LOCATION = { lat: 39.9042, lon: 116.4074, name: '北京' };

export function useLocation() {
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveLocation = useCallback((loc) => {
    setLocation(loc);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch { /* ignore */ }
  }, []);

  const detectLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      saveLocation(DEFAULT_LOCATION);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        saveLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          name: null, // will be resolved later
        });
        setLoading(false);
      },
      () => {
        saveLocation(DEFAULT_LOCATION);
        setError('定位失败，使用默认城市');
        setLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }, [saveLocation]);

  const setCity = useCallback((city) => {
    saveLocation({
      lat: city.latitude,
      lon: city.longitude,
      name: city.name,
    });
  }, [saveLocation]);

  return { location, loading, error, detectLocation, setCity, setLocation: saveLocation };
}
