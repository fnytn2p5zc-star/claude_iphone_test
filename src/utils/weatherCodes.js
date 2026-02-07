export const WEATHER_CODES = {
  0: { desc: '晴天', icon: '☀️', bg: 'sunny' },
  1: { desc: '大部晴朗', icon: '🌤', bg: 'sunny' },
  2: { desc: '局部多云', icon: '⛅', bg: 'cloudy' },
  3: { desc: '多云', icon: '☁️', bg: 'cloudy' },
  45: { desc: '雾', icon: '🌫', bg: 'foggy' },
  48: { desc: '霜雾', icon: '🌫', bg: 'foggy' },
  51: { desc: '小毛毛雨', icon: '🌦', bg: 'rainy' },
  53: { desc: '毛毛雨', icon: '🌦', bg: 'rainy' },
  55: { desc: '大毛毛雨', icon: '🌧', bg: 'rainy' },
  56: { desc: '冻毛毛雨', icon: '🌧', bg: 'rainy' },
  57: { desc: '冻雨', icon: '🌧', bg: 'rainy' },
  61: { desc: '小雨', icon: '🌧', bg: 'rainy' },
  63: { desc: '中雨', icon: '🌧', bg: 'rainy' },
  65: { desc: '大雨', icon: '🌧', bg: 'rainy' },
  66: { desc: '冻雨', icon: '🌧', bg: 'rainy' },
  67: { desc: '大冻雨', icon: '🌧', bg: 'rainy' },
  71: { desc: '小雪', icon: '🌨', bg: 'snowy' },
  73: { desc: '中雪', icon: '🌨', bg: 'snowy' },
  75: { desc: '大雪', icon: '❄️', bg: 'snowy' },
  77: { desc: '雪粒', icon: '❄️', bg: 'snowy' },
  80: { desc: '小阵雨', icon: '🌦', bg: 'rainy' },
  81: { desc: '中阵雨', icon: '🌧', bg: 'rainy' },
  82: { desc: '大阵雨', icon: '⛈', bg: 'rainy' },
  85: { desc: '小阵雪', icon: '🌨', bg: 'snowy' },
  86: { desc: '大阵雪', icon: '❄️', bg: 'snowy' },
  95: { desc: '雷暴', icon: '⛈', bg: 'stormy' },
  96: { desc: '雷暴伴小冰雹', icon: '⛈', bg: 'stormy' },
  99: { desc: '雷暴伴大冰雹', icon: '⛈', bg: 'stormy' },
};

export function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { desc: '未知', icon: '❓', bg: 'cloudy' };
}

export function getWeatherBg(code) {
  const info = getWeatherInfo(code);
  const bgs = {
    sunny: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    cloudy: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    rainy: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    snowy: 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)',
    foggy: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
    stormy: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  };
  return bgs[info.bg] || bgs.cloudy;
}

export function isRainy(code) {
  return [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code);
}

export function isSnowy(code) {
  return [71, 73, 75, 77, 85, 86].includes(code);
}

export function isStormy(code) {
  return [95, 96, 99].includes(code);
}

export function isSunny(code) {
  return [0, 1].includes(code);
}
