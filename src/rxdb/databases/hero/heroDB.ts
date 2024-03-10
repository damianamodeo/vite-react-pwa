import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  RxDocument,
  RxCollection,
  RxDatabase,
  createRxDatabase,
} from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

export const heroSchemaLiteral = {
  title: "hero schema",
  description: "describes a human being",
  version: 0,
//   keyCompression: true,
  primaryKey: "passportId",
  type: "object",
  properties: {
    passportId: {
      type: "string",
      maxLength: 100, // <- the primary key must have set maxLength
    },
    firstName: {
      type: "string",
      maxLength: 100,
    },
    lastName: {
      type: "string",
    },
    age: {
      type: "integer",
    },
  },
  required: ["firstName", "lastName", "passportId"],
  indexes: ["firstName"],
} as const; // <- It is important to set 'as const' to preserve the literal type

const schemaTyped = toTypedRxJsonSchema(heroSchemaLiteral);

// aggregate the document type from the schema
export type HeroDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

// create the typed RxJsonSchema from the literal typed object.
export const heroSchema: RxJsonSchema<HeroDocType> = heroSchemaLiteral;

export type HeroDocMethods = {
  scream: (v: string) => string;
};

export type HeroDocument = RxDocument<HeroDocType, HeroDocMethods>;

// we declare one static ORM-method for the collection
export type HeroCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

// and then merge all our types
export type HeroCollection = RxCollection<
  HeroDocType,
  HeroDocMethods,
  HeroCollectionMethods
>;

export type MyDatabaseCollections = {
  heroes: HeroCollection;
};

export type MyDatabase = RxDatabase<MyDatabaseCollections>;

/**
 * create database and collections
 */
const myDatabase: MyDatabase = await createRxDatabase<MyDatabaseCollections>({
  name: "mydb",
  storage: getRxStorageDexie(),
});

// export const heroSchema: RxJsonSchema<HeroDocType> = {
//     title: 'human schema',
//     description: 'describes a human being',
//     version: 0,
//     keyCompression: true,
//     primaryKey: 'passportId',
//     type: 'object',
//     properties: {
//         passportId: {
//             type: 'string'
//         },
//         firstName: {
//             type: 'string'
//         },
//         lastName: {
//             type: 'string'
//         },
//         age: {
//             type: 'integer'
//         }
//     },
//     required: ['passportId', 'firstName', 'lastName']
// };

const heroDocMethods: HeroDocMethods = {
  scream: function (this: HeroDocument, what: string) {
    return this.firstName + " screams: " + what.toUpperCase();
  },
};

const heroCollectionMethods: HeroCollectionMethods = {
  countAllDocuments: async function (this: HeroCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  },
};

const createCollection = async () => {
  await myDatabase.addCollections({
    heroes: {
      schema: heroSchema,
      methods: heroDocMethods,
      statics: heroCollectionMethods,
    },
  });
};

// add a postInsert-hook
// myDatabase.heroes.postInsert(
//   function myPostInsertHook(
//     this: HeroCollection, // own collection is bound to the scope
//     docData: HeroDocType, // documents data
//     doc: HeroDocument // RxDocument
//   ) {
//     console.log("insert to " + this.name + "-collection: " + doc.firstName);
//   },
//   false // not async
// );

/**
 * use the database
 */

// insert a document
export const addHero = async (): Promise<HeroDocument> => {
  await createCollection();
  const doc = await myDatabase.heroes.insert({
    passportId: "myId",
    firstName: "piotr",
    lastName: "potter",
    age: 5,
  });
  console.log(doc.toJSON());
  return doc;
};

// const hero: HeroDocument = await myDatabase.heroes.insert({
//   passportId: "myId",
//   firstName: "piotr",
//   lastName: "potter",
//   age: 5,
// });

// access a property
// console.log(hero.firstName);

// use a orm method
// hero.scream("AAH!");

// use a static orm method from the collection
// const amount: number = await myDatabase.heroes.countAllDocuments();
// console.log(amount);

/**
 * clean up
 */
// myDatabase.destroy();
