import React from "react";

export default function ArchiveList({ lists, part, setClicked, setDataBtn }) {
  function sortParts(parts, part) {
    let sortedAudio = [];
    // console.log(part, parts);
    for (const key in parts) {
      if (parts[key].classPart === part) {
        sortedAudio.push({ ...parts[key], key });
      }
    }
    return sortedAudio;
  }

  function btnClicked(ev) {
    setClicked(true);
    setDataBtn({
      audio: ev.target.getAttribute("audio"),
      namePart: ev.target.getAttribute("namepart"),
      nameScore: ev.target.getAttribute("namescore"),
    });
  }

  return (
    <table className="striped" style={{ margin: "10px 0" }}>
      <tbody>
        {lists.map((list) => {
          return (
            <tr key={list.key}>
              <td>
                <a
                  href={list.pdf ? list.pdf : ""}
                  target="_blank"
                  rel="noreferrer"
                  className=""
                  onClick={(ev) => {
                    if (!list.pdf) {
                      ev.preventDefault();
                      window.M.toast({ html: "Нет нот" });
                    }
                  }}
                >
                  {list.name}
                </a>
              </td>
              <td
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  flexWrap: "wrap-reverse",

                }}
              >
                {part &&
                  (sortParts(list.parts, part).length ? (
                    sortParts(list.parts, part)
                      .sort((a, b) => a.namePart.localeCompare(b.namePart))
                      .map((el) => {
                        return (
                          <button
                            className="btn waves-effect pink darken-1"
                            key={el.key}
                            style={{ margin: '5px' }}
                            onClick={btnClicked}
                            audio={el.audio}
                            namepart={el.namePart}
                            namescore={list.name}
                          >
                            {el.namePart}
                          </button>
                        );
                      })
                  ) : (
                    <span>Нет записей</span>
                  ))}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
