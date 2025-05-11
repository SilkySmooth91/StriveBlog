import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Form, Alert, Image, Container } from "react-bootstrap";
import axios from "axios";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3001/users/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(res => setUser(res.data))
      .catch(() => setError("Errore nel caricamento del profilo"));
  }, [id]);

  const handleAvatarChange = e => {
    setAvatarFile(e.target.files[0]);
  };

  const handleAvatarUpload = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!avatarFile) return;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    try {
      const res = await axios.patch(
        `http://localhost:3001/users/${id}/avatar`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setUser(res.data);
      setSuccess("Avatar aggiornato!");
      setAvatarFile(null);
    } catch {
      setError("Errore durante l'aggiornamento dell'avatar");
    }
  };

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!user) return <div>Caricamento...</div>;

  return (
    <Container className="mt-5 pt-5 d-flex justify-content-center">
      <Card style={{ width: 350 }}>
        <Card.Body className="text-center">
          <Image
            src={user.avatar}
            roundedCircle
            style={{ width: 100, height: 100, objectFit: "cover", marginBottom: 20 }}
            alt="avatar"
          />
          <Card.Title>{user.fullname}</Card.Title>
          <Card.Text>
            <strong>Username:</strong> {user.username} <br />
            <strong>Email:</strong> {user.email} <br />
            <strong>Verified:</strong> {user.verified ? "Sì" : "No"}
          </Card.Text>
          <Form onSubmit={handleAvatarUpload}>
            <Form.Group>
              <Form.Label>Cambia avatar</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </Form.Group>
            <Button type="submit" className="mt-2" variant="primary" size="sm">
              Aggiorna avatar
            </Button>
          </Form>
          {success && <Alert variant="success" className="mt-2">{success}</Alert>}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProfile;