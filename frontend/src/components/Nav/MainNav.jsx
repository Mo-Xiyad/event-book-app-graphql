import React from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
const MainNav = () => {
  const location = useLocation();
  const { pathname } = location;
  const menuItems = [
    { name: `Home`, path: `/` },
    { name: `Sign in`, path: `/signIn` },
    { name: `Bookings`, path: `/bookings` },
    { name: `Events`, path: `/events` },
  ];
  return (
    <header className="bg-white fixed-top border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-teal-100">
      <div className="container flex flex-wrap justify-between items-center mx-auto py-2">
        <div>
          <h1>YoYo Event</h1>
        </div>
        <nav className="">
          <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium border-b pb-2.5 px-2 rounded">
            {menuItems.map((items, index) => (
              <li key={index}>
                <NavLink
                  to={items.path}
                  className={
                    pathname === items.path
                      ? "rounded -mb-px mr-1 px-3 py-2 border-slate-300 border-l border-t border-r rounded-t text-white bg-secondary"
                      : "rounded-lg px-2 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900"
                  }
                >
                  {items.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};
export default MainNav;
