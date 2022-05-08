import "../../styles/admin/AdminTableDetailsRow.css";
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
  index: number;
}

const AdminTableDetailsRow: FC<propTypes> = ({ row, open, index }) => {
  return (
    <TableRow
      className="admin-table-details-row"
      style={
        index % 2
          ? { background: "rgb(224, 224, 224)" }
          : { background: "white" }
      }
    >
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
              Details
            </Typography>
            <Table
              className="details-row-table"
              size="small"
              aria-label="user-details"
            >
              <TableBody>
                <TableRow>
                  <TableRow>
                    <TableCell align="left">First Name</TableCell>
                    <TableCell align="left">{row.firstname}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">Last Name</TableCell>
                    <TableCell align="left">{row.lastname}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">Email</TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">Registration Date</TableCell>
                    <TableCell align="left">{row.registration_date}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">Last Sign In</TableCell>
                    <TableCell align="left">{row.last_sign_in}</TableCell>
                  </TableRow>
                </TableRow>
              </TableBody>
            </Table>
            <div
              style={{
                padding: "10px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <EditUserButton user={row} />
            </div>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export default AdminTableDetailsRow;
