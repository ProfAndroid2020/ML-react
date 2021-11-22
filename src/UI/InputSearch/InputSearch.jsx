import React from "react";

export default function InputSearch(props) {
  return (
    <div className="input-field" required>
      <i className="material-icons prefix">search</i>
      <input id="search" type="text" className="validate" {...props} />
      <label htmlFor="search">Поиск</label>
    </div>
  );
}
