import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Admin } from "./pages/AdminPage";
import { Archive } from "./pages/ArchivePage";
import ChangePassword from "./pages/ChangePasswordPage";
import CreatePage from "./pages/CreatePage";
import { Detail } from "./pages/DetailScorePage";
import { Pass } from "./pages/PassPage";

export const useRoutes = (user) => {
  if (user === "simple") {
    return (
      <Switch>
        <Route path="/" exact>
          <Archive />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else if (user === "admin") {
    return (
      <Switch>

        <Route path="/" exact>
          <Archive />
        </Route>

        <Route path="/admin" exact>
          <Admin />
        </Route>

        <Route path="/detail/:key">
          <Detail />
        </Route>

        <Route path="/create" exact>
          <CreatePage />
        </Route>

        {/* <Route path="/changePassword" exact>
          <ChangePassword />
        </Route> */}
        
        <Redirect to="/admin" />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route path="/login" exact>
          <Pass />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }
};
