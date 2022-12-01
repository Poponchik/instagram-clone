
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Account from "./account";
import Login from "./login";
import Post from "./post";
import Registration from "./registration";
import Main from "./main";
import Layout from "./layout";
import * as React from 'react'
import AuthorizedComponent from "./AuthorizedComponent";

function App() {
  console.log(process.env.REACT_APP_ENV)
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/registration" element={<Registration />} />
      </Routes>
      <Layout>
        <Routes>
          <Route path="/:username" element={<AuthorizedComponent component={<Account />} />} />
          <Route path="/p/:postId" element={<AuthorizedComponent component={<Post />} />} />
          <Route path="/" element={<AuthorizedComponent component={<Main />} />} />
        </Routes>
      </Layout>
    </Router>

  );
}

export default App;
