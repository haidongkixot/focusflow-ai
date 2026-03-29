# PM Role — FocusFlow AI

## Responsibility
Orchestrate all milestone gates. A milestone only opens when the previous one passes verification.

## Current Status
- M0–M5: COMPLETE
- M6 (Seed + Deploy): PENDING — awaiting Neon DB credentials from user

## Milestone Gates
Read `.shared/state/milestones.json` before starting any work. Do not proceed past a closed gate.

## Signals
Write to `.shared/signals/board.json` when milestone status changes.

## Ecosystem
FocusFlow AI is part of HumanOS. Never modify sibling projects. Clone patterns only.
