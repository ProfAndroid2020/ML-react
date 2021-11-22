import "materialize-css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { PassContext } from "./context/passContext";
import { DBContext } from "./context/DBContext";
import { usePass } from "./hooks/Pass.hook";
import { useRoutes } from "./routes";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getStorage } from 'firebase/storage'
import { Loader } from "./components/Loader";

function App() {
  const { login, logout, user } = usePass();
  const routes = useRoutes(user);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState(null);
  const [notes, setNotes] = useState(null);
  const [dataBase, setDataBase] = useState(null);
  const [storage, setStorage] = useState();

  useEffect(() => {
    if (user === 'admin' || user === 'simple') {
      const firebaseConfig = {
        apiKey: "AIzaSyD83MTrbSgDhgK3pbKAvdtk4lj4oc576Xc",
        authDomain: "train-934f7.firebaseapp.com",
        databaseURL:
          "https://train-934f7-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "train-934f7",
        storageBucket: "train-934f7.appspot.com",
        messagingSenderId: "179418608293",
        appId: "1:179418608293:web:6a03d9cb7c1340f465d34c",
      };
      const firebaseApp = initializeApp(firebaseConfig);
      const db = getDatabase(firebaseApp);
      setStorage(getStorage(firebaseApp))
      setDataBase(db);
      const myref = ref(db);
  
      onValue(myref, (snapshot) => {
        setLoading(true);
        const _notes = snapshot.val().notes;
        const _classes = snapshot.val().ClassesPart;
        const cls = [];
        for (const key in _classes) {
          const cl = _classes[key];
          cls.push({
            value: cl.name,
            text: cl.name,
            key,
          });
        }
        setClasses(cls.sort((a, b) => a.text.localeCompare(b.text)))
  
        const nts = []
        for (const key in _notes) {
          const note = _notes[key];
          nts.push({
            key: key,
            classScore: note.classScore,
            isCurrent: note.isCurrent,
            name: note.scoreName,
            pdf: note.pdf,
            parts: note.parts,
          });
        }
        setNotes(nts);
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <PassContext.Provider value={{ login, logout, user }}>
      <DBContext.Provider value={{ classes, notes, loading, dataBase, storage }}>
        <Router>
          {user && !loading && <Navbar user={user} />}
          {loading ? <Loader /> : routes}
        </Router>
      </DBContext.Provider>
    </PassContext.Provider>
  );
}

export default App;
