import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  RxDocument,
  RxCollection,
} from "rxdb";

import { addRxPlugin } from "rxdb";
import { RxDBAttachmentsPlugin } from "rxdb/plugins/attachments";
import { orderlyDB } from "./orderlyDB";
import { useEffect, useState } from "react";
addRxPlugin(RxDBAttachmentsPlugin);

export const publishersSchemaLiteral = {
  title: "publishers schema",
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
  // attachments: {
  //   encrypted: true, // if true, the attachment-data will be encrypted with the db-password
  // },
  required: ["firstName", "lastName", "passportId"],
  indexes: ["firstName"],
} as const; // <- It is important to set 'as const' to preserve the literal type

const schemaTyped = toTypedRxJsonSchema(publishersSchemaLiteral);

// aggregate the document type from the schema
export type PublishersDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export type PublishersDocMethods = {
  scream: (v: string) => string;
};

export type PublishersDocument = RxDocument<
  PublishersDocType,
  PublishersDocMethods
>;

// we declare one static ORM-method for the collection
export type PublishersCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

// and then merge all our types
export type PublishersCollection = RxCollection<
  PublishersDocType,
  PublishersDocMethods,
  PublishersCollectionMethods
>;

export type PublishersCollections = {
  heroes: PublishersCollection;
};

// create the typed RxJsonSchema from the literal typed object.
export const publishersSchema: RxJsonSchema<PublishersDocType> =
  publishersSchemaLiteral;

export const addPublisher = async (
  publisher: PublishersDocType
): Promise<PublishersDocument> => {
  const doc = await orderlyDB.publishers.insert(publisher);
  return doc;
};

export const publishersDocMethods: PublishersDocMethods = {
  scream: function (this: PublishersDocument, what: string) {
    return this.firstName + " screams: " + what.toUpperCase();
  },
};

export const publishersCollectionMethods: PublishersCollectionMethods = {
  countAllDocuments: async function (this: PublishersCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  },
};

export const usePublishersCollection = () => {
  const [data, setData] = useState<PublishersDocument[]>();

  useEffect(() => {
    const subscription = orderlyDB.publishers
      .find()
      .$.subscribe((changeEvent) => {
        setData(changeEvent);
      });

    return () => subscription.unsubscribe();
  }, []);

  return data?.map(({ firstName, lastName, passportId, age }) => {
    return { firstName, lastName, passportId, age };
  });
};
