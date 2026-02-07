import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from './hooks/useLocation';
import { useWeather } from './hooks/useWeather';

import WeatherHero from './components/WeatherHero';
import Suggestions from './components/Suggestions';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';
import AirQuality from './components/AirQuality';
import SunriseSunset from './components/SunriseSunset';
import WeatherChart from './components/WeatherChart';
import Calendar from './components/Calendar';
import CitySearch from './components/CitySearch';
import TabBar from './components/TabBar';

import './App.css';

export default function App() {
  const { location, detectLocation, setCity, setLocation } = useLocation();
  const { weather, airQuality, loading, error, lastUpdate, refresh } = useWeather(location, setLocation);
  const [activeTab, setActiveTab] = useState('home');
  const [showSearch, setShowSearch] = useState(false);

  // Auto-detect location on first load
  useEffect(() => {
    if (!location) detectLocation();
  }, [location, detectLocation]);

  const handleCitySelect = (city) => {
    setCity(city);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <button className="header-location" onClick={() => setShowSearch(true)}>
          <span className="loc-icon">📍</span>
          <span className="loc-name">{location?.name || '定位中...'}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div className="header-right">
          {lastUpdate && (
            <span className="last-update">
              {lastUpdate.getHours().toString().padStart(2, '0')}:
              {lastUpdate.getMinutes().toString().padStart(2, '0')} 更新
            </span>
          )}
          <button
            className={`refresh-btn ${loading ? 'spinning' : ''}`}
            onClick={refresh}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M23 4v6h-6M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
          </button>
        </div>
      </header>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="error-banner"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="app-content">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <WeatherHero weather={weather} />
              <Suggestions weather={weather} />
              <HourlyForecast weather={weather} />
              <AirQuality airQuality={airQuality} />
              <SunriseSunset weather={weather} />
            </motion.div>
          )}

          {activeTab === 'forecast' && (
            <motion.div
              key="forecast"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <WeatherChart weather={weather} />
              <WeeklyForecast weather={weather} />
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Calendar weather={weather} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Tab Bar */}
      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      {/* City Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <CitySearch onSelect={handleCitySelect} onClose={() => setShowSearch(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
