import axios from "axios";
import { useState, useEffect } from "react";

//types
import { FC } from "react";

const AdminPanel: FC = () => {
  const [users, setUsers] = useState<any>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        let res: any = await axios.get("/api/users", {});
        setUsers(res);
      } catch (error: any) {
        window.alert("Failed to fetch users.\nReason: " + error.message);
      }
    };
    getUsers();
  }, []);

  return <div>{JSON.stringify(users)}</div>;
};

export default AdminPanel;
