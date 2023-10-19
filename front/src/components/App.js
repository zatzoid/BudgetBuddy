import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRouteElement from "./ProtectedRoutEl";
import { CurrentUserContext } from "./Context";
import Header from "./header/Header";
import Footer from "./footer/footer";

import SignIn from "./sign/SignIn";
import SignUp from "./sign/SignUp";
import LoaclPosts from "./localPosts/LocalPosts";



/* 
api
защитить роуты
кнопка изменения профиля
*/
function App() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({name:'statqw1eeqwic', email: 'staqweqwasdastic@email.com'})
  function log() {
    if (!loggedIn) {
      return setLoggedIn(true)
    }
    setLoggedIn(false)
  };
  function signOut() {
    navigate('/sign-in')
  };
  return (
    <div className="App">
      <CurrentUserContext.Provider value={userData}>
        <Header loggedIn={loggedIn} signOut={signOut} />
        <Routes>
          <Route path="/sign-up" element={<SignUp submit={log} />} />
          <Route path="/sign-in" element={<SignIn submit={log} />} />
          <Route path="/local-posts" element={<LoaclPosts />} />
        </Routes>
        <Footer />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
