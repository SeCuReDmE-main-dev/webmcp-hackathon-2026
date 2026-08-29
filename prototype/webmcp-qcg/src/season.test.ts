// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { QCG_SEASON_STORAGE_KEY, readQcgSeason, readWindowQcgSeason, saveQcgSeason, saveWindowQcgSeason } from './season'

describe('seasonal selector persistence', () => {
  it('defaults to autumn and preserves a selected accessible option', () => {
    const values = new Map<string, string>()
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) }
    expect(readQcgSeason(storage)).toBe('autumn')
    saveQcgSeason(storage, 'winter')
    expect(values.get(QCG_SEASON_STORAGE_KEY)).toBe('winter')
    expect(readQcgSeason(storage)).toBe('winter')
  })

  it('keeps the interface usable when browser storage is unavailable', () => {
    const blockedStorage = {
      getItem: () => { throw new Error('SecurityError') },
      setItem: () => { throw new Error('SecurityError') }
    }
    expect(readQcgSeason(blockedStorage)).toBe('autumn')
    expect(() => saveQcgSeason(blockedStorage, 'winter')).not.toThrow()
  })

  it('survives a SecurityError thrown by the localStorage property getter', () => {
    const blockedWindow = Object.defineProperty({}, 'localStorage', { get: () => { throw new Error('SecurityError') } }) as Pick<Window, 'localStorage'>
    expect(readWindowQcgSeason(blockedWindow)).toBe('autumn')
    expect(() => saveWindowQcgSeason(blockedWindow, 'winter')).not.toThrow()
  })
})
