import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Modal from "@/components/Modal";
import { useContext, useRef } from "react";
import { DataContext } from "@/data/data-context";

export type Space = {
  id: string;
  name: string;
  roomId: string;
};

export const spaceColumns: ColumnDef<Space>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "roomId",
    header: "Room Id",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const space = row.original;
      const editModal = useRef();
      const deleteModal = useRef();
      const { useEntry } = useContext(DataContext); // Get useEntry function from DataContext

      async function handleSpaceDelete() {
        try {
          const action = {
            type: "spaces",
            method: "delete",
            data: {
              id: space.id
            },
          };
          // Call the useEntry function to delete the space
          useEntry(action);
          console.log(`Space with ID ${space.id} deleted successfully`);
        } catch (error) {
          console.error('Error deleting space:', error);
        }
      }

      function handleDropdownSelect(selected) {
        if (selected === "edit") {
          editModal.current.open();
        } else if (selected === "delete") {
          deleteModal.current.open(space); 
        }
      }

      return (
        <>
          <Modal
            buttonCaption="Edit Entry"
            buttonVariant="blue"
            ref={editModal}
          >
            <p>Edit</p>
          </Modal>
          <Modal
            buttonCaption="Delete Entry"
            buttonVariant="red"
            ref={deleteModal}
            onSubmit={handleSpaceDelete}
          >
            <p>Are you sure you want to delete?</p>
          </Modal>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleDropdownSelect('edit')}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDropdownSelect('delete')}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
