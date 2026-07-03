<img src="logo.png" >

### A Chrome extension that lets you view Instagram stories anonymously

**Works with Manifest V3** — migrated from MV2 to work with modern browsers.

#### How it works

This extension intercepts the network requests that Instagram sends when you view a story (the "mark as seen" mutation) and blocks them. Your Instagram account won't show that you've viewed the story.

- ✅ No network requests are sent to mark stories as seen
- ✅ Works in real-time—toggle the extension on/off to enable/disable blocking
- ✅ Built with TypeScript and uses `chrome.scripting` to bypass Instagram's Content Security Policy

#### Installation

1. Clone or download the repository
2. Run `bun install` to install dependencies (or use `npm install`)
3. Run `bun run build` to build the TypeScript files to `dist/`
4. Go to `chrome://extensions/` and enable **Developer mode** (top right)
5. Click **Load unpacked** and select this folder
6. The extension icon will appear in your toolbar

#### Usage

- Click the extension icon to toggle it **On** (green badge) or **Off** (dark red badge)
- When **On**: stories you view won't be marked as seen
- When **Off**: normal Instagram behavior (stories will be marked as seen)

#### Development

```bash
# Install dependencies
bun install

# Build TypeScript to dist/
bun run build

# Rebuild on file changes
bun run build --watch
```

**Project structure:**
- `src/sw.ts` — Service worker managing state and badge
- `src/content.ts` — Content script injecting request interception
- `dist/` — Built JavaScript (generated, not committed)
- `manifest.json` — MV3 extension manifest

#### Permissions

- `host_permissions: ["https://*.instagram.com/*"]` — Access Instagram pages to inject the request interceptor
- `permissions: ["scripting"]` — Run scripts in the page context (required for `chrome.scripting.executeScript()`)

#### Technical notes

- **Content Security Policy bypass**: Instagram's CSP blocks inline scripts, so we use `chrome.scripting.executeScript()` with `world: "MAIN"` to inject code directly in the page context
- **Request interception**: We monkeypatch `window.fetch` and `XMLHttpRequest` to detect and block POST requests containing the `viewSeenAt` variable with the `Seen` + `Polaris` + `Mutation` friendly name pattern
- **State sync**: The service worker communicates state changes to content scripts via `chrome.runtime.sendMessage()` and `chrome.tabs.sendMessage()`
