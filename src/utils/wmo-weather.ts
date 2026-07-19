type WmoWeatherCode =
  | 0
  | 1
  | 2
  | 3
  | 45
  | 48
  | 51
  | 53
  | 55
  | 56
  | 57
  | 61
  | 63
  | 65
  | 66
  | 67
  | 71
  | 73
  | 75
  | 77
  | 80
  | 81
  | 82
  | 85
  | 86
  | 95
  | 96
  | 99;

export interface WeatherDetails {
  readonly description: string;
  readonly group: string; // Helpful for UI styling or choosing icons
}

const WMO_WEATHER_LOOKUP = new Map<WmoWeatherCode, WeatherDetails>([
  [0, { description: 'Clear sky', group: 'Clear' }],
  [1, { description: 'Mainly clear', group: 'Cloudy' }],
  [2, { description: 'Partly cloudy', group: 'Cloudy' }],
  [3, { description: 'Overcast', group: 'Cloudy' }],
  [45, { description: 'Fog', group: 'Fog' }],
  [48, { description: 'Depositing rime fog', group: 'Fog' }],
  [51, { description: 'Drizzle: Light intensity', group: 'Drizzle' }],
  [53, { description: 'Drizzle: Moderate intensity', group: 'Drizzle' }],
  [55, { description: 'Drizzle: Dense intensity', group: 'Drizzle' }],
  [
    56,
    {
      description: 'Freezing Drizzle: Light intensity',
      group: 'Freezing Rain',
    },
  ],
  [
    57,
    {
      description: 'Freezing Drizzle: Dense intensity',
      group: 'Freezing Rain',
    },
  ],
  [61, { description: 'Rain: Slight intensity', group: 'Rain' }],
  [63, { description: 'Rain: Moderate intensity', group: 'Rain' }],
  [65, { description: 'Rain: Heavy intensity', group: 'Rain' }],
  [
    66,
    { description: 'Freezing Rain: Light intensity', group: 'Freezing Rain' },
  ],
  [
    67,
    { description: 'Freezing Rain: Heavy intensity', group: 'Freezing Rain' },
  ],
  [71, { description: 'Snow fall: Slight intensity', group: 'Snow' }],
  [73, { description: 'Snow fall: Moderate intensity', group: 'Snow' }],
  [75, { description: 'Snow fall: Heavy intensity', group: 'Snow' }],
  [77, { description: 'Snow grains', group: 'Snow' }],
  [80, { description: 'Rain showers: Slight', group: 'Rain Showers' }],
  [81, { description: 'Rain showers: Moderate', group: 'Rain Showers' }],
  [82, { description: 'Rain showers: Violent', group: 'Rain Showers' }],
  [85, { description: 'Snow showers: Slight', group: 'Snow Showers' }],
  [86, { description: 'Snow showers: Heavy', group: 'Snow Showers' }],
  [
    95,
    { description: 'Thunderstorm: Slight or moderate', group: 'Thunderstorm' },
  ],
  [96, { description: 'Thunderstorm with slight hail', group: 'Thunderstorm' }],
  [99, { description: 'Thunderstorm with heavy hail', group: 'Thunderstorm' }],
]);

export function getWeatherDetails(code: number): WeatherDetails {
  // Check if the generic number is a valid code in our Map
  if (WMO_WEATHER_LOOKUP.has(code as WmoWeatherCode)) {
    return WMO_WEATHER_LOOKUP.get(code as WmoWeatherCode)!;
  }

  return {
    description: `Unknown Weather (Code ${code})`,
    group: 'Unknown',
  };
}
