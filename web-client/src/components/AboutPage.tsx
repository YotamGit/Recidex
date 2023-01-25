import "../styles/AboutPage.css";

import PageTitle from "./utilities/PageTitle";
import SocialIcon from "./buttons/SocialIcon";
import { SOCIALS } from "./buttons/SocialIcon";

//types
import { FC } from "react";

const AboutPage: FC = () => {
  return (
    <div className="about-page">
      <PageTitle marginTop={true} style={{ marginBottom: "3rem" }} />
      <div className="about-content">
        <p>
          {`Welcome to`} <span className="highlight">Recidex</span>
          {`, the ultimate destination for all things food! Created by `}
          <span className="highlight">Yotam Golan</span>
          {`, my community-driven recipe platform allows users to upload their favorite dishes for others to try. With a diverse range of cuisines and cooking styles represented, there's something for everyone on `}
          <span className="highlight">Recidex</span>
          {`.`}
        </p>
        <p>
          {`If you're a seasoned chef or just starting out in the kitchen, you'll find plenty of inspiration and guidance on our site. From mouth-watering main courses to delectable desserts, we've got you covered.`}
        </p>
        <p>
          {`Want to learn more about `}
          <span className="highlight">Yotam</span>
          {`? Check out `}
          <a href={SOCIALS.github.link} target={"_blank"} className="highlight">
            Yotam's GitHub profile
          </a>
          {` for a look at his technical skills, or connect with him on `}{" "}
          <a
            href={SOCIALS.linkedin.link}
            target={"_blank"}
            className="highlight"
          >
            Linkedin
          </a>
          {` for more information about his background and experience.`}
        </p>
        <p>
          {`So why wait? Start exploring the endless culinary possibilities on `}
          <span className="highlight">Recidex</span>
          {` today! Happy cooking!`}
        </p>
        <hr className="separator" />
        <div className="socials">
          <SocialIcon social={"github"} />
          <SocialIcon social={"linkedin"} />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
