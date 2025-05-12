import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

const CommentForm = ({ postId, onCommentAdded }) => {
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Devi essere autenticato per commentare.");
        return;
      }
      await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/${postId}/comments`,
        { body },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setBody("");
      setSuccess("Commento aggiunto!");
      onCommentAdded();
    } catch {
      setError("Errore nell'aggiunta del commento");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group>
        <Form.Label>Aggiungi un commento</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={body}
          onChange={e => setBody(e.target.value)}
          required
        />
      </Form.Group>
      <Button type="submit" className="mt-2">Invia</Button>
      {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
      {success && <Alert variant="success" className="mt-2">{success}</Alert>}
    </Form>
  );
};

export default CommentForm;