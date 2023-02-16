import React, { useContext, useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { DBContext } from "../context/DBContext";
import InputFile from "../UI/InputFile/InputFile";
import MySelect from "../UI/MySelect/MySelect";
import MySwitch from "../UI/MySwitch/MySwitch";
import MyFooter from "../components/MyFooter";
import MyAudio from "../UI/MyAudio/MyAudio";
import { Loader } from "../components/Loader";
import CreatePart from "../components/createPart/CreatePart";
import Swal from "sweetalert2";

import {
  ref as refS,
  getMetadata,
  deleteObject,
  listAll,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  ref as refDB,
  push,
  remove,
  update,
} from "firebase/database";
import EditClasses from "../components/EditClasses";
import { Delete, Edit, FolderOpen } from "@material-ui/icons";

export const Detail = () => {
  const history = useHistory();
  const db = useContext(DBContext);
  const scoreKey = useParams().key;
  const score = db.notes.find((el) => el.key === scoreKey);

  const [nameScore, setNameScore] = useState(score.name);
  const [pdf, setPdf] = useState(null);
  const [pdfURL, setPdfUrl] = useState(score.pdf);
  const [isCurrent, setIsCurrent] = useState(score.isCurrent);
  const [chosenClass, setChosenClass] = useState(score.classScore);
  const [loading, setLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const [isFooter, setIsFooter] = useState(false);
  const [part, setPart] = useState(null);

  const [allParts, setAllParts] = useState({
    soprano: [{ num: 1, name: "", audioFile: null }],
    tenor: [{ num: 1, name: "", audioFile: null }],
    alto: [{ num: 1, name: "", audioFile: null }],
    bass: [{ num: 1, name: "", audioFile: null }],
    other: [{ num: 1, name: "", audioFile: null }],
  });

  const metaGetting = useCallback(async () => {
    const allPartsState = {
      soprano: [],
      tenor: [],
      alto: [],
      bass: [],
      other: [],
    };

    for (const key in score.parts) {
      const myref = refS(db.storage, score.parts[key].audio);
      const metadata = await getMetadata(myref);
      allPartsState[score.parts[key].classPart].push({
        num: allPartsState[score.parts[key].classPart].length + 1,
        name: score.parts[key].namePart,
        audioFile: null,
        audioUrl: score.parts[key].audio,
        audioFileName: metadata.name.slice(0, metadata.name.lastIndexOf("_")),
        // audioFileName: metadata.name,
        myKey: key,
      });
    }

    for (const key in allPartsState) {
      if (!allPartsState[key].length) {
        allPartsState[key] = [{ num: 1, name: "", audioFile: null }];
      }
    }

    setLoadingMeta(false);
    setAllParts(allPartsState);
  }, [db.storage, score.parts]);

  useEffect(() => {
    async function asyncFunc() {
      await metaGetting();
      window.M.updateTextFields();
    }
    asyncFunc();
  }, [metaGetting]);

  async function deleteScore() {
    const result = await Swal.fire({
      title: `Вы действительно хотите удалить прозведение "${score.name}"?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Да`,
      denyButtonText: `Нет`,
    });

    if (result.isConfirmed) {
      const referenceStorage = refS(db.storage, scoreKey);
      const list = await listAll(referenceStorage);
      list.items.forEach(async (el) => {
        await deleteObject(el);
      });

      const referenceDB = refDB(db.dataBase, `notes/${scoreKey}`);
      history.push("/admin");
      remove(referenceDB)
        .then(() => {
          console.log(`удалено успешно`);
          window.M.toast({ html: `Удалено успешно` });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  async function saveHandler(ev) {
    ev.preventDefault();
    setLoading(true);

    // Проверка правильности ввода ========================================
    let err = [];

    if (!nameScore) {
      err.push("Нет названия произведения");
    } else {
      if (
        db.notes
          .filter((el) => el.key !== scoreKey)
          .findIndex(
            (el) => el.name.toLowerCase() === nameScore.toLowerCase()
          ) !== -1
      ) {
        err.push(`Произведение с названием ${nameScore} уже существует`);
      }
    }

    if (!score.pdf) {
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
    }

    let partsArr = [];
    let partsNamesArr = [];

    for (const key in allParts) {
      const parts = allParts[key];
      for (const part of parts) {
        if (part.name) {
          partsNamesArr.push(part.name);
          partsArr.push({ ...part, classPart: key });
        }

        if (part.myKey && part.audioFile) {
          console.log("У партии другой файл");
        }

        if (!part.name && part.audioFile) {
          err.push("У какой-то записи нет названия");
        }
        if (part.name && !part.audioFileName) {
          err.push(`Для записи ${part.name} нет файла`);
        }
      }
    }

    const isDuplicate = partsNamesArr.some(
      (part, i) => partsNamesArr.indexOf(part) !== i
    );
    isDuplicate && err.push("Названия партий не должны повторяться");

    let forDeleteParts = [];

    for (const key in score.parts) {
      if (partsArr.length) {
        const ind = partsArr.findIndex((el) =>
          el.myKey ? el.myKey === key : true
        );
        if (ind === -1) {
          //  Можно сразу удалть партию из базы
          forDeleteParts.push({ ...score.parts[key], key });
        }
      }
    }

    if (err.length) {
      window.M.toast({ html: err[0] });
      setLoading(false);
      return;
    }

    console.log(partsArr);
    console.log(forDeleteParts);

    // отправка на firebase ===============================================

    // Удаление лишних партий
    for (const part of forDeleteParts) {
      const storAudioDelete = refS(db.storage, part.audio);
      await deleteObject(storAudioDelete);
      remove(refDB(db.dataBase, `notes/${scoreKey}/parts/${part.key}`));
    }

    const storageRef = refS(db.storage, `${scoreKey}`);

    let _pdfURL = pdfURL;

    if (pdf) {
      if (pdfURL) {
        const storPdfDelete = refS(db.storage, pdfURL);
        await deleteObject(storPdfDelete);
      }
      const storageRef = refS(db.storage, `${scoreKey}/${pdf.name}`);
      await uploadBytesResumable(storageRef, pdf);
      _pdfURL = await getDownloadURL(storageRef);
    }
    const data = {
      classScore: chosenClass,
      isCurrent: isCurrent,
      pdf: _pdfURL,
      scoreName: nameScore,
    };

    await update(refDB(db.dataBase, `notes/${scoreKey}`), data);

    for (const part of partsArr) {
      let audioUrl;
      if (part.audioFile && !part.myKey) {
        const audioRef = refS(
          db.storage,
          `${scoreKey}/${part.audioFileName}_${Date.now()}`
        );
        await uploadBytesResumable(audioRef, part.audioFile);
        console.log(`Файл ${part.audioFile.name} успешно загружен`);
        window.M.toast({
          html: `Файл ${part.audioFile.name} успешно загружен`,
        });
        audioUrl = await getDownloadURL(audioRef);
        await push(refDB(db.dataBase, `notes/${scoreKey}/parts`), {
          audio: audioUrl,
          classPart: part.classPart,
          namePart: part.name,
        });
      } else if (part.audioFile && part.myKey) {
        const deleteAudioRef = refS(db.storage, part.audioURL);
        await deleteObject(deleteAudioRef);
        const audioRef = refS(
          db.storage,
          `${scoreKey}/${part.audioFileName}_${Date.now()}`
        );
        await uploadBytesResumable(audioRef, part.audioFile);
        console.log(`Файл ${part.audioFile.name} успешно загружен`);
        window.M.toast({
          html: `Файл ${part.audioFile.name} успешно загружен`,
        });
        audioUrl = await getDownloadURL(audioRef);
        await update(
          refDB(db.dataBase, `notes/${scoreKey}/parts/${part.myKey}`),
          {
            audio: audioUrl,
            classPart: part.classPart,
            namePart: part.name,
          }
        );
      } else {
        audioUrl = part.audioUrl;
        await update(
          refDB(db.dataBase, `notes/${scoreKey}/parts/${part.myKey}`),
          {
            audio: audioUrl,
            classPart: part.classPart,
            namePart: part.name,
          }
        );
      }
    }

    window.M.toast({ html: `Готово` });
    setLoading(false);
  }

  if (loadingMeta) return <Loader />;

  return (
    <div className="container">
      <h4 style={{ textAlign: "center" }} onClick={()=>console.log()}>
        {nameScore}
        <a
          className="pink-text text-darken-1"
          href={pdfURL}
          target="_blank"
          rel="noreferrer"
          onClick={(ev) => {
            if (!pdfURL) {
              ev.preventDefault();
              window.M.toast({html: 'Нет нот'})
            }
          }}
        >
          <i
            className={`small material-icons `}
            style={{
              cursor: "pointer",
              paddingLeft: "10px",
            }}
          >
            <FolderOpen />
          </i>
        </a>
        <i
          className={`small material-icons `}
          style={{
            cursor: "pointer",
            paddingLeft: "10px",
          }}
          onClick={deleteScore}
        >
          <Delete />
        </i>
      </h4>

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
            infoText="новый pdf"
            accept=".pdf"
            val
          />
        </div>

        <div className="flex-space-between">
        <div style={{ display: "flex" }}>
          <MySelect
            firstOpt={chosenClass}
            options={db.classes}
            onChange={setChosenClass}
            />
            <a href="#modal1" className="modal-trigger">
              <i
                className={`small material-icons pink-text text-darken-1 `}
                style={{ marginLeft: "10px", cursor: "pointer" }}
              >
                <Edit />
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
              part.audioFileName ? part.audioFileName : "Нет файла"
            }`}</span>
            <MyAudio audioURL={part.audioUrl && part.audioUrl} />
          </div>
        </MyFooter>
      )}
      <EditClasses></EditClasses>
    </div>
  );
};
