import { FC } from "react";

interface propTypes {}
const ModerationPage: FC<propTypes> = () => {
  // const dispatch = useAppDispatch();
  // const [fetching, setFetching] = useState(false);
  // const [recipes, setRecipes] = useState();

  // const loadRecipes = async () => {
  //   if (recipes.length > 0) {
  //     setFetching(true);
  //     await dispatch(
  //       getRecipes({
  //         replace: false,
  //         args: {
  //           latest: recipes.at(-1)?.creation_time,
  //         },
  //       })
  //     );
  //     setFetching(false);
  //   }
  // };

  // const initialRecipesLoad = async () => {
  //   try {
  //     await dispatch(
  //       getRecipes({
  //         replace: true,
  //       })
  //     );
  //   } catch (error) {}
  // };

  // useEffect(() => {
  //   if (attemptSignIn) {
  //     return;
  //   }

  //   let lastMainPageVisited = [...routeHistory]
  //     .slice(0, routeHistory.length - 1)
  //     .reverse()
  //     .find((element) =>
  //       ["/home", "/my-recipes", "/favorites", "/recipe-moderation"].includes(
  //         element
  //       )
  //     );

  //   if (
  //     ["/home", "/my-recipes", "/favorites", "/recipe-moderation"].includes(
  //       routeHistory.slice(-1)[0]
  //     ) ||
  //     location.pathname !== lastMainPageVisited ||
  //     (recipes.length === 0 && !fetchedAllRecipes)
  //   ) {
  //     dispatch(setfavoritesOnly(favoritesOnly));
  //     dispatch(setOwnerOnly(ownerOnly));
  //     initialRecipesLoad();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [ownerOnly, favoritesOnly, attemptSignIn, location]);

  return <div>ModerationPage</div>;
};

export default ModerationPage;
