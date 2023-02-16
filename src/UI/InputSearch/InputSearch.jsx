import { Search } from "@material-ui/icons";
import React from "react";

export default function InputSearch(props) {
  // some changes
  return (
    <div className="input-field" required>
      <i className="material-icons prefix"><Search /></i>
      <input id="search" type="text" className="validate" {...props} />
      <label htmlFor="search">Поиск</label>
    </div>
  );
}
