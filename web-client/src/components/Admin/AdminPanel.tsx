import axios from "axios";
import "../../styles/admin/AdminPanel.css";
import { useState, useEffect } from "react";

import AdminTable from "./AdminTable";
import AdminKpis from "./AdminKpis";
import PageTitle from "../PageTitle";

//redux
import { getUsers } from "../../slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

//types
import { FC } from "react";

const AdminPanel: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsers({}));
  }, []);

  return (
    <div className="admin-panel-page">
      <PageTitle style={{ marginTop: "1rem" }} />
      <AdminKpis />
      <AdminTable />
    </div>
  );
};

export default AdminPanel;
