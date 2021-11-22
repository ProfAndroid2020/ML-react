// import React, { useState, useEffect } from "react";
// import { useMessage } from "../hooks/message.hook";

// export default function ChangePassword() {
//   const { loading, error, request, clearError } = useHttp();
//   const message = useMessage();
//   const [mainPassword, setMainPassword] = useState("");
//   const [adminPassword, setAdminPassword] = useState("");

//   useEffect(() => {
//     message(error);
//     clearError();
//   }, [error, message, clearError]);

//   const saveMainPassword = async () => {
//     try {
//       const data = await request("/api/savePassword/main", "POST", {
//         password: mainPassword,
//       });

//       setMainPassword("");
//       message(data.message);
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const saveAdminPassword = async () => {
//     try {
//       const data = await request("/api/savePassword/admin", "POST", {
//         password: adminPassword,
//       });

//       setAdminPassword("");
//       message(data.message);
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   return (
//     <div className="container">
//       <h4 style={{ textAlign: "center" }}>Смена паролей</h4>

//       <div className="row">
//         <div className="input-field col s6">
//           <input
//             id="mainPassword"
//             type="password"
//             value={mainPassword}
//             onChange={(event) => setMainPassword(event.target.value)}
//           />
//           <label htmlFor="mainPassword">Основной пароль</label>
//         </div>
//         <button
//           className="btn pink darken-1"
//           onClick={saveMainPassword}
//           disabled={loading}
//         >
//           Сменить
//         </button>
//       </div>

//       <div className="row">
//         <div className="input-field col s6">
//           <input
//             id="adminPassword"
//             type="password"
//             onChange={(event) => setAdminPassword(event.target.value)}
//             value={adminPassword}
//           />
//           <label htmlFor="adminPassword">Пароль администратора</label>
//         </div>
//         <button
//           className="btn pink darken-1"
//           onClick={saveAdminPassword}
//           disabled={loading}
//         >
//           Сменить
//         </button>
//       </div>
//     </div>
//   );
// }
