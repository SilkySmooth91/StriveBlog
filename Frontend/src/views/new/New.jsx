import { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // serve a decodificare il token JWT come jwt.verify nel backend

const parseJwt = (token) => {
  try {
    return jwtDecode(token); // usa la libreria jwt-decode per decodificare il token
  } catch (e) {
    return null;
  }
};

const NewBlogPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [coverFile, setCoverFile] = useState(null); // gestisce il file immagine
  const [readTimeValue, setReadTimeValue] = useState("");
  const [readTimeUnit, setReadTimeUnit] = useState("min");
  const [authorId, setAuthorId] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Devi essere autenticato per creare un post.");
      return;
    }
    const payload = parseJwt(token);
    if (!payload || !payload.id || !payload.fullname) {
      setError("Token non valido. Effettua nuovamente il login.");
      localStorage.removeItem("token");
      return;
    }
    setAuthorId(payload.id);
    setAuthorName(payload.fullname);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Devi essere autenticato per creare un post.");
      return;
    }
    try {
      // Usa FormData per inviare anche il file
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("readTime[value]", readTimeValue);
      formData.append("readTime[unit]", readTimeUnit);
      // author non serve, viene preso dal backend
      if (coverFile) {
        formData.append("cover", coverFile);
      }

      const res = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          // NON mettere Content-Type qui, lo gestisce il browser con FormData
        },
        body: formData,
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setSuccess("Post pubblicato con successo!");
        setTitle("");
        setContent("");
        setCategory("");
        setCoverFile(null);
        setReadTimeValue("");
        setReadTimeUnit("min");
        navigate(`/blog/${data._id}`, { state: { success: "Articolo creato con successo!" } });
      } else {
        setError(data.error || "Errore durante la pubblicazione");
      }
    } catch (err) {
      setError("Errore di rete");
    }
  };

  if (error) {
    return (
      <Container className="mt-5 pt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="pt-5">Nuovo Post</h2>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contenuto</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Cover (immagine)</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={e => setCoverFile(e.target.files[0])}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tempo di lettura</Form.Label>
          <div style={{ display: "flex", gap: "10px" }}>
            <Form.Control
              type="number"
              min="1"
              value={readTimeValue}
              onChange={e => setReadTimeValue(e.target.value)}
              required
              style={{ width: "100px" }}
            />
            <Form.Select
              value={readTimeUnit}
              onChange={e => setReadTimeUnit(e.target.value)}
              style={{ width: "100px" }}
            >
              <option value="min">min</option>
              <option value="sec">sec</option>
            </Form.Select>
          </div>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Autore</Form.Label>
          <Form.Control
            type="text"
            value={authorName}
            disabled
            readOnly
          />
        </Form.Group>
        <Button type="submit" variant="primary">Pubblica</Button>
        {success && <div className="text-success mt-2">{success}</div>}
      </Form>
    </Container>
  );
};

export default NewBlogPost;
