import "./App.css";

import { addRxPlugin } from "rxdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { AddPublisherForm } from "./rxdb/databases/orderly/AddPublisherForm";
import { PublishersTable } from "./rxdb/databases/orderly/PublishersTable";

if (import.meta.env.DEV) {
  addRxPlugin(RxDBDevModePlugin);
}

function App() {
  return (
    <>
      <AddPublisherForm></AddPublisherForm>
      <PublishersTable></PublishersTable>
    </>
  );
}

export default App;
