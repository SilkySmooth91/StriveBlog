import React, { useState, useEffect } from "react";
import { Button, Container, Navbar, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { jwtDecode } from "jwt-decode";
import "./styles.css";

const NavBar = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = jwtDecode(token);
        setUser(payload);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data);
        const payload = jwtDecode(data);
        setUser(payload);
        setEmail("");
        setPassword("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Errore di rete");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Navbar expand="lg" className="blog-navbar p-0" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>

        {user ? (
          <Row className="align-items-center">
            <Col>
              <Link to={`/users/${user.id}`} className="me-3 nav-link" style={{ display: "inline", padding: 0 }}>
                Ciao, {user.fullname}
              </Link>
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            </Col>
          </Row>
        ) : (
          <Form onSubmit={handleLogin}>
            <Row className="align-items-center justify-content-center">
              <Col>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formGroupPassword">
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
              <Col>
                <Button variant="primary" type="submit">login</Button>
              </Col>
            </Row>
            {error && <div className="text-danger">{error}</div>}
          </Form>
        )}

        <Button as={Link} to="/new" className="blog-navbar-add-button bg-dark" size="lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-plus-lg"
            viewBox="0 0 16 16"
          >
            <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
          </svg>
          Nuovo Articolo
        </Button>
      </Container>
    </Navbar>
  );
};

export default NavBar;
