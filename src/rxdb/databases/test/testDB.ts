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

import { addRxPlugin } from "rxdb";
import { RxDBAttachmentsPlugin } from "rxdb/plugins/attachments";
addRxPlugin(RxDBAttachmentsPlugin);

export const TEST_SchemaLiteral = {
  title: "test schema",
  description: "describes a human being",
  version: 0,
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
  attachments: {
    encrypted: true, // if true, the attachment-data will be encrypted with the db-password
  },
  required: ["firstName", "lastName", "passportId"],
  indexes: ["firstName"],
} as const; // <- It is important to set 'as const' to preserve the literal type

const schemaTyped = toTypedRxJsonSchema(TEST_SchemaLiteral);

// aggregate the document type from the schema
export type TEST_DocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

// create the typed RxJsonSchema from the literal typed object.
export const test_Schema: RxJsonSchema<TEST_DocType> = TEST_SchemaLiteral;

export type TEST_DocMethods = {
  scream: (v: string) => string;
};

export type TEST_Document = RxDocument<TEST_DocType, TEST_DocMethods>;

// we declare one static ORM-method for the collection
export type TEST_CollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

// and then merge all our types
export type TEST_Collection = RxCollection<
  TEST_DocType,
  TEST_DocMethods,
  TEST_CollectionMethods
>;

export type TESTDB_Collections = {
  heroes: TEST_Collection;
};

export type TEST_DB = RxDatabase<TESTDB_Collections>;

/**
 * create database and collections
 */
const testDB: TEST_DB = await createRxDatabase<TESTDB_Collections>({
  name: "mydb",
  storage: getRxStorageDexie(),
});

const TEST_DocMethods: TEST_DocMethods = {
  scream: function (this: TEST_Document, what: string) {
    return this.firstName + " screams: " + what.toUpperCase();
  },
};

const TEST_CollectionMethods: TEST_CollectionMethods = {
  countAllDocuments: async function (this: TEST_Collection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  },
};

const createCollection = async () => {
  await testDB.addCollections({
    heroes: {
      schema: test_Schema,
      methods: TEST_DocMethods,
      statics: TEST_CollectionMethods,
    },
  });
};

export const addDoc = async (): Promise<TEST_Document> => {
  await createCollection();
  const doc = await testDB.heroes.insert({
    passportId: "myId",
    firstName: "piotr",
    lastName: "potter",
    age: 5,
  });
  console.log(doc.toJSON());
  return doc;
};
