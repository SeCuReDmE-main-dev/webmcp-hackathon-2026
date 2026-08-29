export const qcgSeasons = ['autumn', 'winter', 'spring', 'summer'] as const
export type QcgSeason = (typeof qcgSeasons)[number]
export const QCG_SEASON_STORAGE_KEY = 'qcg-season'

export function readQcgSeason(storage: Pick<Storage, 'getItem'>): QcgSeason {
  try {
    const stored = storage.getItem(QCG_SEASON_STORAGE_KEY)
    return qcgSeasons.includes(stored as QcgSeason) ? stored as QcgSeason : 'autumn'
  } catch {
    return 'autumn'
  }
}

export function saveQcgSeason(storage: Pick<Storage, 'setItem'>, season: QcgSeason): void {
  try { storage.setItem(QCG_SEASON_STORAGE_KEY, season) } catch { /* The theme remains active for this page session. */ }
}

export function readWindowQcgSeason(scope: Pick<Window, 'localStorage'>): QcgSeason {
  try { return readQcgSeason(scope.localStorage) } catch { return 'autumn' }
}

export function saveWindowQcgSeason(scope: Pick<Window, 'localStorage'>, season: QcgSeason): void {
  try { saveQcgSeason(scope.localStorage, season) } catch { /* Opaque origins keep the in-memory React state. */ }
}
