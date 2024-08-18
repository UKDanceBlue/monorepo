import type { ConfigContext, ExpoConfig } from "@expo/config"; // WARNING - @expo/config types aren't versioned

/*
Version info:
- `bundleVersion` holds the major.minor.patch version of the app's javascript and asset bundle.
- `version` holds the major.minor.patch version of the app's native code.
- `baseBuildCount` holds the number of builds of the app that have happened prior to any on the current version.
- `buildsThisVersion` holds the number of builds of the app that have happened on the current version.
- `mainVersionString` holds the version number of the app in the form of a string (shown to user).
- `versionCode` is the build ID used by android
- `buildNumber` is the build ID used by iOS

To bump the app's version:
1. Change whatever you want in `version`
2. Increment `baseBuildCount` by `buildsThisVersion`.
3. Set `buildsThisVersion` to 1.
*/
const bundleVersion: Version = {
  major: 2,
  minor: 6,
  patch: 1,
} as const;
const nativeVersion: Version = {
  major: 2,
  minor: 6,
  patch: 1,
} as const;

// Both the sum of version.patch + buildsThisVersion and the sum of baseBuildCount + buildsThisVersion must increase each time a native build is submitted.
const baseBuildCount = 42;
const buildsThisVersion = 1;

/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
DO NOT CHANGE ANYTHING BELOW THIS LINE UNLESS YOU KNOW WHAT YOU'RE DOING
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

interface Version {
  major: number;
  minor: number;
  patch: number;
}

type SemVer = `${Version["major"]}.${Version["minor"]}.${Version["patch"]}`;

type DanceBlueQualifiedName = `org.danceblue.app${`.${string}` | ""}`;

export default ({ config }: ConfigContext): ExpoConfig => {
  const IS_DEV = process.env.APP_VARIANT === "development";

  // App info
  const name = IS_DEV ? "DB DEV CLIENT" : "DanceBlue";
  const qualifiedName = IS_DEV ? "org.danceblue.app.dev" : "org.danceblue.app";

  // console.log(
  //   `Generating manifest for ${IS_DEV ? "development" : "production"} app`
  // );

  // Check that the version is valid
  if (nativeVersion.major !== bundleVersion.major) {
    throw new Error(
      `Major version mismatch: ${nativeVersion.major} !== ${bundleVersion.major}. Avoid bumping the bundle version without making a new build.`
    );
  }
  if (nativeVersion.minor > bundleVersion.minor) {
    throw new Error(
      `Minor version mismatch: ${nativeVersion.minor} > ${bundleVersion.minor}. Bundle cannot be labeled as older than the runtime version.`
    );
  } else if (
    nativeVersion.minor === bundleVersion.minor &&
    nativeVersion.patch > bundleVersion.patch
  ) {
    throw new Error(
      `Patch version mismatch: ${nativeVersion.patch} > ${bundleVersion.patch}. Bundle cannot be labeled as older than the runtime version.`
    );
  }

  // Assemble the various version codes
  const bundleVersionString: SemVer = `${bundleVersion.major}.${bundleVersion.minor}.${bundleVersion.patch}`;
  const runtimeVersion: SemVer = `${nativeVersion.major}.${nativeVersion.minor}.${nativeVersion.patch}`;
  const versionCode = baseBuildCount + buildsThisVersion;
  const buildNumber: SemVer = `${nativeVersion.major}.${nativeVersion.minor}.${
    nativeVersion.patch + buildsThisVersion
  }`;

  return makeExpoConfig({
    baseConfig: config,
    name,
    slug: "danceblue-mobile",
    version: bundleVersionString,
    androidBuildNumber: versionCode,
    iosBuildString: buildNumber,
    runtimeVersion,
    qualifiedName,
  });
};

/**
 * This helper function is used to safely build an ExpoConfig object from the given properties.
 * The template literal types are used to ensure that the given properties are valid.
 *
 * @param configurationProperties All the properties needed to make an ExpoConfig
 * @returns A complete ExpoConfig based on the given properties
 */
function makeExpoConfig({
  baseConfig,
  name,
  slug,
  version,
  androidBuildNumber,
  iosBuildString,
  runtimeVersion,
  qualifiedName,
}: {
  baseConfig: Partial<ExpoConfig>;
  name: "DB DEV CLIENT" | "DanceBlue";
  slug: "danceblue-mobile";
  version: SemVer;
  androidBuildNumber: number;
  iosBuildString: SemVer;
  runtimeVersion: SemVer;
  qualifiedName: DanceBlueQualifiedName;
}): ExpoConfig {
  const iosConfig = baseConfig.ios ?? {};
  const androidConfig = baseConfig.android ?? {};

  iosConfig.buildNumber = iosBuildString;

  androidConfig.versionCode = androidBuildNumber;

  iosConfig.bundleIdentifier = qualifiedName;
  androidConfig.package = qualifiedName;

  return {
    ...baseConfig,
    name,
    slug,
    version,
    runtimeVersion,
    ios: iosConfig,
    android: androidConfig,
  };
}
