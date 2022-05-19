import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

//types
import { FC } from "react";
import UserProfile from "./UserProfile";

const UserProfilePage: FC = () => {
  const { user_id } = useParams();
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    axios
      .get(`/api/users/user/info/${user_id}`)
      .then((result) => setUserData(result.data));
  }, []);
  return (
    <>
      {"TOP BUTTON ROW"}
      {userData && (
        <UserProfile
          userInfo={userData.userInfo}
          userFavoriteRecipes={userData.userFavoriteRecipes}
          userRecipes={userData.userRecipes}
        />
      )}
    </>
  );
};

export default UserProfilePage;
