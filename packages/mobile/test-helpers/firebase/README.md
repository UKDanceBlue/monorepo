These mocks can be used like:

```js
const { mockCrashlyticsFactory, mockLog } = mockCrashlytics({});
jest.mock("@react-native-firebase/crashlytics", () => mockCrashlyticsFactory);

expect(mockLog).toHaveBeenCalledWith("A log message");
```

The mock creator and jest.mock functions must be called early on (jest moves them anyways) so that the mocks are available before the module is imported.
