import { Menu } from "lucide-react";
import "../css/MenuButton.css";

const MenuButton = ({ toggleSidebar }) => {
  return (
    <button
      className="menu-button"
      onClick={toggleSidebar}
    >
      <Menu size={28} />
    </button>
  );
};

export default MenuButton;