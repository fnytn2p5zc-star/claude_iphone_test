import { useState, useEffect, useCallback } from 'react';
import { fetchWeather, fetchAirQuality, reverseGeocode } from '../utils/api';

export function useWeather(location, setLocation) {
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const load = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    setError(null);

    try {
      const [weatherData, aqData] = await Promise.all([
        fetchWeather(location.lat, location.lon),
        fetchAirQuality(location.lat, location.lon).catch(() => null),
      ]);

      setWeather(weatherData);
      setAirQuality(aqData);
      setLastUpdate(new Date());

      // Resolve city name if missing
      if (!location.name) {
        const name = await reverseGeocode(location.lat, location.lon);
        setLocation({ ...location, name });
      }
    } catch (err) {
      setError(err.message || '获取天气数据失败');
    } finally {
      setLoading(false);
    }
  }, [location, setLocation]);

  useEffect(() => {
    load();
  }, [load]);

  return { weather, airQuality, loading, error, lastUpdate, refresh: load };
}
