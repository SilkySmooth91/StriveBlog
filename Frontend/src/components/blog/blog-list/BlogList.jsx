import React, { useEffect, useState } from "react";
import { Col, Row, Spinner, Alert } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";
import axios from "axios";

const BlogList = ({ filters }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Chiedi i post già ordinati dal più recente al meno recente
    axios
      .get("http://localhost:3001/posts", {
      })
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Errore nel caricamento degli articoli");
        setLoading(false);
      });
  }, []);

  const filteredPosts = posts.filter(post => {
    const authorMatch = filters.author
      ? post.author && post.author.fullname && post.author.fullname.toLowerCase().includes(filters.author.toLowerCase())
      : true;
    const categoryMatch = filters.category
      ? post.category && post.category.toLowerCase().includes(filters.category.toLowerCase())
      : true;
    return authorMatch && categoryMatch;
  });

  if (loading) return <Spinner animation="border" className="m-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Row>
      {filteredPosts.map((post, i) => (
        <Col
          key={`item-${i}`}
          md={4}
          style={{
            marginBottom: 50,
          }}
        >
          <BlogItem key={post._id} {...post} />
        </Col>
      ))}
    </Row>
  );
};

export default BlogList;
