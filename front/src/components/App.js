import React, { useEffect, useState } from "react";
import Header from "./header/Header";
import Footer from "./footer/footer";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  function log() {
    if (!loggedIn) {
      console.log(true)
      return setLoggedIn(true)


    }
    console.log(false)
    setLoggedIn(false)
  }
  return (
    <div className="App">
      <Header loggedIn={loggedIn} log={log} />
      <Footer />
    </div>
  );
}

export default App;
