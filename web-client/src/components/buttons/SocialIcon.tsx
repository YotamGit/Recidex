import "../../styles/buttons/SocialIcon.css";

//mui
import Link from "@mui/material/Link";

//mui icons
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

//types
import { FC } from "react";

interface propTypes {
  social: "linkedin" | "github";
}

export const SOCIALS: Record<propTypes["social"], { icon: any; link: string }> =
  {
    linkedin: {
      icon: <LinkedInIcon />,
      link: "https://www.linkedin.com/in/golan-yotam/",
    },
    github: { icon: <GitHubIcon />, link: "https://github.com/YotamGit" },
  };

const SocialIcon: FC<propTypes> = ({ social }) => {
  return (
    <>
      <Link
        className="socials-icon"
        href={SOCIALS[social].link}
        target="_blank"
        rel="noreferrer"
      >
        {SOCIALS[social].icon}
      </Link>
    </>
  );
};

export default SocialIcon;
