import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Navbar,
  Nav,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import logo from "../public/Luis ortíz.png";
import Contacto from "./components/Contacto"; // Importa el componente Contacto
import "./App.css";

const App = () => {
  const [formData, setFormData] = useState({
    email: "",
    telefono: "",
    mensaje: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/contacto", formData);
      alert("¡Datos enviados correctamente!");
    } catch (error) {
      console.error("Error al enviar datos:", error);
      alert("Ocurrió un error al enviar los datos");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Navbar.Brand href="#home">
          <img id="logo" src={logo} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="#home">Inicio</Nav.Link>
            <Nav.Link href="#about">Nosotros</Nav.Link>
            <Nav.Link href="#services">Servicios</Nav.Link>
            <Nav.Link href="#contact">Contacto</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Hero Section */}
      <div id="home" className="text-center p-5 mb-4 bg-light rounded-3">
        <Container>
          <h1>Bienvenido a LORTIZCO</h1>
          <p>
            Fabricamos muebles, cubiertas de granito, cubiertas de cuarzo y
            ventanas termopanel.
          </p>
          <Button variant="primary" href="#contact">
            Contáctanos
          </Button>
        </Container>
      </div>

      {/* About Section */}
      <Container id="about" className="my-5">
        <Row>
          <Col>
            <h2>Sobre Nosotros</h2>
            <p>
              LORTIZCO es una empresa dedicada a la fabricación de muebles,
              cubiertas de granito, cubiertas de cuarzo y ventanas termopanel.
              Con años de experiencia en el mercado, nos hemos consolidado como
              líderes en la industria, ofreciendo productos de alta calidad y
              excelente servicio al cliente.
            </p>
          </Col>
        </Row>
      </Container>

      {/* Services Section */}
      <Container id="services" className="my-5">
        <Row>
          <Col md={4}>
            <Card>
              <Card.Img
                id="mueble"
                className="card-img"
                variant="top"
                src="public/mesonMadera.jpg"
              />
              <Card.Body>
                <Card.Title>Muebles</Card.Title>
                <Card.Text>
                  Fabricamos muebles de alta calidad con los mejores materiales.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Img
                id="cubierta"
                className="card-img"
                variant="top"
                src="public/cubiertaGranito.jpg"
              />
              <Card.Body>
                <Card.Title>Cubiertas de Granito</Card.Title>
                <Card.Text>
                  Nuestras cubiertas de granito son duraderas y elegantes.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Img
                id="ventana"
                className="card-img"
                variant="top"
                src="public/Ventana.jpg"
              />
              <Card.Body>
                <Card.Title>Ventanas Termopanel</Card.Title>
                <Card.Text>
                  Ofrecemos ventanas termopanel para mejorar la eficiencia
                  energética.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Contact Section */}
      <Contacto
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={formData}
      />

      {/* Footer */}
      <footer className="text-center py-4 bg-dark text-white">
        <Container>
          <p>&copy; 2023 LORTIZCO. Todos los derechos reservados.</p>
        </Container>
      </footer>

      {/* WhatsApp Icon */}
      <a
        href="https://wa.me/+56931257414"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="whatsapp-icon" />
      </a>
    </div>
  );
};

export default App;
