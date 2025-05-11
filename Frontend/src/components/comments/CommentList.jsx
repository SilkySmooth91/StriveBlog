import React, { useEffect, useState } from "react";
import { ListGroup, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3001/posts/${postId}/comments`)
      .then(res => {
        setComments(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Errore nel caricamento dei commenti");
        setLoading(false);
      });
  }, [postId]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (comments.length === 0) return <div>Nessun commento.</div>;

  return (
    <ListGroup className="mb-4">
      {comments.map(comment => (
        <ListGroup.Item key={comment._id}>
          <strong>
            {comment.author?.username || "Anonimo"}:
          </strong> {comment.body}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default CommentList;