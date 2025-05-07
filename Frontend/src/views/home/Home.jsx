import React from "react";
import { Container } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";
import RegisterForm from "../../components/auth/RegisterForm";

const Home = props => {
  return (
    <Container fluid="sm">
      <RegisterForm />
      <h1 className="blog-main-title mb-3">Benvenuto sullo Strive Blog!</h1>
      <BlogList />
    </Container>
  );
};

export default Home;
