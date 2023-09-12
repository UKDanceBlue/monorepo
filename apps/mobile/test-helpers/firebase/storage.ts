import { FirebaseStorageTypes } from "@react-native-firebase/storage";

export interface MockRefArgs {
  bucket: string;
  fullPath: string;
  name: string;
  root: FirebaseStorageTypes.Reference;
  parent: FirebaseStorageTypes.Reference;
  downloadURL: string;
}

export function createMockedStorageRef({
  bucket, fullPath, name, root, parent, downloadURL
}: MockRefArgs
) {
  const mockDelete = jest.fn();
  const mockGetDownloadURL = jest.fn().mockResolvedValue(downloadURL);
  const mockGetMetadata = jest.fn();
  const mockList = jest.fn();
  const mockListAll = jest.fn();
  const mockPut = jest.fn();
  const mockPutFile = jest.fn();
  const mockPutString = jest.fn();
  const mockUpdateMetadata = jest.fn();

  const mockChild: jest.MockedFunction<FirebaseStorageTypes.Reference["child"]> = jest.fn().mockImplementation(function (this: FirebaseStorageTypes.Reference, path: string) {
    const childFullPath = `${fullPath}/${path}`;
    return createMockedStorageRef({
      bucket,
      fullPath: childFullPath,
      name: path,
      root,
      parent: this,
      downloadURL: `${downloadURL}/${path}`
    });
  });
  const mockToString = jest.fn().mockReturnValue(fullPath);
  const mockWriteToFile = jest.fn();

  const replacementImplementation: FirebaseStorageTypes.Reference = {
    bucket,
    fullPath,
    name,
    root,
    parent,
    storage: undefined as unknown as FirebaseStorageTypes.Module,

    delete: mockDelete,
    getDownloadURL: mockGetDownloadURL,
    getMetadata: mockGetMetadata,
    list: mockList,
    listAll: mockListAll,
    put: mockPut,
    putFile: mockPutFile,
    putString: mockPutString,
    updateMetadata: mockUpdateMetadata,

    child(this: FirebaseStorageTypes.Reference, path: string) {
      return mockChild.call(this, path);
    },
    toString: mockToString,
    writeToFile: mockWriteToFile,
  };

  return {
    mockedReference: replacementImplementation,
    mockDelete,
    mockGetDownloadURL,
    mockGetMetadata,
    mockList,
    mockListAll,
    mockPut,
    mockPutFile,
    mockPutString,
    mockUpdateMetadata,
    mockChild,
    mockToString,
    mockWriteToFile,
  };
}

export function mockStorage({
  maxDownloadRetryTime, maxOperationRetryTime, maxUploadRetryTime, refsByPath, refsByUrl
}: {
  maxDownloadRetryTime: number;
  maxOperationRetryTime: number;
  maxUploadRetryTime: number;
  refsByPath: Partial<Record<string, MockRefArgs>>;
  refsByUrl: Partial<Record<string, MockRefArgs>>;
}
) {
  const mockedRefsByPath: Partial<Record<string, ReturnType<typeof createMockedStorageRef>>> = {};
  const mockedRefsByUrl: Partial<Record<string, ReturnType<typeof createMockedStorageRef>>> = {};

  for (const [ path, args ] of Object.entries(refsByPath)) {
    if (args) {
      mockedRefsByPath[path] = createMockedStorageRef(args);
    }
  }

  for (const [ url, args ] of Object.entries(refsByUrl)) {
    if (args) {
      mockedRefsByUrl[url] = createMockedStorageRef(args);
    }
  }

  const mockRef = jest.fn().mockImplementation((path: string) => {
    const ref = mockedRefsByPath[path];
    if (ref) {
      return ref.mockedReference;
    }
    throw new Error(`No mocked ref found for path: ${path}`);
  });
  const mockRefFromURL = jest.fn().mockImplementation((url: string) => {
    const ref = mockedRefsByUrl[url];
    if (ref) {
      return ref.mockedReference;
    }
    throw new Error(`No mocked ref found for url: ${url}`);
  });

  const replacementImplementation: Omit<FirebaseStorageTypes.Module, "native" | "app" | "emitter" | "useEmulator"> = {
    maxDownloadRetryTime,
    maxOperationRetryTime,
    maxUploadRetryTime,
    ref: mockRef,
    refFromURL: mockRefFromURL,
    setMaxDownloadRetryTime: jest.fn(),
    setMaxOperationRetryTime: jest.fn(),
    setMaxUploadRetryTime: jest.fn(),
  };
  const mockStorageFactory = jest.fn<Omit<FirebaseStorageTypes.Module, "native" | "app" | "emitter" | "useEmulator">, []>().mockImplementation(() => (replacementImplementation));
  return {
    mockStorageFactory,
    mockedRefsByPath,
    mockedRefsByUrl,
    mockRef,
    mockRefFromURL,
  };
}
