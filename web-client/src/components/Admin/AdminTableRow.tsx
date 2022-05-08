import "../../styles/admin/AdminTableRow.css";
import { useState, useEffect } from "react";

import AdminTableDetailsRow from "./AdminTableDetailsRow";

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
        // style={
        //   index % 2
        //     ? { background: "rgb(224, 224, 224)" }
        //     : { background: "white" }
        // }
      >
        {minimalTable && (
          <TableCell>
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
          align="center"
          component="th"
          id={labelId}
          scope="row"
          padding="normal"
        >
          {row._id}
        </TableCell>
        <TableCell align="center">{row.role}</TableCell>
        <TableCell align="center">{row.username}</TableCell>
        {!minimalTable && (
          <>
            <TableCell align="center">{row.firstname}</TableCell>
            <TableCell align="center">{row.lastname}</TableCell>
            <TableCell align="center">{row.email}</TableCell>
            <TableCell align="center">{row.registration_date}</TableCell>
            <TableCell align="center">{row.last_sign_in}</TableCell>
          </>
        )}
      </TableRow>
      <AdminTableDetailsRow row={row} open={open} />
    </>
  );
};

export default AdminTableRow;
