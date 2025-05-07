import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username, fullname }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Registrazione avvenuta con successo! Ora puoi effettuare il login.");
        setEmail("");
        setPassword("");
        setUsername("");
        setFullName("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Errore di rete");
    }
  };

  return (
    <Form onSubmit={handleRegister} className="mt-5">
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Inserisci email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="registerUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="registerfullname">
            <Form.Label>Nome e Cognome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nome e Cognome"
              value={fullname}
              onChange={e => setFullName(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Button variant="success" type="submit">Registrati</Button>
      {error && <div className="text-danger mt-2">{error}</div>}
      {success && <div className="text-success mt-2">{success}</div>}
    </Form>
  );
};

export default RegisterForm;