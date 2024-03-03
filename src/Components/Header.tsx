import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full bg-slate-600 h-20 flex items-center justify-center">
      <div className="flex items-center">
        <NavLink className="mr-20 text-gray-200" to={"/Sweeft-Project/"}>
          HOME
        </NavLink>
        <NavLink className="text-gray-200" to={"/Sweeft-Project/history"}>
          HISTORY
        </NavLink>
      </div>
    </header>
  );
}
