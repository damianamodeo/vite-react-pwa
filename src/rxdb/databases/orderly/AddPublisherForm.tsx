import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import {
  PublishersDocType,
  addPublisher,
} from ".";
import { Button } from "@/components/ui/button";

export const AddPublisherForm = () => {
  const [publisher, setPublisher] = useState<PublishersDocType>({
    firstName: "",
    lastName: "",
    passportId: "",
    age: 0,
  });

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement>,
    property: keyof PublishersDocType
  ) => {
    setPublisher({
      ...publisher,
      [property]: e.target.value,
      passportId: crypto.randomUUID(),
    });
  };

  const handleAddPublisher = async () => {
    await addPublisher(publisher);
  };

  return (
    <div className="flex flex-col gap-1">
      <Input
        type="text"
        placeholder="First Name"
        onChange={(e) => handleOnChange(e, "firstName")}
        value={publisher.firstName}
      />
      <Input
        type="text"
        placeholder="Last Name"
        onChange={(e) => handleOnChange(e, "lastName")}
        value={publisher.lastName}
      />
      <Input
        type=" number"
        placeholder="Age"
        onChange={(e) => handleOnChange(e, "age")}
        value={publisher.age}
      />
      <Button onClick={handleAddPublisher}>Add Publisher</Button>
    </div>
  );
};
