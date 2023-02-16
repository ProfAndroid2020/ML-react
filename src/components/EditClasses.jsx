import React, { useContext, useEffect, useState } from "react";
import { DBContext } from "../context/DBContext";
import { push, ref, remove, set } from "firebase/database";
import { AddCircleOutline, Delete } from "@material-ui/icons";

export default function EditClasses() {
  const db = useContext(DBContext);
  const [newClass, setNewClass] = useState("");

  useEffect(() => {
    const elems = document.querySelectorAll(".modal");
    window.M.Modal.init(elems);
  }, []);

  function addClassHandler() {
    if (!newClass) {
      window.M.toast({ html: "Введи хоть что-нибудь" });
      return;
    }
    const newClassKey = push(ref(db.dataBase, "ClassesPart")).key;
    set(ref(db.dataBase, `ClassesPart/${newClassKey}`), { name: newClass });
    setNewClass("");
    setTimeout(() => window.M.updateTextFields(), 200);
  }

  function deleteClassHandler(el) {
    const deleteClass = el.target.getAttribute("text");
    const ind = db.notes.findIndex((el) => el.classScore === deleteClass);
    if (ind !== -1) {
      window.M.toast({ html: `"${db.notes[ind].name}" с этим классом` });
      return;
    } else {
      const deleteRef = ref(
        db.dataBase,
        `ClassesPart/${el.target.getAttribute("mykey")}`
      );
      remove(deleteRef);
    }
  }

  return (
    <div id="modal1" className="modal">
      <div className="modal-content">
        <ul className="collection with-header">
          <li className="collection-header">
            <h4>Классы произведений</h4>
          </li>
          <li className="collection-item">
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <div className="input-field" style={{ margin: "0" }}>
                <input
                  id="new_class"
                  type="text"
                  style={{ margin: "0" }}
                  value={newClass}
                  onChange={(el) => setNewClass(el.target.value)}
                />
                <label htmlFor="new_class">Новый класс</label>
              </div>
              <a href="#!" className="secondary-content">
                <i
                  className="material-icons pink-text text-darken-1"
                  onClick={addClassHandler}
                >
                  <AddCircleOutline />
                </i>
              </a>
            </div>
          </li>
          {db.classes.map((el) => (
            <li className="collection-item" key={el.text}>
              <div>
                {el.text}
                <a href="#!" className="secondary-content">
                  <i
                    className="material-icons pink-text text-darken-1"
                    text={el.text}
                    mykey={el.key}
                    onClick={deleteClassHandler}
                  >
                    <Delete />
                  </i>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
