import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { CiMail } from "react-icons/ci";

function Footer() {
  const style = { color: "black", fontSize: "1.5em" };

  return (
    <footer className="normal flex justify-around items-center">
      <h4 className="font-light text-xs">Developed by Morakinyo Isaac</h4>
      <h4 className="text-xs font-light">copywright © 2024</h4>
      <div className=" g-2.5 flex">
        <a
          href="https://www.linkedin.com/in/morakinyo-isaac-8239b1306?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
          target="_blank"
        >
          <FaLinkedin style={style} />
        </a>
        <a href="https://github.com/IsaacOverstreet" target="_blank">
          <FaGithub style={style} />
        </a>
        <a href="https://mailTo:morakinyorisaac@yahoo.com" target="_blank">
          <CiMail style={style} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
