import React from "react";
import { translit } from "../../translitiration";
import classes from "./InputFile.module.css";

export default function InputFile({ file, setFile, id, infoText, accept }) {
  return (
    <div className="col s6" style={{ display: "flex" }}>
      <input
        id={id}
        type="file"
        onChange={(event) => {
          const file = event.target.files[0];
          // file.name = translit(file.name);
          setFile(file);
        }}
        style={{ display: "none" }}
        accept={accept}
      />
      {file ? (
        <a
          className={classes["field_file_fake"]}
          href={URL.createObjectURL(file)}
          target="_blank"
          rel="noreferrer"
        >
          {file.name}
        </a>
      ) : (
        <span className={classes["field_file_fake"]}>{infoText}</span>
      )}

      <label
        htmlFor={id}
        className="btn pink darken-1"
        style={{ whiteSpace: "nowrap" }}
      >
        <span>Выбрать файл</span>
      </label>
    </div>
  );
}
