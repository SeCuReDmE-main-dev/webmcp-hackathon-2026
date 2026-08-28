# QDK public API spike

This bounded spike tests whether the published `qsharp-lang` package can support
the browser-side adapter without learning or rebuilding the QDK internals.

It loads the prebuilt WebAssembly module, validates a two-qubit Q# program, and
runs twenty simulator shots through the public compiler API. It does not build
the Rust workspace, connect to Azure, or claim multi-framework interoperability.

```powershell
npm install
npm run spike
```

Decision gate: keep QDK in the seven-day MVP only if this public boundary stays
small, deterministic, and fast enough for the demo machine.
