import React, { useContext, useEffect, useState } from "react";
import { PassContext } from "../context/passContext";
import { useMessage } from "../hooks/message.hook";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Comment just for git

export const Pass = () => {
  const pass = useContext(PassContext);
  const message = useMessage();
  const [password, setPassword] = useState("");

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const changeHandler = (event) => {
    setPassword(event.target.value);
  };

  const tryPassHandler = async (ev) => {
    ev.preventDefault();

    const auth = getAuth();
    signInWithEmailAndPassword(auth, "simple.user.ml@gmail.com", password)
      .finally(() => {
        // setPassword("");
        // window.M.updateTextFields();
      })
      .then(() => {
        // Signed in
        // const user = userCredential.user;
        // console.log(user);
        pass.login("simple");

      })
      .catch(() => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // console.log(errorCode);
        signInWithEmailAndPassword(auth, "admin.user.ml@gmail.com", password)
          .then(() => {
            pass.login("admin");
          })
          .catch(() => {
            message("Неверный пароль");
          });
      });
  };

  return (
    <div className="row">
      <div className="col xl6 s12 offset-xl3">
        <h3
          style={{ textAlign: "center" }}
          onClick={() => console.log(pass.user)}
        >
          Musica Linguae
        </h3>
        <form>
          <div className="card pink darken-1">
            <div className="card-content white-text">
              <span className="card-title">Вход в архив</span>

              <div className="input-field">
                <input
                  id="password"
                  type="password"
                  className="validate white-input"
                  onChange={changeHandler}
                  value={password}
                />
                <label htmlFor="password">Пароль</label>
              </div>
            </div>
            <div
              className="card-action"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button
                className="btn pink lighten-5 black-text waves-effect waves-darken"
                onClick={tryPassHandler}
              >
                Войти
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
