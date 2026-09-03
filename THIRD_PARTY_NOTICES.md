# Third-party notices

This repository currently uses the following third-party package in a bounded
research spike. Inclusion here does not imply endorsement by its authors.

## Microsoft Quantum Development Kit / qsharp-lang

- Package: `qsharp-lang@1.31.0` (exactly pinned)
- Project: https://github.com/microsoft/qdk
- Package page: https://www.npmjs.com/package/qsharp-lang
- License: MIT
- License text: https://github.com/microsoft/qdk/blob/main/LICENSE.txt

The package's prebuilt WebAssembly binary is obtained through npm and is not
committed to this repository. `node_modules/` remains ignored. Any future
distribution that bundles the binary must retain the applicable copyright and
license notices.

## Nekuda WebMCP SDK

- Package: `@nekuda/webmcp-sdk@0.5.0` (exactly pinned)
- Documentation: https://docs.nekuda.ai/sdk
- WebMCP Kit project: https://github.com/nekuda-ai/webmcp-kit
- Project license: MIT
- Privacy policy: https://docs.nekuda.ai/privacy

QCG uses the SDK only for AgentLane registration and derived reliability
telemetry. The separate authenticated channel that can include raw tool inputs
and responses is disabled. The npm 0.5.0 package currently omits a `license`
field and bundled license file; the official WebMCP Kit repository identifies
the project as MIT. This metadata gap is recorded rather than hidden.
