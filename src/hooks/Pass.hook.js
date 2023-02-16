import { useCallback, useEffect, useState } from "react";

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export const usePass = () => {
  const [user, setUser] = useState('');

  const login = useCallback((_user) => {
    setUser(_user);
    let date = new Date(Date.now() + 86400e3);
    date = date.toUTCString();
    document.cookie = `user=${_user}; max-age=${date}`;
  }, []);

  const logout = useCallback(() => {
    setUser("");
    document.cookie = `user=g; max-age=0`;
  }, []);

  useEffect(() => {
    const user = getCookie('user');
    console.log(user);
    if (user) {
      login(user);
    }
  }, [login]);

  return { login, logout, user };
};
