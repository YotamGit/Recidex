//mui
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";

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

const minimalHeadCells: readonly HeadCell[] = [
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
];

const maximalHeadCells: readonly HeadCell[] = [
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
  {
    id: "public_recipes_count",
    label: "Public Recipes",
  },
  {
    id: "approval_required_recipes_count",
    label: "Approval Required Recipes",
  },
  {
    id: "approved_recipes_count",
    label: "Approved Recipes",
  },
  {
    id: "private_recipes_count",
    label: "Private Recipes",
  },
  {
    id: "total_recipes_count",
    label: "Total Recipes",
  },
];

interface EnhancedTableProps {
  setExpandTable: Function;
  expandTable: boolean;
  minimalTable: boolean;
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
  expandTable,
  setExpandTable,
  minimalTable,
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
        {minimalTable && (
          <TableCell
            sx={{ width: "fit-content", paddingLeft: 0, paddingRight: 0 }}
          >
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setExpandTable(!expandTable)}
            >
              {expandTable ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </TableCell>
        )}
        {(minimalTable ? minimalHeadCells : maximalHeadCells).map(
          (headCell) => (
            <TableCell
              align="center"
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
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          )
        )}
        {!minimalTable && <TableCell padding="checkbox"></TableCell>}
      </TableRow>
    </TableHead>
  );
};

export default EnhancedTableHead;
