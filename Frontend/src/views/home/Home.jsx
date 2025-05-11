import { useState } from "react";
import { Container } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import PostSearch from "../../components/blog/PostSearch";
import "./styles.css";
import RegisterForm from "../../components/auth/RegisterForm";

const Home = props => {
  const [filters, setFilters] = useState({ author: "", category: "" });

  return (
    <Container fluid="sm">
      <RegisterForm />
      <h1 className="blog-main-title mb-3">Benvenuto sullo Strive Blog!</h1>
      <PostSearch onSearch={setFilters} />
      <BlogList filters={filters} />
    </Container>
  );
};

export default Home;
