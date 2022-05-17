import "../../styles/admin/AdminTableRow.css";
import { useState, useEffect } from "react";

import AdminTableDetailsRow from "./AdminTableDetailsRow";
import EditUserButton from "./EditUserButton";

//mui
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

//types
import { FC } from "react";
import { FullUser } from "../../slices/usersSlice";

interface propTypes {
  row: FullUser;
  index: number;
  expand: boolean;
  minimalTable: boolean;
}
const AdminTableRow: FC<propTypes> = ({ row, index, expand, minimalTable }) => {
  const [open, setOpen] = useState(false);

  const labelId = `enhanced-table-checkbox-${index}`;

  useEffect(() => {
    setOpen(expand);
  }, [expand]);

  return (
    <>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        className="admin-table-row"
        hover
        style={
          index % 2
            ? { background: "rgba(93, 130, 166, 0.63)" }
            : { background: "white" }
        }
      >
        {minimalTable && (
          <TableCell
            sx={{ width: "fit-content", paddingLeft: 0, paddingRight: 0 }}
          >
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        <TableCell
          className="table-cell"
          align="center"
          component="th"
          id={labelId}
          scope="row"
          padding="normal"
        >
          {row._id}
        </TableCell>
        <TableCell className="table-cell" align="center">
          {row.role}
        </TableCell>
        <TableCell className="table-cell" align="center">
          {row.username}
        </TableCell>
        {!minimalTable && (
          <>
            <TableCell className="table-cell" align="center">
              {row.firstname}
            </TableCell>
            <TableCell className="table-cell" align="center">
              {row.lastname}
            </TableCell>
            <TableCell className="table-cell" align="center">
              {row.email}
            </TableCell>
            <TableCell className="table-cell" align="center">
              {row.registration_date}
            </TableCell>
            <TableCell className="table-cell" align="center">
              {row.last_sign_in}
            </TableCell>
            <TableCell className="table-cell" align="center">
              <EditUserButton user={row} />
            </TableCell>
          </>
        )}
      </TableRow>
      {minimalTable && (
        <AdminTableDetailsRow row={row} open={open} index={index} />
      )}
    </>
  );
};

export default AdminTableRow;
