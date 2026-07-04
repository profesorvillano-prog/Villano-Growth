// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { existsSync } from "node:fs";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// En entornos sin acceso a remotion.media (p. ej. sandboxes con red restringida),
// Remotion no puede descargar su propio Chrome Headless Shell. Si hay un
// headless shell ya instalado (variable REMOTION_BROWSER_EXECUTABLE o el de
// Playwright), lo usamos en su lugar. En una máquina normal no hace falta nada:
// Remotion descarga y gestiona su navegador automáticamente.
const playwrightHeadlessShell =
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browserExecutable =
  process.env.REMOTION_BROWSER_EXECUTABLE ??
  (existsSync(playwrightHeadlessShell) ? playwrightHeadlessShell : null);

if (browserExecutable) {
  Config.setBrowserExecutable(browserExecutable);
}
