const BASE_URL = 'https://api.open-meteo.com/v1';

export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'pressure_msl',
      'cloud_cover',
      'is_day',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
      'relative_humidity_2m',
      'precipitation_probability',
      'wind_speed_10m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'uv_index_max',
      'precipitation_probability_max',
      'precipitation_sum',
      'wind_speed_10m_max',
      'sunrise',
      'sunset',
    ].join(','),
    timezone: 'auto',
    forecast_days: '10',
  });

  const res = await fetch(`${BASE_URL}/forecast?${params}`);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  return res.json();
}

export async function fetchAirQuality(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      'pm2_5',
      'pm10',
      'carbon_monoxide',
      'nitrogen_dioxide',
      'ozone',
      'us_aqi',
    ].join(','),
    timezone: 'auto',
  });

  const res = await fetch(`${BASE_URL}/air-quality?${params}`);
  if (!res.ok) throw new Error(`AQ API error: ${res.status}`);
  return res.json();
}

export async function searchCities(query) {
  const params = new URLSearchParams({
    name: query,
    count: '8',
    language: 'zh',
    format: 'json',
  });

  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
  if (!res.ok) throw new Error('Geocoding error');
  const data = await res.json();
  return data.results || [];
}

export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=zh`
    );
    const data = await res.json();
    const addr = data.address;
    return addr.city || addr.town || addr.county || addr.state || '未知位置';
  } catch {
    return '未知位置';
  }
}
