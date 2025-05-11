import { useEffect } from "react";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/New";
import UserProfile from "./views/user/UserProfile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const fetchAuthors = async () => {
    const res = await fetch(process.env.REACT_APP_APIURL + "/authors");
    const data = await res.json();
    console.log(data)
  }

  useEffect(() => {
    fetchAuthors()
  }, [])

  useEffect(() => {
  // Cerca il token nei query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');
  
  if (token) {
    // Salva il token
    localStorage.setItem('token', token);
    // Pulisce l'URL
    window.history.replaceState({}, document.title, window.location.pathname);
    // refresh della pagina
    window.location.reload();
  }
}, []);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/new" element={<NewBlogPost />} />
        <Route path="/users/:id" element={<UserProfile />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
