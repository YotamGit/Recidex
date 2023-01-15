import PageTitle from "./utilities/PageTitle";
import SocialIcon from "./buttons/SocialIcon";

//types
import { FC } from "react";

const AboutPage: FC = () => {
  return (
    <div>
      <PageTitle marginTop={true} style={{ marginBottom: "3rem" }} />
      <div className="about-content">
        {`Welcome to Recidex, the ultimate destination for all things food! Founded by Yotam Golan, our community-driven recipe platform allows users to upload their favorite dishes for others to try. With a diverse range of cuisines and cooking styles represented, there's something for everyone on Recidex.

        If you're a seasoned chef or just starting out in the kitchen, you'll find plenty of inspiration and guidance on our site. From mouth-watering main courses to delectable desserts, we've got you covered.

        Want to learn more about Yotam and the team behind Recidex? Check out Yotam's GitHub profile for a look at his technical skills, or connect with him on LinkedIn for more information about his background and experience.

        So why wait? Start exploring the endless culinary possibilities on Recidex today! Happy cooking!`}
      </div>
      <div className="socials">
        <SocialIcon social={"github"} />
        <SocialIcon social={"linkedin"} />
      </div>
    </div>
  );
};

export default AboutPage;
