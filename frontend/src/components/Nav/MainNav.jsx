import React from "react";
import { NavLink } from "react-router-dom";

const MainNav = () => {
  const menuItems = [
    { name: `Home`, path: `/` },
    { name: `Sign in`, path: `/signIn` },
    { name: `Bookings`, path: `/bookings` },
    { name: `Events`, path: `/events` },
  ];
  return (
    <header className="container flex flex-wrap justify-between items-center mx-auto py-2">
      <div>
        <h1>YoYo Event</h1>
      </div>
      <nav className="">
        <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
          {menuItems.map((items, index) => (
            <li key={index}>
              <NavLink
                to={items.path}
                className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900"
                // className={(isActive) =>
                //   "nav-link" + (!isActive ? " unselected" : "")
                // }
              >
                {items.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
export default MainNav;
