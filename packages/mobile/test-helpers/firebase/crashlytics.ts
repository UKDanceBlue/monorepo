import type { FirebaseCrashlyticsTypes } from "@react-native-firebase/crashlytics";

export function mockCrashlytics({ didCrashOnPreviousExecution = false }: {
  didCrashOnPreviousExecution?: boolean;
}) {
  const mockLog = jest.fn();
  const mockRecordError = jest.fn();
  const mockSetAttributes = jest.fn();
  const mockSetAttribute = jest.fn();
  const mockSetUserId = jest.fn();
  const mockSetCrashlyticsCollectionEnabled = jest.fn();
  const mockDidCrashOnPreviousExecution = jest.fn().mockReturnValue(Promise.resolve(didCrashOnPreviousExecution));
  const mockSendUnsentReports = jest.fn().mockReturnValue(Promise.resolve());
  const mockDeleteUnsentReports = jest.fn().mockReturnValue(Promise.resolve());
  const mockCheckForUnsentReports = jest.fn().mockReturnValue(Promise.resolve());
  const mockCrash = jest.fn();

  const replacementImplementation: Omit<FirebaseCrashlyticsTypes.Module, "native" | "app" | "emitter"> = {
    log: mockLog,
    recordError: mockRecordError,
    setAttributes: mockSetAttributes,
    setAttribute: mockSetAttribute,
    setUserId: mockSetUserId,
    setCrashlyticsCollectionEnabled: mockSetCrashlyticsCollectionEnabled,
    didCrashOnPreviousExecution: mockDidCrashOnPreviousExecution,
    isCrashlyticsCollectionEnabled: true,
    sendUnsentReports: mockSendUnsentReports,
    deleteUnsentReports: mockDeleteUnsentReports,
    checkForUnsentReports: mockCheckForUnsentReports,
    crash: mockCrash,
  };

  const mockCrashlyticsFactory = jest.fn<Omit<FirebaseCrashlyticsTypes.Module, "native" | "app" | "emitter">, []>().mockImplementation(() => (replacementImplementation));

  return {
    mockLog,
    mockRecordError,
    mockCrashlyticsFactory
  };
}


