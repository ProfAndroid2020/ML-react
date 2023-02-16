import { ArrowDropDown } from "@material-ui/icons";
import React, { useState, useEffect, useRef } from "react";
import classes from "./MySelect.module.css";

export default function MySelect({ firstOpt, options, onChange }) {
  const rootEl = useRef(null);

  const [active, setActive] = useState(false);
  const [headerText, setHeadertext] = useState(firstOpt || options[0].text);

  function headerHandler() {
    setActive(!active);
  }

  function itemHandler(ev) {
    setActive(false);

    let value = ev.target.getAttribute("value");
    setHeadertext(ev.target.innerText);
    onChange(value);
  }

  useEffect(() => {
    const onClick = (e) => {
      if (rootEl.current && !rootEl.current.contains(e.target)) {
        setActive(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className={`${classes.select} inline`} ref={rootEl}>
      <div
        className={`${classes["select-header"]} waves-effect waves-ml`}
        onClick={headerHandler}
      >
        <span className="select-current">{headerText}</span>
        <i
          className={`material-icons ${classes["select-icon"]} ${
            active && classes["active-icon"]
          }`}
        >
          <ArrowDropDown />
        </i>
      </div>

      <div
        className={`${classes["select-body"]} ${
          active && classes["active-body"]
        }`}
      >
        {options.map((el) => (
          <div
            className={classes["select-item"]}
            value={el.value}
            key={el.value}
            onClick={itemHandler}
          >
            {el.text}
          </div>
        ))}
      </div>
    </div>
  );
}
