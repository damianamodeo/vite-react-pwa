import { RxDatabase, createRxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

import { addRxPlugin } from "rxdb";
import { RxDBAttachmentsPlugin } from "rxdb/plugins/attachments";
import {
  PublishersCollection,
  publishersCollectionMethods,
  publishersDocMethods,
  publishersSchema,
} from "./publishers";
addRxPlugin(RxDBAttachmentsPlugin);

export type OrderlyCollections = {
  publishers: PublishersCollection;
};

export type OrderlyDB = RxDatabase<OrderlyCollections>;

/**
 * create database and collections
 */
export const orderlyDB: OrderlyDB = await createRxDatabase<OrderlyCollections>({
  name: "orderly",
  storage: getRxStorageDexie(),
});

export const createOrderlyDBCollections = async () => {
  await orderlyDB.addCollections({
    publishers: {
      schema: publishersSchema,
      methods: publishersDocMethods,
      statics: publishersCollectionMethods,
    },
  });

  console.log("OrderlyDB collections created");
};
