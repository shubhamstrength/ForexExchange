export const DBConfig = {
    name: 'forexDB',
    version: 1,
    objectStoresMeta: [
      {
        store: 'forex',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
          { date: 'date', keypath: 'date', options: { unique: false } },
          { event: 'event', keypath: 'event', options: { unique: false } }
        ]
      }
    ]
  };