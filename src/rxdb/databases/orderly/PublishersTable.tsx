import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePublishersCollection } from ".";

export function PublishersTable() {
  const data = usePublishersCollection();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((publisher) => (
          <TableRow key={publisher.passportId} className="text-left">
            <TableCell className="font-medium">
              {publisher.lastName}, {publisher.firstName}
            </TableCell>
            <TableCell>{publisher.age}</TableCell>
            <TableCell>{publisher.passportId}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
