import type { CollaborationIntent, CollaborationTransport } from './debugContracts'

export interface CollaborationParticipant {
  actor: 'human' | 'codex' | 'gemini' | 'antigravity' | 'system'
  role: string
  capabilities: readonly CollaborationIntent[]
  transports: readonly CollaborationTransport[]
}

export interface HandoffRoute {
  intent: CollaborationIntent
  transport: CollaborationTransport
  next_actor: CollaborationParticipant['actor']
  role: string
  reason: 'human_decision_required' | 'declared_capability_match' | 'no_eligible_participant'
}

/**
 * A pure, deterministic router. It never invokes a model, reads page content,
 * or crosses the network; declared capabilities are the entire input surface.
 */
export class HandoffCoordinator {
  route(intent: CollaborationIntent, transport: CollaborationTransport, participants: readonly CollaborationParticipant[]): HandoffRoute {
    if (intent === 'decision') return { intent, transport, next_actor: 'human', role: 'operator', reason: 'human_decision_required' }
    const eligible = participants
      .filter((participant) => participant.actor !== 'human' && participant.capabilities.includes(intent) && participant.transports.includes(transport))
      .sort((left, right) => `${left.actor}:${left.role}`.localeCompare(`${right.actor}:${right.role}`))
    const selected = eligible[0]
    return selected
      ? { intent, transport, next_actor: selected.actor, role: selected.role, reason: 'declared_capability_match' }
      : { intent, transport, next_actor: 'human', role: 'operator', reason: 'no_eligible_participant' }
  }
}
