# DanceBlue Mobile App

## Releases

### Native Updates

Native updates are required when changing any value in app.config.json or
app.config.ts, when adding or removing a native dependency, or when you just
want to publish a new version of the app to the app store directly.

1. Update the version number in app.config.ts (following the instructions in the
   file)
2. Commit and push all changes (clean working tree is required)
3. Run `yarn eas-[ios/android]-production` (for iOS you will need to provide the
   App Store Connect app password as an environment variable,
   `EXPO_APPLE_APP_SPECIFIC_PASSWORD`)
4. Follow the instructions in the terminal to log in to Expo and/or the relevant
   developer account
5. Wait for the build to complete, once it is done (if successful) the build you
   created will be available on App Store Connect/Google Play Console
6. Submit the build for review on App Store Connect/Google Play Console

### JS-Only Updates

JS-only updates can be used for any change to the typescript code of the app, or
changes to the assets used by the app. This is the preferred method of updating
the app, as it is faster and does not require a new build to be uploaded to the
app store.

JS updates are done automatically by GitHub Actions when a new commit is pushed
to `main` or `release` (to development and production respectively). Once a new
JS bundle is created and uploaded to Expo, the app will automatically prompt the
user to update the app the next time they open it.

## Dev Client

During development, you will use the dev client to test changes to the app as
you make them. This dev client can be installed either on a real device or in an
emulator/simulator. Instructions for building a new dev client are the same as
for building a new native update, but you will use `dev-client` instead of
`production` in the command, and EAS Submit will not be used. Note that all iOS
devices must be
[registered](https://docs.expo.dev/build/internal-distribution/#managing-devices)
with the Apple Developer account to use the dev client. Once the dev client is
built, you can install it on your device by scanning the QR code that is
displayed in the terminal or on Expo's website.

You will need some way of connecting your phone to your Metro Bundler (and your
instance of the server if applicable). Generally this will just be connecting
over LAN, however this will not work with some networks, and can cause issues
when using LinkBlue login with a local server. In either of these cases I
recommend looking into ngrok or Tailscale to create a secure tunnel to your
local server. If you are using LinkBlue login locally, you will also need to
ensure you have an approved redirect URL set up in Microsoft Azure.

## Navigation

The app uses a stack navigator for the basic navigation, and a tab navigator for
the bottom navigation. The stack navigator is used for popups and other
temporary screens, while the tab navigator is used for the main screens of the
app.

### [Root Stack Navigator](./src/navigation/root/RootScreen.tsx)

#### [Tab Navigator](./src/navigation/root/tab/TabBar.tsx)

##### [Home Screen](./src/navigation/root/tab/HomeScreen/HomeScreen.tsx)

Basic screen that shows a splash image and some links to social and websites

##### [Events Screen](./src/navigation/root/tab/EventListScreen/EventListScreen.tsx)

Shows a calendar view of all events, linking out to the
[event screen](#event-screen)

##### [Explore Screen](./src/navigation/root/tab/ExplorerScreen/ExplorerScreen.tsx)

Shows a feed of content posted to the app portal, as well as some other feeds
like the website's blog

##### [Marathon Screen](./src/navigation/root/tab/MarathonScreen/MarathonScreen.tsx)

Before marathon starts, shows a countdown to the start of marathon. After
marathon starts, shows content for each hour of marathon, as set up on the admin
portal

##### [Spirit Stack Navigator](./src/navigation/root/tab/spirit/SpiritStack.tsx)

###### [Team Screen](./src/navigation/root/tab/spirit/TeamScreen/TeamScreen.tsx)

Shows information about the user's team such as each user's spirit points and
the list of donations assigned to the user

###### [Scoreboard Screen](./src/navigation/root/tab/spirit/ScoreBoardScreen/ScoreBoardScreen.tsx)

Shows the current leaderboard of spirit teams or morale teams (depending on
whether a marathon is currently happening)

#### [Notifications Screen](./src/navigation/root/NotificationScreen/NotificationScreen.tsx)

Shows a list of notifications that the user has received from the app

#### [Profile Screen](./src/navigation/root/ProfileScreen/ProfileScreen.tsx)

Shows the user's profile information and login/logout buttons

#### [Event Screen](./src/navigation/root/EventScreen/EventScreen.tsx)

Shows information about a specific event

## Configuration

The app uses Expo for native builds, meaning there is no native code anywhere in
the repository, not are there config files for native code. Instead, Expo
generates the native code and config files based on the app.config ts and json
files. The app.config.json file is used for static configuration such as app
name, [Expo config plugins](https://docs.expo.dev/config-plugins/introduction/),
and other values that rarely change. The app.config.ts file is used for dynamic
configuration such as the bundle identifier (as it is different for the dev
client) and the version number (as it is dynamically generated for iOS vs
Android).

Expo also has a file used to configure the actual build process called
`eas.json`. The configurations in the file are what underlies the
`yarn eas-[ios/android]` commands.

There is one other configuration that is used by the app directly, the .env
file. At this time, the only variable the app uses is `EXPO_PUBLIC_API_BASE_URL`
which is used to determine the base URL to reach the app server.

Finally, there are configurations used to bundle the JS code, the big two are
Babel and Metro. The configurations are all based on Expo defaults and examples,
but are customized slightly to support some additional features or to add import
aliases.
