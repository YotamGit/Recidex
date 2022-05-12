import "../../styles/app_bar/DrawerItem.css";
import { useNavigate } from "react-router-dom";

//mui
import Divider from "@mui/material/Divider";

//types
import { FC } from "react";

interface propTypes {
  visible: boolean;
  addDivider: boolean;
  currentPageUrl: string;
  pageUrl?: string;
  text: string;
  closeDrawer: Function;
  onClick?: Function;
  Icon: any;
  style?: React.CSSProperties;
}

const DrawerItem: FC<propTypes> = ({
  visible,
  currentPageUrl,
  addDivider,
  pageUrl,
  text,
  closeDrawer,
  onClick,
  Icon,
  style,
}) => {
  const navigate = useNavigate();

  return visible ? (
    <>
      {addDivider && <Divider />}
      <span
        style={style}
        className={`${
          currentPageUrl === pageUrl ? "active-page " : ""
        }drawer-button-wrapper`}
        onClick={() => {
          onClick && onClick();
          navigate(pageUrl || "/home");
          closeDrawer();
        }}
      >
        <Icon className="drawer-button" />
        {text}
      </span>
    </>
  ) : (
    <span></span>
  );
};

export default DrawerItem;
