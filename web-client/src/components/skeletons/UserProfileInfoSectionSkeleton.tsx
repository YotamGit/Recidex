import "../../styles/skeletons/UserProfileInfoSectionSkeleton.css";

//mui
import Skeleton from "@mui/material/Skeleton";

//types
import { FC } from "react";

const UserProfileInfoSectionSkeleton: FC = () => {
  return (
    <div className="user-profile-info-section-skeleton">
      <div className="user-name-container-skeleton">
        <Skeleton className="role-skeleton" variant="text" />
        <Skeleton className="name-skeleton" variant="text" />
        <Skeleton className="date-skeleton" variant="text" />
      </div>
      <div className="user-profile-kpis-skeleton" style={{ width: "100%" }}>
        <div className="user-profile-kpi-skeleton">
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </div>
        <div className="user-profile-kpi-skeleton">
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </div>
        <div className="user-profile-kpi-skeleton">
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfoSectionSkeleton;
