# MIST Mobile

Minimal Expo workspace aligned to the current backend.

## Included

- Expo Router app shell
- Username/password login against `/api/auth/v1/login`
- Secure JWT persistence with `expo-secure-store`
- Chat screen wired to `/api/rag/v1/ask`
- Voice session create/teardown wired to `/api/rtc/v1/session`
- Zustand stores for auth, chat, and voice state
- TanStack Query for request orchestration

## Start

1. Install dependencies with `npm install`
2. Copy `.env.example` to `.env`
3. Set `EXPO_PUBLIC_BACKEND_URL` to the backend address reachable from the phone

Example:

```env
EXPO_PUBLIC_BACKEND_URL=http://192.168.100.66:8092
```

## Daily Development

This project uses an Expo development build, not Expo Go.

### First-time device setup

1. Enable `Developer options` on the Android phone
2. Enable `USB debugging`
3. Connect the phone by USB
4. Verify the device is visible:

```cmd
adb devices
```

### Build and install the app

Run this when the native app is not installed yet, or after native dependency changes:

```cmd
npm run android
```

### Normal development loop

1. Start Metro on a fixed port:

```cmd
npx expo start --dev-client --port 8081 --clear
```

2. In a second terminal, forward Metro to the phone over USB:

```cmd
adb reverse tcp:8081 tcp:8081
```

3. Open the installed `MIST` app on the phone
4. Reload the app if needed

### Mirror the phone on the laptop

Use `scrcpy` to keep the phone UI beside the editor:

```cmd
scrcpy --max-size 900
```

If `scrcpy` is not on `PATH`, run it with its full path.

## Reset Flow

If the app shows `Unable to load script`:

1. Close the app on the phone
2. Stop Metro
3. Run:

```cmd
npx expo start --dev-client --port 8081 --clear
```

4. In another terminal, run:

```cmd
adb reverse --remove-all
adb reverse tcp:8081 tcp:8081
```

5. Reopen the app on the phone

## Notes

- Do not use Expo Go for this project
- Voice currently scaffolds session create/teardown only
- Real LiveKit room UI can be added next
