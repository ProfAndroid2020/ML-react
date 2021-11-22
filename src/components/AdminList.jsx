import React from "react";
import { Link } from "react-router-dom";

export default function AdminList({ lists }) {
  return (

    
    <div className="collection">
      {lists.map((list, ind) => {
        return (
          <Link to={`/detail/${list.key}`} className="collection-item" key={list.key} style={{display: 'flex'}}>
            {list.name}
          </Link>
        );
      })}
    </div>
  );
}
