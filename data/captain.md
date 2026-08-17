# Captain Preferences

## Delivery defaults
- Default delivery mode: direct-PR
- Default yolo posture: off
- Preferred PR merge strategy: squash

## Communication
- Prefer concise findings over verbose status dumps
- Surface cost info only when unusually expensive
- Batch non-urgent updates into the next natural reply

## Worker preferences
- Default model tier: reasoning (DeepSeek-V4 for design/architecture, cheaper models for routine fixes)
- Preferred effort: high for investigation, low for well-understood work
- Keep work-in-progress to 2 concurrent tasks max

## Standing instructions
- Always run design-taste-frontend on any new frontend work before writing code
- Run no-mistakes on anything touching prod-facing surface
- Diagnostic reports must include reproduction steps

## Project-specific
- Projects default to direct-PR unless overridden in projects.md
- Firstmate tools repo changes go through no-mistakes always
