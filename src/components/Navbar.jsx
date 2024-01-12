import "./Navbar.css";
import { IoMdMenu } from "react-icons/io";
import { MdOutlineSearch } from "react-icons/md";
import { IoMdOptions } from "react-icons/io";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { IoApps } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const logoImage =
  "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png";

function Navbar() {
  const navigate = useNavigate();
  return (
    <>
      <div className="navbar">
        <div className="first">
          <IoMdMenu size={25} />
          <img onClick={() => navigate(`/`)} src={logoImage} alt="logo"></img>
        </div>
        <div className="navbar-search">
          <MdOutlineSearch className="search-icon" size={25} />
          <input
            type="text"
            className="search-input"
            placeholder="Search mail"
          ></input>
          <IoMdOptions className="filter-icon" size={25} />
        </div>
        <div className="other-icons">
          <AiOutlineQuestionCircle size={25} />
          <IoSettingsOutline size={25} />
          <IoApps size={25} />
          <div className="user">T</div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
