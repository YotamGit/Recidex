import { CourierClient } from "@trycourier/courier";

export async function emailNewUser(newUser) {
  try {
    const courier = CourierClient({
      authorizationToken: process.env.EMAIL_NOTIFICATION_AUTH_TOKEN,
    });
    const emailRes = await courier.send({
      message: {
        to: {
          email: newUser.email,
        },
        template: process.env.USER_SIGNUP_EMAIL_TOKEN,
        data: {
          registrationDate: new Date(newUser.registration_date).toLocaleString(
            "he-IL",
            {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            }
          ),
          username: newUser.username,
          userId: newUser._id,
          name: {
            first: newUser.firstname,
            last: newUser.lastname,
          },
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
}

export async function emailUserRecipeApproved({
  recipe,
  owner,
  moderator,
} = {}) {
  try {
    console.log(recipe, owner, moderator);
    const courier = CourierClient({
      authorizationToken: process.env.EMAIL_NOTIFICATION_AUTH_TOKEN,
    });
    const emailRes = await courier.send({
      message: {
        to: {
          email: owner.email,
        },
        template: process.env.RECIPE_APPROVED_EMAIL_TOKEN,
        data: {
          name: {
            first: owner.firstname,
            last: owner.lastname,
          },
          recipeTitle: recipe.title,
          recipeId: recipe._id,
          approvedBy: `${moderator.firstname} ${moderator.lastname}`,
          approvalDate: new Date(Date.now()).toLocaleString("he-IL", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
}
export async function emailUserRecipeDisapproved({
  recipe,
  owner,
  moderator,
  reason,
} = {}) {
  try {
    const courier = CourierClient({
      authorizationToken: process.env.EMAIL_NOTIFICATION_AUTH_TOKEN,
    });
    const emailRes = await courier.send({
      message: {
        to: {
          email: owner.email,
        },
        template: process.env.RECIPE_DISAPPROVED_EMAIL_TOKEN,
        data: {
          name: {
            first: owner.firstname,
            last: owner.lastname,
          },
          recipeTitle: recipe.title,
          recipeId: recipe._id,
          disapprovedBy: `${moderator.firstname} ${moderator.lastname}`,
          disapprovalDate: new Date(Date.now()).toLocaleString("he-IL", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
          disapproveReason: reason,
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
}
