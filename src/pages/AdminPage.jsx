import React, { useMemo, useState, useContext } from "react";
import AdminList from "../components/AdminList";
import MySwitch from "../UI/MySwitch/MySwitch";
import InputSearch from "../UI/InputSearch/InputSearch";
import MySelect from "../UI/MySelect/MySelect";
import { NavLink } from "react-router-dom";
import { DBContext } from "../context/DBContext";

export const Admin = () => {
  const db = useContext(DBContext);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("allScores");
  const [isCurrent, setIsCurrent] = useState(false);

  const soretedScores = useMemo(() => {
    return [...db.notes]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((score) =>
        filter === "allScores" ? true : score.classScore === filter
      )
      .filter((score) => (isCurrent ? score.isCurrent === isCurrent : true));
  }, [filter, db.notes, isCurrent]);

  const sortedAndSearcedScores = useMemo(() => {
    return soretedScores.filter((score) =>
      score.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, soretedScores]);


  return (
    <div className="container">
      <h3 style={{ textAlign: "center" }}>Admin</h3>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <InputSearch
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></InputSearch>
      </div>
      <div className="media-flex">
        <NavLink
          to="/create"
          className="btn waves-effect waves-ml pink darken-1"
        >
          Создать запись
        </NavLink>
        <MySelect
          options={[
            {
              value: "allScores",
              text: "Все произведения",
            },
            ...db.classes,
          ]}
          firstOpt=""
          onChange={setFilter}
        ></MySelect>
        <MySwitch
          leftLabel="В текущем репертуаре"
          value={isCurrent}
          setValue={(val) => setIsCurrent(val)}
        ></MySwitch>
      </div>
      {sortedAndSearcedScores.length ? (
        <AdminList lists={sortedAndSearcedScores}></AdminList>
      ) : (
        <h4 style={{ textAlign: "center" }}>Произведения не найдены</h4>
      )}
    </div>
  );
};
