import React, { useState, useMemo, useContext } from "react";
import InputSearch from "../UI/InputSearch/InputSearch";
import MySelect from "../UI/MySelect/MySelect";
import MySwitch from "../UI/MySwitch/MySwitch";
import MyFooter from "../components/MyFooter";
import ArchiveList from "../components/ArchiveList";
import MyAudio from "../UI/MyAudio/MyAudio";
import { DBContext } from "../context/DBContext";

export const Archive = () => {
  const db = useContext(DBContext);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("allScores");
  const [isCurrent, setIsCurrent] = useState(false);
  const [part, setPart] = useState("");
  const [isFooter, setIsFooter] = useState(false);
  const [dataBtn, setDataBtn] = useState(null);

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
    <main>
      <div className="container">
        <h3 style={{ textAlign: "center" }} onClick={() => console.log(db)}>
          Архив
        </h3>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <InputSearch
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></InputSearch>
        </div>

        <div className="media-flex">
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
          />
          <MySwitch
            leftLabel="В текущем репертуаре"
            value={isCurrent}
            setValue={(val) => setIsCurrent(val)}
          />
          <MySelect
            options={[
              { value: "soprano", text: "Сопрано" },
              { value: "alto", text: "Альт" },
              { value: "tenor", text: "Тенор" },
              { value: "bass", text: "Бас" },
              { value: "other", text: "Прочее" },
            ]}
            firstOpt="Выбери партию"
            onChange={setPart}
          />
        </div>
        {sortedAndSearcedScores.length ? (
          <ArchiveList
            lists={sortedAndSearcedScores}
            part={part}
            setClicked={(val) => setIsFooter(val)}
            setDataBtn={setDataBtn}
          />
        ) : (
          <h4 style={{ textAlign: "center" }}>Произведения не найдены</h4>
        )}
      </div>
      {isFooter && (
        <MyFooter closeHandler={(val) => setIsFooter(val)}>
          <div className="container">
            <span>{`${dataBtn.nameScore} — ${dataBtn.namePart}`}</span>
            <MyAudio audioURL={dataBtn.audio} />
          </div>
        </MyFooter>
      )}
    </main>
  );
};
