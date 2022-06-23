import { useEffect, useState } from "react";
import "../../styles/account/UserProfileInfoSection.css";

import { getProfileInfo } from "../../utils-module/users";
import UserProfileInfoSectionSkeleton from "../skeletons/UserProfileInfoSectionSkeleton";

//types
import { FC } from "react";

interface propTypes {
  userId: string;
}
const UserProfileInfoSection: FC<propTypes> = ({ userId }) => {
  const [userData, setUserData] = useState<any>();
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setUserData(undefined);
      setFetching(true);
      const res = await getProfileInfo(userId || "");
      if (res) {
        setUserData(res);
      }
      setFetching(false);
    };
    fetchUserData();
  }, [userId]);

  return fetching ? (
    <UserProfileInfoSectionSkeleton />
  ) : (
    <>
      {userData && (
        <div className="user-profile-info-section">
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
        </div>
      )}
    </>
  );
};

export default UserProfileInfoSection;
