import "./Sidebar.css";
import { LuPencil } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useMatch } from "react-router-dom";
import { IoMailUnreadSharp } from "react-icons/io5";
import { RiInbox2Fill } from "react-icons/ri";
import { AiOutlineSend } from "react-icons/ai";
import { MdMore } from "react-icons/md";

function Sidebar({ open }) {
  const gmailMatch = useMatch("/gmail");
  const unreadMatch = useMatch("/gmail/unread");
  const sentMatch = useMatch("/gmail/sent");
  return (
    <div className="sidebar">
      <div className="compose-div" onClick={() => open()}>
        <LuPencil size={20} />
        <button className="compose-button">Compose</button>
      </div>
      <ul className="sidebar-list">
        <Link to="/gmail" className="sidebar-link">
          <li className={gmailMatch ? "active" : ""}>
            <RiInbox2Fill size={20} />
            Inbox
          </li>
        </Link>
        <Link to="/gmail/unread" className="sidebar-link">
          <li className={unreadMatch ? "active" : ""}>
            <IoMailUnreadSharp size={20} />
            Unread
          </li>
        </Link>
        <Link to="/gmail/sent" className="sidebar-link">
          <li className={sentMatch ? "active" : ""}>
            <AiOutlineSend size={20} />
            Sent
          </li>
        </Link>

        <li>
          <MdMore size={20} />
          More
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
