import React from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOutUser } from "../../redux/actions";

const MainNav = (props) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  const menuItems = [
    { name: `Home`, path: `/` },
    { name: `Sign in`, path: `/auth` },
    { name: `Bookings`, path: `/bookings` },
    { name: `Events`, path: `/events` },
  ];
  return (
    <header className="bg-white fixed-top border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-teal-100 border-b-2 border-secondary">
      <div className=" flex flex-wrap justify-between items-center py-2">
        <div>
          <h1>YoYo Event</h1>
        </div>
        <nav className="">
          <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium rounded">
            {auth.token === null &&
              menuItems.map((items, index) => (
                <li key={index}>
                  <NavLink
                    to={items.path}
                    className={
                      pathname === items.path
                        ? "rounded -mb-px mr-1 px-3 py-2 border-slate-300 border-l border-t border-r rounded-t text-white hover:text-primary bg-secondary"
                        : "rounded-lg px-2 py-2 text-slate-700 font-medium hover:bg-tertiary hover:text-slate-900"
                    }
                  >
                    {items.name}
                  </NavLink>
                </li>
              ))}

            {auth.token !== null &&
              menuItems
                .filter((items) => items.name !== "Sign in")
                .map((items, index) => (
                  <li key={index}>
                    <NavLink
                      to={items.path}
                      className={
                        pathname === items.path
                          ? "rounded -mb-px mr-1 px-3 py-2 border-slate-300 border-l border-t border-r rounded-t text-white hover:text-primary bg-secondary"
                          : "rounded-lg px-2 py-2 text-slate-700 font-medium hover:bg-tertiary hover:text-slate-900"
                      }
                    >
                      {items.name}
                    </NavLink>
                  </li>
                ))}
            {auth.token !== null && (
              <li>
                <NavLink
                  onClick={() => dispatch(logOutUser())}
                  to={"/"}
                  className={
                    "rounded-lg px-2 py-2 text-slate-700 font-medium hover:bg-tertiary hover:text-slate-900"
                  }
                >
                  Log Out
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
export default MainNav;
