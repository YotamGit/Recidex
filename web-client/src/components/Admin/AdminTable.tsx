import "../../styles/admin/AdminTable.css";
import { useState } from "react";
import EnhancedTableHead from "./EnhancedTableHead";
import EditUserButton from "./EditUserButton";

//mui
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

//redux
import { useAppSelector } from "../../hooks";

//types
import { FC } from "react";
import { FullUser } from "../../slices/usersSlice";
import AdminTableRow from "./AdminTableRow";
type Order = "asc" | "desc";

const AdminTable: FC = () => {
  const users = useAppSelector((state) => state.users.users) || [];
  const fullscreen = useAppSelector((state) => state.utilities.fullscreen);

  const [expandTable, setExpandTable] = useState(false);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof FullUser>("role");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    <>
      <TableContainer className="table-container">
        <Table
          stickyHeader
          style={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={!fullscreen ? "small" : "medium"}
        >
          <EnhancedTableHead
            expandTable={expandTable}
            setExpandTable={setExpandTable}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={users.length}
          />
          <TableBody className="admin-table-body">
            {users
              .slice()
              .sort(getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: FullUser, index: number) => {
                return (
                  <AdminTableRow
                    key={row._id}
                    expand={expandTable}
                    row={row}
                    index={index}
                  />
                );
              })}
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
    </>
  );
};

export default AdminTable;
