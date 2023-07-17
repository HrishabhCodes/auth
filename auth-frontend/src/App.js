import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import BlogForm from "./components/Blog/BlogForm";
import { isAuthenticated } from "./utils/auth";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route
            exact
            path="/blogs"
            element={
              isAuthenticated() ? <BlogForm /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
