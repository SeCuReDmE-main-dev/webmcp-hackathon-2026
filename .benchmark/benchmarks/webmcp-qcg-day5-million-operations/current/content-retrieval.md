# Content retrieval notes

The benchmark corpus is synthetic and local. No web retrieval, URL fetch, package installation or external SDK execution is part of preparation. Primary repository evidence is linked by path in `search-index.md`; external references are preserved as URLs in the source index for a later research pass.

Retrieval rule: a future campaign may consume only the manifest-listed textual files and the exact configuration digest. Any notebook, archive, binary, URL, invalid UTF-8 input, credential marker or unbounded payload is rejected before execution.
