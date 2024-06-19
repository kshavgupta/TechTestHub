import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles"; // Import ThemeProvider
import Home from "./Components/Home";
import Upload from "./Components/Upload";
import Question from "./Components/Question";
import ShowQuestionsbyCompany from "./Components/ShowQuestionsbyCompany";
import "./App.css";
import ShowQuestionsbyTopic from "./Components/ShowQuestionsbyTopic";
import UserProfile from "./Components/UserProfile";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import { GlobalStateProvider } from "./Components/Context";
import getLPTheme from "./Components/getLPTheme"; // Import your theme function

function App() {
  const [mode, setMode] = React.useState("light");
  const LPtheme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };
  return (
    <Router>
      <GlobalStateProvider>
        <ThemeProvider theme={LPtheme}>
          <div>
            <Routes>
              <Route
                exact
                path="/"
                element={<Home mode={mode} toggleColorMode={toggleColorMode} />}
              />
              <Route exact path="/Upload" element={<Upload />} />
              <Route
                exact
                path="/Questions/:Company"
                element={<ShowQuestionsbyCompany />}
              />
              <Route
                exact
                path="/Questions/:Topic"
                element={<ShowQuestionsbyTopic />}
              />
              <Route exact path="/Question/:Title" element={<Question />} />
              <Route
                exact
                path="/Profile/:Username"
                element={<UserProfile />}
              />
              <Route exact path="/SignIn" element={<SignIn />} />
              <Route exact path="/SignUp" element={<SignUp />} />
            </Routes>
          </div>
        </ThemeProvider>
      </GlobalStateProvider>
    </Router>
  );
}

export default App;
