import { Close } from "@material-ui/icons";
import React from "react";

const style = {
  backgroundColor: "#F8F8F8",
  borderTop: "1px solid #E7E7E7",
  textAlign: "center",
  padding: "20px",
  position: "fixed",
  left: "0",
  bottom: "0",
  height: "80px",
  width: "100%",
  zIndex: 50,
};

const phantom = {
  display: "block",
  padding: "20px",
  height: "80px",
  width: "100%",
};

function MyFooter({ children, closeHandler }) {
  return (
    <div id="footer">
      <div className="phantom" style={phantom} />
      <div className="footer-body" style={style}>
        <i
          className={`small material-icons pink-text text-darken-1 `}
          style={{ cursor: "pointer", position: 'absolute', right: '5px', top: '5px' }}
          onClick={()=>closeHandler(false)}
        >
          <Close />
        </i>
        {children}
      </div>
    </div>
  );
}

export default MyFooter;
