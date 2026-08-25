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

Your facilitator sends the clone URL before the session. Clone to a folder
outside Documents, Desktop, or any cloud-synced directory (iCloud,
OneDrive, Dropbox); your home folder or a `~/code` directory is ideal. A
sync daemon and Metro's file watcher feed each other forever, and the
failure looks like a dev server that starts but never finishes loading.

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

### Pick your run target: browser or iOS simulator

The browser is the path everyone can run and the one the labs support end
to end. If you are on a Mac with Xcode installed, you can run the whole
lab on the iOS simulator instead. Leave `npm run dev` running and, in your
second terminal:

```bash
open -a Simulator
xcrun simctl openurl booted "exp://localhost:8081"
```

Click Open when the simulator asks. If Metro printed a port other than
8081, use that one. Expo Go has to be on the simulator once; if it is
missing, `npx expo start --ios` from `app/` installs it for you.
Everything else in this checklist and in the labs reads identically on the
simulator. If anything here costs you more than five minutes, go back to
the browser; you lose nothing, and section 6 below covers real phones.

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
