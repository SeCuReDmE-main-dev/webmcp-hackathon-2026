# Local hardware execution budget

Date: 2026-08-27  
Status: live machine inventory plus conservative MVP limits

## Observed development machine

- CPU: Intel Core i5-8265U, 4 cores / 8 logical processors
- Memory: 31.3 GB visible to Windows
- GPU: Intel UHD Graphics 620, 1 GB reported adapter memory
- NVIDIA CUDA GPU: not present
- Verified QDK public-package spike: Bell validation and 20-shot simulation passed in 716 ms on the canonical recorded run

## Consequence

The machine is adequate for Web development, WebMCP, workers, compilation and
small state-vector simulations. It is not suitable for GPU-accelerated CUDA-Q
simulation or large local language models. The MVP does not require either.

Quantum state-vector memory grows exponentially. At 16 bytes per complex
amplitude, the theoretical vector alone is about 256 MB at 24 qubits, 1 GB at
26, 4 GB at 28 and 16 GB at 30, before runtime overhead and browser copies. The
browser gate must therefore be far below the machine's apparent maximum.

## MVP bounds

- Q# source: fixed fixture first; later maximum 32 KiB typed source
- qubits: 12 maximum for user-controlled browser simulation
- shots: 1,000 maximum
- execution time: 5 seconds before Worker termination
- returned events: bounded and summarized; no unbounded event stream
- concurrency: one simulation Worker
- engine: lazy-load pinned QDK WASM only after preflight selects it
- cache: immutable static asset cache; no secret-bearing result cache
- remote execution: disabled

The two-qubit Bell demonstration stays far below every bound. Limits can be
raised only after measured browser profiling, not from installed RAM alone.

## NVIDIA account and tools

An NVIDIA Developer account may support future documentation, hosted labs or
CUDA-Q exploration. It does not compensate for the absence of a local NVIDIA
GPU and must not be required to use the demo.

Compression is useful for delivery, not for changing quantum complexity:

- serve the WASM with Brotli or gzip when the host supports it;
- lazy-load and cache the immutable module;
- avoid copying large state vectors between the Worker and UI;
- return summaries and evidence, not raw internal state;
- use Colab or another explicit remote tier for experiments beyond local bounds.

No NVIDIA-specific compression library is needed in the first vertical slice.
Adding one would increase integration risk without reducing the exponential
simulation cost.
