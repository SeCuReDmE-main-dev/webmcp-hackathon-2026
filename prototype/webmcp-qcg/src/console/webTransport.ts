import type { ConsoleCommandResultV1, ConsoleTransport, SanitizedConsoleSnapshotV2 } from './contracts'

/** Web UI adapter. It is deliberately command-only: simulation is not transportable. */
export function createWebConsoleTransport(
  getSnapshot: () => SanitizedConsoleSnapshotV2,
  execute: (command: unknown) => Promise<ConsoleCommandResultV1>
): ConsoleTransport {
  return { surface: 'web', getSnapshot, executeConsoleCommand: execute }
}
