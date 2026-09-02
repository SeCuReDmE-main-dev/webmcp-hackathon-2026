# Install QCG Console Companion 0.2.4

QCG works without this optional extension. Install Companion only when you want
the synchronized Chrome side panel and the QCG panel in DevTools.

1. Extract the downloaded ZIP to a folder you will keep until testing ends.
2. Open `chrome://extensions` in Google Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked** and choose the extracted folder containing
   `manifest.json`.
5. Return to `https://qcg.securedme.ca/`, reload the page and select
   **Open Companion**.
6. For the F12 surface, open DevTools and select the **QCG** panel.

The production package is restricted to `https://qcg.securedme.ca/*`. It does
not contain a provider credential, QPU integration, remote execution path or
automatic installer. Chrome requires the final **Load unpacked** action to be
performed by the person using the browser.

For local development at port 5173, use the separately generated development
archive. The public judge-facing download intentionally omits localhost access.
