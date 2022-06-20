import axios from "axios";
import "../../styles/admin/AdminPanelPage.css";
import { useState, useEffect } from "react";

import AdminTable from "./AdminTable";
import AdminKpis from "./AdminKpis";
import PageTitle from "../utilities/PageTitle";

//redux
import { getUsers } from "../../slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

//types
import { FC } from "react";

const AdminPanelPage: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsers({}));
  }, []);

  return (
    <div className="admin-panel-page">
      <PageTitle marginTop={true} />
      <AdminKpis />
      <AdminTable />
    </div>
  );
};

export default AdminPanelPage;
