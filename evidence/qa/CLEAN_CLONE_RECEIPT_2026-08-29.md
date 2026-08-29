# Clean-clone release receipt

Date: 2026-08-29
Remote: `https://github.com/SeCuReDmE-main-dev/webmcp-hackathon-2026.git`
Verified commit: `9dfb62572d3c761be8ae183dc77a7bd224168c87`

## Procedure

The public repository was cloned with depth one into a new directory under the Windows local temporary root. Validation then ran only from `prototype/webmcp-qcg` inside that clone.

1. `npm ci`
2. `npm test`
3. `npm run build`

## Results

- Lock-file installation: `PASS`
- Installed packages: `108`
- Reported npm vulnerabilities: `0`
- Vitest files: `2/2`
- Vitest tests: `18/18`
- TypeScript validation: `PASS`
- Vite production build: `PASS`
- Vite modules transformed: `122`
- Q# WebAssembly asset included: `6,066,574` bytes

## Result

`PASS` — a reviewer can clone the public repository, install from the lock file, run the complete automated baseline and build the static QCG application with the documented commands.

The temporary clone remains outside the repository and outside the public deliverable.
