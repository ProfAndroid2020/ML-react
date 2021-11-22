import React from "react";

export default function MySwitch({ leftLabel, rightLabel, value, setValue}) {
  
  return (
    <div className="switch">
      <label>
        {leftLabel}
        <input type="checkbox" checked={value} onChange={ () => setValue(!value) }/>
        <span className="lever"></span>
        {rightLabel}
      </label>
    </div>
  );
}
