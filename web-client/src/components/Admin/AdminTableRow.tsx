import "../../styles/admin/AdminTableRow.css";
import { useState, useEffect } from "react";
import EditUserButton from "./EditUserButton";

//mui
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

//types
import { FC } from "react";
import { FullUser } from "../../slices/usersSlice";

interface propTypes {
  row: FullUser;
  index: number;
  expand: boolean;
}
const AdminTableRow: FC<propTypes> = ({ row, index, expand }) => {
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
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
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
      </TableRow>
      <TableRow className="admin-table-details-row">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="user-details">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">First Name</TableCell>
                    <TableCell align="center">Last Name</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Registration Date</TableCell>
                    <TableCell align="center">Last Sign In</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">{row.firstname}</TableCell>
                    <TableCell align="center">{row.lastname}</TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">
                      {row.registration_date}
                    </TableCell>
                    <TableCell align="center">{row.last_sign_in}</TableCell>
                    {/* <TableCell align="center">
                    </TableCell> */}
                  </TableRow>
                </TableBody>
              </Table>
              <EditUserButton user={row} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default AdminTableRow;
