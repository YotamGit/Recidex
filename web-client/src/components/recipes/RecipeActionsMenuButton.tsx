import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecipeModerationButton from "../recipe_moderation/RecipeModerationButton";
import RecipePrivacyApprovalMenuButton from "../recipe_editor/RecipePrivacyApprovalMenuButton";

//mui
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";

//mui icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FlakyIcon from "@mui/icons-material/Flaky";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import PrivacyTipRoundedIcon from "@mui/icons-material/PrivacyTipRounded";

//redux
import { useAppSelector, useAppDispatch } from "../../hooks";
//types
import { FC } from "react";
import { TRecipe } from "../../slices/recipesSlice";

interface propTypes {
  recipe: TRecipe;
}
const RecipeActionsMenuButton: FC<propTypes> = ({ recipe }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userData = useAppSelector((state) => state.users.userData);
  const [isModerator, setIsModerator] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const [disableButton, setDisableButton] = useState(false);

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };

  useEffect(() => {
    let moderator = ["admin", "moderator"].includes(userData.role || "");
    setIsModerator(moderator);
    setIsOwner(recipe.owner?._id === userData._id);
  }, [userData]);

  return (
    <>
      <Tooltip title="Actions" arrow>
        <IconButton onClick={handleClick}>
          <MoreVertIcon className="icon" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorElement}
        className="recipe-actions-menu"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          key="edit"
          onClick={() => navigate(`/recipes/edit/${recipe._id}`)}
          disabled={!(isOwner || isModerator)}
        >
          <ListItemIcon>
            <EditRoundedIcon />
          </ListItemIcon>
          Edit Recipe
        </MenuItem>

        {isOwner && [
          <RecipePrivacyApprovalMenuButton
            kind="privacy"
            key="change-privacy"
            recipe={recipe}
            handleCloseDialog={handleClose}
          />,
          <RecipePrivacyApprovalMenuButton
            kind="approval"
            key="request-approval"
            recipe={recipe}
            handleCloseDialog={handleClose}
          />,
        ]}

        {isModerator &&
          !recipe.private && [
            recipe.approval_required
              ? [
                  <Divider key="divider" />,
                  <RecipeModerationButton
                    key="approve"
                    kind="approve"
                    type="listItem"
                    recipe={recipe}
                    setDisabled={setDisableButton}
                    disabled={disableButton}
                    handleCloseDialog={handleClose}
                    fromModerationPage={false}
                  />,
                  <RecipeModerationButton
                    key="disapprove"
                    kind="disapprove"
                    type="listItem"
                    recipe={recipe}
                    setDisabled={setDisableButton}
                    disabled={disableButton}
                    handleCloseDialog={handleClose}
                    fromModerationPage={false}
                  />,
                ]
              : recipe.approved && [
                  <Divider key="divider" />,
                  <RecipeModerationButton
                    key={"disapprove"}
                    kind={"disapprove"}
                    type="listItem"
                    recipe={recipe}
                    setDisabled={setDisableButton}
                    disabled={disableButton}
                    handleCloseDialog={handleClose}
                    fromModerationPage={false}
                  />,
                ],
          ]}
      </Menu>
    </>
  );
};

export default RecipeActionsMenuButton;
