//mui
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
//mui utils
import { visuallyHidden } from "@mui/utils";

//types
import { FC } from "react";
import { FullUser } from "../../slices/usersSlice";
type Order = "asc" | "desc";

interface HeadCell {
  id: keyof FullUser;
  label: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: "_id",
    label: "_id",
  },
  {
    id: "role",
    label: "Role",
  },
  {
    id: "username",
    label: "Username",
  },
  {
    id: "firstname",
    label: "First Name",
  },
  {
    id: "lastname",
    label: "Last Name",
  },
  {
    id: "email",
    label: "Email",
  },
  {
    id: "registration_date",
    label: "Registration Date",
  },
  {
    id: "last_sign_in",
    label: "Last Sign In",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof FullUser
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}
interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof FullUser
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

const EnhancedTableHead: FC<EnhancedTableProps> = ({
  order,
  orderBy,
  onRequestSort,
}) => {
  const createSortHandler =
    (property: keyof FullUser) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default EnhancedTableHead;
