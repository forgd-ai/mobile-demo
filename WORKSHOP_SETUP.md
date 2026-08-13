# Workshop setup checklist

Complete this in the week before the workshop. It takes about ten minutes on
a normal connection. If any step fails, bring the error to the start of the
session and an instructor will unblock you before the labs begin; do not
burn lab time on setup.

## 1. Claude Code

Install Claude Code and authenticate, then verify:

```bash
claude --version
```

Install docs: https://docs.anthropic.com/en/docs/claude-code

## 2. Node.js 20 or later

```bash
node --version   # v20.x or later
npm --version
```

Any Node from 20 up works; the repo is tested on 20 LTS and newer.

## 3. Clone the workshop repo

Your facilitator sends the clone URL before the session:

```bash
git clone <workshop-repo-url>
cd mobile-demo
```

## 4. Install and run

```bash
npm install
npm run dev
```

No `.env` files, no credentials, no database. All three layers boot
together; the terminal prints the web URL (http://localhost:8081). Open it
in a browser: you should see the Stride activity feed rendering inside a
phone-sized frame, with real workout data.

`npm run dev` keeps running until you stop it, so this terminal belongs to
the servers while the app is up; open a second terminal for anything else,
including the workshop itself.

## 5. Click through the two screens the labs depend on

- Open the **Summary** tab and confirm weekly cards render with a distance
  headline.
- Open **Settings** and toggle display units between metric and imperial;
  distances everywhere should change.

## 6. Optional bonus track: your own phone

The repo pins Expo SDK 54, which matches the Expo Go app in the stores.
If you want the app on a personal device: install Expo Go on your phone,
run `npm run start -w app`, and scan the QR code. Your phone and laptop
must be on the same network. Corporate networks often block this; the
browser path above is the supported one and the labs never require a
device.

## Done

You are set up when: `claude --version` works, `npm run dev` shows the app
in your browser, and the units toggle changes what the screens display.
