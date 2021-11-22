import React, { useContext, useState } from "react";
import InputFile from "../UI/InputFile/InputFile";
import MySelect from "../UI/MySelect/MySelect";
import MySwitch from "../UI/MySwitch/MySwitch";
import MyFooter from "../components/MyFooter";
import MyAudio from "../UI/MyAudio/MyAudio";
import CreatePart from "../components/createPart/CreatePart";
import { DBContext } from "../context/DBContext";
import { ref as refDB, set as setDB, push } from "firebase/database";
import {
  getDownloadURL,
  ref as refS,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import Swal from "sweetalert2";
import EditClasses from "../components/EditClasses";

export default function CreatePage() {
  const db = useContext(DBContext);

  const [allParts, setAllParts] = useState({
    soprano: [{ num: 1, name: "", audioFile: null }],
    tenor: [{ num: 1, name: "", audioFile: null }],
    alto: [{ num: 1, name: "", audioFile: null }],
    bass: [{ num: 1, name: "", audioFile: null }],
    other: [{ num: 1, name: "", audioFile: null }],
  });

  const [nameScore, setNameScore] = useState("");
  const [pdf, setPdf] = useState(null);
  const [chosenClass, setChosenClass] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [loading, setLoading] = useState(false);
  // for footer
  const [isFooter, setIsFooter] = useState(false);
  const [part, setPart] = useState(null);

  async function saveHandler(ev) {
    ev.preventDefault();
    setLoading(true);

    // Проверка правильности ввода ========================================
    let err = [];

    if (!nameScore) {
      err.push("Нет названия произведения");
    } else {
      if (
        db.notes.findIndex(
          (el) => el.name.toLowerCase() === nameScore.toLowerCase()
        ) !== -1
      ) {
        err.push(`Произведение с названием ${nameScore} уже существует`);
      }
    }

    if (!chosenClass) {
      err.push("Класс произведения не выбран");
    }

    for (const key in allParts) {
      const parts = allParts[key];
      for (const part of parts) {
        if (!part.name && part.audioFile) {
          err.push("У какой-то записи нет названия");
        }
        if (part.name && !part.audioFile) {
          err.push(`Для записи ${part.name} нет файла`);
        }
      }
    }

    if (!pdf) {
      const result = await Swal.fire({
        title: "PDF-файл не был загружен. Продолжить?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: `Да`,
        denyButtonText: `Нет`,
      });
      if (!result.isConfirmed) {
        err.push("Нет pdf");
      }
    }

    if (err.length) {
      window.M.toast({ html: err[0] });
      setLoading(false);
      return;
    }

    // отправка на firebase ===============================================
    const newNotesKey = push(refDB(db.dataBase, "notes")).key;
    let pdfUrl;
    if (pdf) {
      const storageRef = refS(db.storage, `${newNotesKey}/${pdf.name}`);
      await uploadBytesResumable(storageRef, pdf);
      pdfUrl = await getDownloadURL(storageRef);
    } else {
      const storageRef = refS(db.storage, `${newNotesKey}/noPDF`);
      await uploadString(storageRef, "Нет pdf");
      pdfUrl = "";
    }

    const data = {
      classScore: chosenClass,
      isCurrent: isCurrent,
      pdf: pdfUrl,
      scoreName: nameScore,
    };

    await setDB(refDB(db.dataBase, `notes/${newNotesKey}`), data);

    for (const key in allParts) {
      const parts = allParts[key];
      for (const part of parts) {
        if (part.name && part.audioFile) {
          const audioRef = refS(
            db.storage,
            `${newNotesKey}/${part.audioFile.name}_${Date.now()}`
          );
          await uploadBytesResumable(audioRef, part.audioFile);
          console.log(`Файл ${part.audioFile.name} успешно загружен`);
          window.M.toast({
            html: `Файл ${part.audioFile.name} успешно загружен`,
          });

          const audioUrl = await getDownloadURL(audioRef);
          await push(refDB(db.dataBase, `notes/${newNotesKey}/parts`), {
            audio: audioUrl,
            classPart: key,
            namePart: part.name,
          });
        }
      }
    }
    window.M.toast({
      html: `Готово`,
    });
    setLoading(false);
  }

  return (
    <div className="container">
      <h4 style={{ textAlign: "center" }}>Новое произведение</h4>

      <form className="score-card">
        <div className="flex-space-between">
          <div className="input-field">
            <input
              id="nameScore"
              type="text"
              value={nameScore}
              onChange={(el) => setNameScore(el.target.value)}
            />
            <label htmlFor="nameScore">Название произведения</label>
          </div>
          <InputFile
            id="pdf"
            setFile={(val) => setPdf(val)}
            file={pdf}
            infoText="pdf не выбран"
            accept=".pdf"
          />
        </div>

        <div className="flex-space-between">
          <div style={{ display: "flex" }}>
            <MySelect
              firstOpt="Выбери класс"
              options={db.classes}
              onChange={setChosenClass}
            />
            <a href="#modal1" className="modal-trigger">
              <i
                className={`small material-icons pink-text text-darken-1 `}
                style={{ marginLeft: "10px", cursor: "pointer" }}
              >
                mode_edit
              </i>
            </a>
          </div>
          <MySwitch
            leftLabel="В текущем репертуаре"
            value={isCurrent}
            setValue={(val) => setIsCurrent(val)}
            myfunc={() => console.log("")}
          />
        </div>

        <CreatePart
          namePart="Сопрано"
          id="soprano"
          setFooter={(val) => setIsFooter(val)}
          setPart={(val) => setPart(val)}
          setAll={(val) => setAllParts(val)}
          allParts={allParts}
        />
        <CreatePart
          namePart="Альт"
          id="alto"
          setFooter={(val) => setIsFooter(val)}
          setPart={(val) => setPart(val)}
          setAll={(val) => setAllParts(val)}
          allParts={allParts}
        />
        <CreatePart
          namePart="Тенор"
          id="tenor"
          setFooter={(val) => setIsFooter(val)}
          setPart={(val) => setPart(val)}
          setAll={(val) => setAllParts(val)}
          allParts={allParts}
        />
        <CreatePart
          namePart="Бас"
          id="bass"
          setFooter={(val) => setIsFooter(val)}
          setPart={(val) => setPart(val)}
          setAll={(val) => setAllParts(val)}
          allParts={allParts}
        />
        <CreatePart
          namePart="Прочее"
          id="other"
          setFooter={(val) => setIsFooter(val)}
          setPart={(val) => setPart(val)}
          setAll={(val) => setAllParts(val)}
          allParts={allParts}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className="btn pink darken-1"
            onClick={saveHandler}
            disabled={loading}
          >
            Сохранить
          </button>
        </div>
      </form>

      {isFooter && (
        <MyFooter closeHandler={(val) => setIsFooter(val)}>
          <div className="container">
            <span>{`${part.name ? part.name : "Нет названия"} — ${
              part.audioFile ? part.audioFile.name : "Нет файла"
            }`}</span>
            <MyAudio
              audioURL={part.audioFile && URL.createObjectURL(part?.audioFile)}
            />
          </div>
        </MyFooter>
      )}
      <EditClasses></EditClasses>
    </div>
  );
}
