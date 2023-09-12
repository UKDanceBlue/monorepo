import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

type LimitedFirestoreModule = Omit<FirebaseFirestoreTypes.Module, "native" | "app" | "emitter" | "useEmulator">;

interface MockedSubCollection<T> {documents: Partial<Record<string, FirebaseFirestoreTypes.DocumentData>>; collections: Partial<Record<string, T>>}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MockedCollection extends MockedSubCollection<MockedCollection> {}
type MockedFirestore = Partial<Record<string, MockedCollection>>;

function extractDocDataByPath<T extends FirebaseFirestoreTypes.DocumentData = FirebaseFirestoreTypes.DocumentData>(path: string, mockedData: MockedFirestore, firestoreModuleGetter: () => LimitedFirestoreModule): FirebaseFirestoreTypes.DocumentSnapshot<T> {
  // id is the last part of the path, the rest is the parent path, if any
  const [ id, ...rest ] = path.split("/").reverse();

  let current: MockedCollection | undefined = mockedData[rest[0]];
  if (current == null) {
    throw new Error(`No collection found at path ${path}`);
  }

  for (let i = 1; i < rest.length; i++) {
    current = current.collections[rest[i]];
    if (current == null) {
      throw new Error(`No collection found at path ${path}`);
    }
  }

  return {
    id,
    data: () => current?.documents[id] as T | undefined,
    exists: current.documents[id] != null,
    get: (fieldPath: FirebaseFirestoreTypes.FieldPath | keyof T) => {
      const data = current?.documents[id];
      if (data == null) {
        throw new Error(`No document found at path ${path}`);
      }
      if (typeof fieldPath === "string") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data[fieldPath] as T[typeof fieldPath];
      } else {
        throw new Error("Not implemented"); // TODO
      }
    },
    isEqual: () => { throw new Error("Not implemented"); }, // TODO
    ref: extractDocRefByPath(path, mockedData, firestoreModuleGetter),
    metadata: {
      fromCache: false,
      hasPendingWrites: false,
      isEqual: () => { throw new Error("Not implemented"); }, // TODO
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function extractCollectionRefByPath<T extends FirebaseFirestoreTypes.DocumentData = FirebaseFirestoreTypes.DocumentData>(path:string, mockedData: MockedFirestore): FirebaseFirestoreTypes.CollectionReference<T> {
  throw new Error("Not implemented"); // TODO
}
function extractDocRefByPath<T extends FirebaseFirestoreTypes.DocumentData = FirebaseFirestoreTypes.DocumentData>(path:string, mockedData: MockedFirestore, firestoreModuleGetter: () => LimitedFirestoreModule): FirebaseFirestoreTypes.DocumentReference<T> {
  return {
    collection: (collectionPath: string) => extractCollectionRefByPath(`${path}/${collectionPath}`, mockedData),
    firestore: firestoreModuleGetter() as FirebaseFirestoreTypes.Module,
    id: path.split("/").reverse()[0],
    onSnapshot: () => { throw new Error("Not implemented"); }, // TODO
    isEqual: () => { throw new Error("Not implemented"); }, // TODO
    parent: extractCollectionRefByPath<T>(path.split("/").slice(0, -1).join("/"), mockedData),
    path,
    get: () => Promise.resolve(extractDocDataByPath(path, mockedData, firestoreModuleGetter)),
    set: () => { throw new Error("Not implemented"); }, // TODO
    update: () => { throw new Error("Not implemented"); }, // TODO
    delete: () => { throw new Error("Not implemented"); }, // TODO
  };
}

export function createMockedFirestoreCollection<
  T extends FirebaseFirestoreTypes.DocumentData = FirebaseFirestoreTypes.DocumentData
>(
  mockedData: MockedFirestore,
  collection: MockedCollection,
  collectionName: string,
  path: string,
  firestoreModuleGetter: () => LimitedFirestoreModule
): FirebaseFirestoreTypes.CollectionReference<T> {
  const collectionRef: FirebaseFirestoreTypes.CollectionReference<T> = {
    id: collectionName,
    parent: null, // TODO
    path,
    doc: (documentPath: string) => extractDocRefByPath(`${path}/${documentPath}`, mockedData, firestoreModuleGetter),
    where: jest.fn().mockRejectedValue(new Error("NYI (where)")),
    add: jest.fn().mockRejectedValue(new Error("NYI (add)")),
    get: jest.fn().mockRejectedValue(new Error("NYI (get)")),
    onSnapshot: jest.fn().mockRejectedValue(new Error("NYI (onSnapshot)")),
    orderBy: jest.fn().mockRejectedValue(new Error("NYI (orderBy)")),
    startAfter: jest.fn().mockRejectedValue(new Error("NYI (startAfter)")),
    startAt: jest.fn().mockRejectedValue(new Error("NYI (startAt)")),
    endAt: jest.fn().mockRejectedValue(new Error("NYI (endAt)")),
    endBefore: jest.fn().mockRejectedValue(new Error("NYI (endBefore)")),
    limit: jest.fn().mockRejectedValue(new Error("NYI (limit)")),
    isEqual: jest.fn().mockRejectedValue(new Error("NYI (isEqual)")),
    limitToLast: jest.fn().mockRejectedValue(new Error("NYI (limitToLast)")),
  };
  return collectionRef;
}

export function mockFirestore({
  mockedData, strictMode = false
}: {
  mockedData: MockedFirestore;
  strictMode: boolean;
}) {
  // eslint-disable-next-line prefer-const
  let replacementImplementation: LimitedFirestoreModule;

  const fallbackSyncMethodImplementation = (name: string) => (strictMode ? jest.fn().mockRejectedValue(new Error(`NYI (${name})`)) : jest.fn());
  const fallbackAsyncMethodImplementation = (name: string) => (strictMode ? jest.fn().mockRejectedValue(new Error(`NYI (${name})`)) : jest.fn().mockResolvedValue(undefined));

  const mockBatch = fallbackSyncMethodImplementation("batch");
  const mockClearPersistence = fallbackAsyncMethodImplementation("clearPersistence");
  const mockCollection = jest.fn().mockImplementation((path: string) => extractCollectionRefByPath(path, mockedData));
  const mockCollectionGroup = fallbackAsyncMethodImplementation("collectionGroup");
  const mockDisableNetwork = fallbackAsyncMethodImplementation("disableNetwork");
  const mockDoc = jest.fn().mockImplementation((path: string) => extractDocRefByPath(path, mockedData, () => replacementImplementation));
  const mockLoadBundle = fallbackAsyncMethodImplementation("loadBundle");
  const mockEnableNetwork = fallbackAsyncMethodImplementation("enableNetwork");
  const mockNamedQuery = fallbackSyncMethodImplementation("namedQuery");
  const mockRunTransaction = fallbackAsyncMethodImplementation("runTransaction");
  const mockSettings = fallbackAsyncMethodImplementation("settings");
  const mockTerminate = fallbackAsyncMethodImplementation("terminate");
  const mockWaitForPendingWrites = fallbackAsyncMethodImplementation("waitForPendingWrites");

  replacementImplementation = {
    batch: mockBatch,
    clearPersistence: mockClearPersistence,
    collection: mockCollection,
    collectionGroup: mockCollectionGroup,
    disableNetwork: mockDisableNetwork,
    doc: mockDoc,
    loadBundle: mockLoadBundle,
    enableNetwork: mockEnableNetwork,
    namedQuery: mockNamedQuery,
    runTransaction: mockRunTransaction,
    settings: mockSettings,
    terminate: mockTerminate,
    waitForPendingWrites: mockWaitForPendingWrites,
  };

  const mockFirestoreFactory: jest.Mock<LimitedFirestoreModule, []> = jest.fn<LimitedFirestoreModule, []>().mockImplementation(() => (replacementImplementation));
  return {
    mockFirestoreFactory,
    mockBatch,
    mockClearPersistence,
    mockCollection,
    mockCollectionGroup,
    mockDisableNetwork,
    mockDoc,
    mockLoadBundle,
    mockEnableNetwork,
    mockNamedQuery,
    mockRunTransaction,
    mockSettings,
    mockTerminate,
    mockWaitForPendingWrites,
  };
}
