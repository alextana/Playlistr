export const playlistPurposes = [
  {
    id: 1,
    name: 'Working out',
    icon: `💪`,
    seeds: {
      min_energy: 0.6,
      min_danceability: 0.6,
    },
  },
  {
    id: 2,
    name: 'Traveling',
    icon: `🌍`,
    seeds: {
      max_energy: 0.6,
      max_tempo: 160,
    },
  },
  {
    id: 3,
    name: 'Chilling',
    icon: `😌`,
    seeds: {
      max_energy: 0.6,
      max_tempo: 150,
    },
  },
  {
    id: 4,
    name: 'Partying',
    icon: `🎉`,
    seeds: {
      min_danceability: 0.7,
      max_tempo: 160,
    },
  },
  {
    id: 5,
    name: 'Gaming',
    icon: `🎮`,
    seeds: {
      min_energy: 0.3,
      min_popularity: 50,
    },
  },
  {
    id: 6,
    name: 'Anything',
    icon: `🙌`,
    seeds: {
      min_energy: 0.1,
      min_popularity: 20,
    },
  },
]
