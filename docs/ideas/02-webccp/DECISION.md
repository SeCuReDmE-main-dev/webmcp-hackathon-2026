# WebCCP decision

Decision date: 2026-08-27  
Status: `DEFERRED_BENCH`

## Decision

Do not build WebCCP for this hackathon.

## Reason

The architectural placement is clearer than before: a CCP can be an external harness contract, but it is not browser memory and should not become a WebMCP primitive. The remaining uncertainty is the weight of the data itself. A continuity envelope that costs more context than the decision it improves is counterproductive.

The earlier experiment showed a CCP-only reduction, but did not validate the combined 50% target. That is not failure; it is the evidence that the design needs a better information-value model before another implementation.

## Re-entry gates

WebCCP can return only when:

- visible bytes and proxy tokens are measured per field;
- each included field demonstrates decision value;
- progressive retrieval is compared against eager injection;
- stale-state promotion is zero in the target protocol;
- a matched free summary is used as a fair baseline.

