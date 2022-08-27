export interface Purpose {
  id: number
  name: string
  icon: string
  seeds: {
    min_energy?: number
    min_danceability?: number
    max_energy?: number
    max_tempo?: number
    min_popularity?: number
  }
}
