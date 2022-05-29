import axios from "axios";
import { useEffect, useState } from "react";
import "../../styles/account/UserProfileInfoSection.css";

//redux
import { useAppDispatch } from "../../hooks";
import { setAlert } from "../../slices/utilitySlice";

//types
import { FC } from "react";

interface propTypes {
  user_id: string;
}
const UserProfileInfoSection: FC<propTypes> = ({ user_id }) => {
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState<any>();

  const getUserInfo = async () => {
    try {
      var result = await axios.get(`/api/users/user/info/${user_id}`);
      setUserData(result.data);
    } catch (err: any) {
      dispatch(
        setAlert({
          severity: "error",
          title: "Error",
          message: "Failed to Fetch User Info.",
          details: err.response.data ? err.response.data : undefined,
        })
      );
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [user_id]);

  return (
    <div className="user-profile-info-section">
      {userData && (
        <>
          <div className="user-name-container">
            <div className="user-role-flare">{userData?.userInfo.role}</div>
            <div className="user-name">
              {`${userData?.userInfo.firstname} ${userData?.userInfo.lastname}`}
            </div>
            <div className="registration-date-container">
              <span className="registration-date-title">Member since:</span>
              <span className="registration-date">
                {userData.userInfo.registration_date &&
                  new Date(userData.userInfo.registration_date).toLocaleString(
                    "he-IL",
                    {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    }
                  )}
              </span>
            </div>
          </div>
          <div className="user-profile-kpis">
            <div className="user-profile-kpi">
              <div>{"Public"}</div>
              <div>{userData.metrics.publicRecipesCount}</div>
            </div>
            <div className="user-profile-kpi">
              <div>{"Approved"}</div>
              <div>{userData.metrics.approvedRecipesCount}</div>
            </div>
            <div className="user-profile-kpi">
              <div>{"Favorites"}</div>
              <div>{userData.metrics.favoriteRecipesCount}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfileInfoSection;
