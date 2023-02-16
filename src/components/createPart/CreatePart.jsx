import { AddCircleOutline, CloudUpload, PlayArrow } from "@material-ui/icons";
import React from "react";
import close from '../../icons/close.png'

export default function CreatePart({
  namePart,
  id,
  setFooter,
  setPart,
  setAll,
  allParts,
}) {
  function addPart() {
    const parts = allParts[`${id}`];
    setAll({
      ...allParts,
      [`${id}`]: [
        ...parts,
        {
          num: parts[parts.length - 1].num + 1,
          name: "",
          audioFile: null,
          audioUrl: "",
          audioFileName: "",
          myKey: "",
        },
      ],
    });
  }

  function deletePart(ev) {
    let buffer = allParts[`${id}`];
    buffer = buffer.filter(
      (el) => el.num !== Number(ev.target.getAttribute("num"))
    );
    setAll({
      ...allParts,
      [`${id}`]: [...buffer],
    });
  }

  function deleteFirstPart() {
    let buffer = allParts[`${id}`];

    if (buffer.length > 1) {
      buffer[1].num = 1;
      buffer.splice(0, 1);
    } else {
      buffer[0].name = "";
      buffer[0].audioFile = null;
      buffer[0].audioUrl = "";
      buffer[0].audioFileName = "";
    }

    setAll({
      ...allParts,
      [`${id}`]: [...buffer],
    });
    setTimeout(() => {
      window.M.updateTextFields();
    }, 100);
  }

  function changeNamePart(ev) {
    let buffer = allParts[`${id}`];
    let indx = buffer.findIndex(
      (el) => el.num === Number(ev.target.getAttribute("num"))
    );
    buffer[indx].name = ev.target.value;
    setAll({
      ...allParts,
      [`${id}`]: [...buffer],
    });
  }

  function changeFile(ev) {
    let buffer = allParts[`${id}`];
    let indx = buffer.findIndex(
      (el) => el.num === Number(ev.target.getAttribute("num"))
    );
    buffer[indx].audioFile = ev.target.files[0];
    buffer[indx].audioFileName = ev.target.files[0].name;
    buffer[indx].audioUrl = URL.createObjectURL(ev.target.files[0]);
    setAll({
      ...allParts,
      [`${id}`]: [...buffer],
    });
  }

  function playHandler(ev) {
    setFooter(true);
    let buffer = allParts[`${id}`];
    let indx = buffer.findIndex(
      (el) => el.num === Number(ev.target.getAttribute("num"))
    );
    setPart({ ...buffer[indx] });
  }

  return (
    <div className="flex-space-between">
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <label onClick={addPart}>
          <i
            className={`small material-icons pink-text text-darken-1 `}
            style={{ cursor: "pointer" }}
          >
            <AddCircleOutline />
          </i>
        </label>
        <h5>{namePart}</h5>
      </div>
      <div>
        {allParts[`${id}`].map((el) => {
          return (
            <div style={{ display: "flex", alignItems: "center" }} key={el.num}>
              <div className="input-field">
                <input
                  type="text"
                  id={`${id}_${el.num}`}
                  value={el.name}
                  onChange={changeNamePart}
                  num={el.num}
                />
                <label htmlFor={`${id}_${el.num}`}>Название партии</label>
              </div>
              <div>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id={`file_${id}_${el.num}`}
                  onChange={changeFile}
                  num={el.num}
                />
                <label htmlFor={`file_${id}_${el.num}`}>
                  <i
                    className={`small material-icons pink-text text-darken-1 `}
                    style={{ cursor: "pointer" }}
                  >
                    <CloudUpload />
                  </i>
                </label>
              </div>
              <label onClick={playHandler}>
                <i
                  className={`small material-icons pink-text text-darken-1 `}
                  style={{ cursor: "pointer" }}
                  num={el.num}
                >
                  <PlayArrow />
                </i>
              </label>

              <label onClick={el.num > 1 ? deletePart : deleteFirstPart}>
                <img src={close}
                  style={
                    el.num > 1 ||
                    (el.num === 1 && (el.name || el.audioFileName))
                      ? { cursor: "pointer", width: '20px', height: '20px' }
                      : { visibility: "hidden", width: '20px', height: '20px' }
                  }
                  num={el.num}
                />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
