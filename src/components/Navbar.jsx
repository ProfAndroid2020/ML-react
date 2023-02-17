import { Menu } from "@material-ui/icons";
import React, { useEffect, useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { PassContext } from "../context/passContext";

export const Navbar = ({ user }) => {
  const history = useHistory();
  const pass = useContext(PassContext);
  const logoutHandler = (event) => {
    triggerOverlay();
    event.preventDefault();
    pass.logout();
    history.push("/login");
  };

  const triggerOverlay = () =>
    document.querySelector(".sidenav-overlay").click();

  useEffect(() => {
    const elems = document.querySelectorAll(".sidenav");
    window.M.Sidenav.init(elems);
  }, []);

  return (
    <header>
      <nav>
        <div className="nav-wrapper pink darken-1">
          <span
            className="brand-logo"
            style={{ paddingLeft: "2rem", whiteSpace: "nowrap" }}
          >
            Musica Linguae
          </span>
          <a href="/" data-target="mobile-demo" className="sidenav-trigger">
            <i className="material-icons"><Menu /></i>
          </a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {user === "admin" && (
              <>
                <li>
                  <NavLink to="/" className="waves-effect waves-light">
                    Архив
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin" className="waves-effect waves-light">
                    Администрация
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink
                    to="/changePassword"
                    className="waves-effect waves-light"
                  >
                    Сменить пароль
                  </NavLink>
                </li> */}
              </>
            )}

            <li>
              <a href="/" onClick={logoutHandler}>
                Выход
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <ul className="sidenav" id="mobile-demo">
        {user === "admin" && (
          <>
            <li>
              <NavLink
                to="/"
                className="waves-effect waves-light"
                onClick={triggerOverlay}
              >
                Архив
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin"
                className="waves-effect waves-light"
                onClick={triggerOverlay}
              >
                Администрация
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="/changePassword"
                className="waves-effect waves-light"
                onClick={triggerOverlay}
              >
                Сменить пароль
              </NavLink>
            </li> */}
          </>
        )}

        <li>
          <a href="/" onClick={logoutHandler}>
            Выход
          </a>
        </li>
      </ul>
    </header>
  );
};
