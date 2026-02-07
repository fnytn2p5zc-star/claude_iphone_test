import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchCities } from '../utils/api';

export default function CitySearch({ onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    clearTimeout(timerRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const cities = await searchCities(value.trim());
        setResults(cities);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelect = (city) => {
    onSelect(city);
    onClose();
  };

  return (
    <motion.div
      className="search-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="search-panel"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="search-header">
          <div className="search-input-wrap">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="搜索城市..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button className="search-cancel" onClick={onClose}>取消</button>
        </div>

        <div className="search-results">
          {loading && <div className="search-loading">搜索中...</div>}

          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="search-empty">未找到匹配城市</div>
          )}

          {!loading && query.length < 2 && (
            <div className="search-hint">
              <div className="search-hint-title">热门城市</div>
              <div className="search-hot-cities">
                {[
                  { name: '北京', latitude: 39.9042, longitude: 116.4074 },
                  { name: '上海', latitude: 31.2304, longitude: 121.4737 },
                  { name: '广州', latitude: 23.1291, longitude: 113.2644 },
                  { name: '深圳', latitude: 22.5431, longitude: 114.0579 },
                  { name: '杭州', latitude: 30.2741, longitude: 120.1551 },
                  { name: '成都', latitude: 30.5728, longitude: 104.0668 },
                  { name: '东京', latitude: 35.6762, longitude: 139.6503 },
                  { name: '纽约', latitude: 40.7128, longitude: -74.0060 },
                  { name: '伦敦', latitude: 51.5074, longitude: -0.1278 },
                  { name: '巴黎', latitude: 48.8566, longitude: 2.3522 },
                  { name: '悉尼', latitude: -33.8688, longitude: 151.2093 },
                  { name: '新加坡', latitude: 1.3521, longitude: 103.8198 },
                ].map((city) => (
                  <button
                    key={city.name}
                    className="hot-city-btn"
                    onClick={() => handleSelect(city)}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {results.map((city, i) => (
              <motion.div
                key={city.id || i}
                className="search-result-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => handleSelect(city)}
              >
                <div className="result-name">{city.name}</div>
                <div className="result-detail">
                  {[city.admin1, city.country].filter(Boolean).join(', ')}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
