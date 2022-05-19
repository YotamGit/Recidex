import Recipes from "../recipes/Recipes";

//types
import { FC } from "react";
import { TRecipe } from "../../slices/recipesSlice";
interface propTypes {
  userFavoriteRecipes: TRecipe[];
  userRecipes: TRecipe[];
  userInfo: {
    _id: string;
    firstname: string;
    lastname: string;
    registrationDate: string;
  };
}
const UserProfile: FC<propTypes> = ({
  userInfo,
  userRecipes,
  userFavoriteRecipes,
}) => {
  return (
    <div>
      <div>
        <div>user info</div>
        <div>{JSON.stringify(userInfo)}</div>
      </div>
      <div>
        <div>recipes</div>
        <Recipes recipes={userRecipes} approvalRequiredOnly={false} />
      </div>
      <div>
        <div>favorite recipes</div>
        <Recipes recipes={userFavoriteRecipes} approvalRequiredOnly={false} />
      </div>
    </div>
  );
};

export default UserProfile;
