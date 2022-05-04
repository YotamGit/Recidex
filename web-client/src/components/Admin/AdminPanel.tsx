import axios from "axios";
import "../../styles/admin/AdminPanel.css";
import { useState, useEffect } from "react";

import EnhancedTableHead from "./EnhancedTableHead";
import EditUserButton from "./EditUserButton";
import AdminKpis from "./AdminKpis";

//mui
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import Checkbox from "@mui/material/Checkbox";

//redux
import { getUsers } from "../../slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

//types
import { FC } from "react";
import { FullUser } from "../../slices/usersSlice";
type Order = "asc" | "desc";

const AdminPanel: FC = () => {
  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.users.users) || [];

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof FullUser>("role");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getUsers({}));
  }, []);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof FullUser
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
  ) => number {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  return (
    <div className="admin-panel-page">
      <AdminKpis />
      <TableContainer className="table-container">
        <Table
          stickyHeader
          style={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
        >
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={users.length}
          />
          <TableBody>
            {users
              .slice()
              .sort(getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: FullUser, index: number) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover tabIndex={-1} key={row._id}>
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
                    <TableCell align="center">{row.firstname}</TableCell>
                    <TableCell align="center">{row.lastname}</TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">
                      {row.registration_date}
                    </TableCell>
                    <TableCell align="center">{row.last_sign_in}</TableCell>
                    <TableCell align="center">
                      <EditUserButton user={row} />
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow>
                <TableCell colSpan={10} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, users.length].sort((a, b) => a - b)}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default AdminPanel;
