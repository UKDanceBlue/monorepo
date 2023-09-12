/* eslint-disable no-console */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "fs";

import { ConfigContext, ExpoConfig } from "@expo/config"; // WARNING - @expo/config types aren't versioned

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
  minor: 2,
  patch: 2
} as const;
const nativeVersion: Version = {
  major: 2,
  minor: 2,
  patch: 1
} as const;

// Both the sum of version.patch + buildsThisVersion and the sum of baseBuildCount + buildsThisVersion must increase each time a native build is submitted.
const baseBuildCount = 33;
const buildsThisVersion = 0;

/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
DO NOT CHANGE ANYTHING BELOW THIS LINE UNLESS YOU KNOW WHAT YOU'RE DOING
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

interface GoogleServiceFiles {
  android: string;
  ios: string;
}

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

  // Google Services Files
  const androidGoogleServicesFile = IS_DEV ? "./google-services.dev.json" : "./google-services.json";
  const iosGoogleServicesFile = IS_DEV ? "./GoogleService-Info.dev.plist" : "./GoogleService-Info.plist";

  console.log(`Generating manifest for ${IS_DEV ? "development" : "production"} app`);

  // Check that the version is valid
  if (nativeVersion.major !== bundleVersion.major) {
    throw new Error(`Major version mismatch: ${nativeVersion.major} !== ${bundleVersion.major}. Avoid bumping the bundle version without making a new build.`);
  }
  if (nativeVersion.minor > bundleVersion.minor) {
    throw new Error(`Minor version mismatch: ${nativeVersion.minor} > ${bundleVersion.minor}. Bundle cannot be labeled as older than the runtime version.`);
  } else if (nativeVersion.minor === bundleVersion.minor && nativeVersion.patch > bundleVersion.patch) {
    throw new Error(`Patch version mismatch: ${nativeVersion.patch} > ${bundleVersion.patch}. Bundle cannot be labeled as older than the runtime version.`);
  }

  // Assemble the various version codes
  const bundleVersionString: SemVer = `${bundleVersion.major}.${bundleVersion.minor}.${bundleVersion.patch}`;
  const runtimeVersion: SemVer = `${nativeVersion.major}.${nativeVersion.minor}.${nativeVersion.patch}`;
  const versionCode = baseBuildCount + buildsThisVersion;
  const buildNumber: SemVer = `${nativeVersion.major}.${nativeVersion.minor}.${nativeVersion.patch + buildsThisVersion}`;

  // If we are in a version-checked environment, check the version
  if (process.env.CHECK_VERSION === "true") {
    // Show a warning if the version is the same as the last build
    const newVersionFile = makeVersionFile(bundleVersionString, runtimeVersion, baseBuildCount, buildsThisVersion);
    if (existsSync("./version.txt")) {
      const lastVersionFile = readFileSync("./version.txt", "utf8");
      const linesOfNewVersionFile = newVersionFile.split("\n").splice(1);
      lastVersionFile.split("\n").splice(1).forEach((line, index) => {
        if (line === linesOfNewVersionFile[index]) {
          console.warn(`Warning: version.txt line ${index + 2} is the same as the last build. If this was unintentional, bump the version in app.config.ts.`);
        }
      });
    }
    writeFileSync("./version.txt", newVersionFile);
  }

  // Check that the Google services file exists
  const onNotExist = process.env.EAS_BUILD_RUNNER === "eas-build" ? console.warn : (err: string) => {
    throw new Error(err);
  };
  if (process.env.EAS_BUILD && !existsSync(androidGoogleServicesFile)) {
    console.error("Detected files:", readdirSync(".").join(" --- "));
    onNotExist(`GoogleService-Info file not found at ${androidGoogleServicesFile}`);
  }

  // Check that the Google services file exists
  if (!existsSync(iosGoogleServicesFile)) {
    console.error("Detected files:", readdirSync(".").join(" --- "));
    onNotExist(`GoogleService-Info file not found at ${iosGoogleServicesFile}`);
  }

  return makeExpoConfig({
    baseConfig: config,
    name,
    slug: "danceblue-mobile",
    version: bundleVersionString,
    androidBuildNumber: versionCode,
    iosBuildString: buildNumber,
    runtimeVersion,
    qualifiedName,
    googleServicesFiles: {
      android: androidGoogleServicesFile,
      ios: iosGoogleServicesFile
    }
  });
};

/**
 * This helper function is used to safely build an ExpoConfig object from the given properties.
 * The template literal types are used to ensure that the given properties are valid.
 *
 * @param configurationProperties All the properties needed to make an ExpoConfig
 * @returns A complete ExpoConfig based on the given properties
 */
function makeExpoConfig(
  {
    baseConfig,
    name,
    slug,
    version,
    androidBuildNumber,
    iosBuildString,
    runtimeVersion,
    qualifiedName,
    googleServicesFiles
  }: {
    baseConfig: Partial<ExpoConfig>;
    name: "DB DEV CLIENT" | "DanceBlue";
    slug: "danceblue-mobile";
    version: SemVer;
    androidBuildNumber: number;
    iosBuildString: SemVer;
    runtimeVersion: SemVer;
    qualifiedName: DanceBlueQualifiedName;
    googleServicesFiles: GoogleServiceFiles;
  }
): ExpoConfig {
  const iosConfig = baseConfig.ios ?? {};
  const androidConfig = baseConfig.android ?? {};

  iosConfig.buildNumber = iosBuildString;

  androidConfig.versionCode = androidBuildNumber;

  iosConfig.googleServicesFile = googleServicesFiles.ios;
  androidConfig.googleServicesFile = googleServicesFiles.android;

  iosConfig.bundleIdentifier = qualifiedName;
  androidConfig.package = qualifiedName;

  return {
    ...baseConfig,
    name,
    slug,
    version,
    runtimeVersion,
    ios: iosConfig,
    android: androidConfig
  };
}

function makeVersionFile(version: SemVer, runtimeVersion: SemVer, baseBuildCount: number, buildsThisVersion: number): string {
  return (
    `This File is auto-generated by app.config.ts - DO NOT EDIT IT
    ${version}
    ${runtimeVersion}
    ${baseBuildCount}
    ${buildsThisVersion}`
  );
}
