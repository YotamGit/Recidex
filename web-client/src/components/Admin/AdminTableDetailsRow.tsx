import EditUserButton from "./EditUserButton";

//mui
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";

//types
import { FC } from "react";
import { FullUser } from "../../slices/usersSlice";

interface propTypes {
  row: FullUser;
  open: boolean;
}

const AdminTableDetailsRow: FC<propTypes> = ({ row, open }) => {
  return (
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
                  <TableCell align="center">{row.registration_date}</TableCell>
                  <TableCell align="center">{row.last_sign_in}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <EditUserButton user={row} />
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export default AdminTableDetailsRow;
