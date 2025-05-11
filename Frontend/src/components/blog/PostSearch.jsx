import { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const PostSearch = ({ onSearch }) => {
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ author, category });
  };

  // Se entrambi i campi sono vuoti, mostra tutti gli articoli
  useEffect(() => {
    if (author === "" && category === "") {
      onSearch({ author: "", category: "" });
    }
    // eslint-disable-next-line
  }, [author, category]);

  return (
    <Form onSubmit={handleSubmit} className="mb-4 mt-5">
      <Row>
        <Col md={5}>
          <Form.Control
            type="text"
            placeholder="Cerca per autore"
            value={author}
            onChange={e => setAuthor(e.target.value)}
          />
        </Col>
        <Col md={5}>
          <Form.Control
            type="text"
            placeholder="Cerca per categoria"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Button type="submit" variant="primary" className="w-100">
            Cerca
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default PostSearch;