import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Collapse, Button } from "react-bootstrap";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviar datos al servidor
      const response = await axios.post(
        "http://localhost:3000/contacto",
        formData
      );

      if (response.data.success) {
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          mensaje: "",
        });
        setErrors({});
        setShowErrors(false);
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const newErrors = {};
        error.response.data.errors.forEach((err) => {
          newErrors[err.param] = err.msg;
        });
        setErrors(newErrors);
        setShowErrors(true);
      } else {
        console.error("Error al enviar datos:", error);
        alert("Ocurrió un error al enviar los datos");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container id="contact" className="my-5">
      <Row>
        <Col>
          <h2>Contacto</h2>
          <p>
            Para más información, por favor contáctanos a través de los
            siguientes medios:
          </p>
          <ul>
            <li>Teléfono: +56912345678</li>
            <li>Email: info@lortizco.com</li>
          </ul>
          <form onSubmit={handleSubmit}>
            <h2>¿Quieres cotizar tu servicio?</h2>
            <p>Por favor, completa el siguiente formulario:</p>
            <Collapse in={showErrors}>
              <div className="mb-3">
                {Object.keys(errors).map((key) => (
                  <div key={key} className="alert alert-danger">
                    {errors[key]}
                  </div>
                ))}
              </div>
            </Collapse>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                id="nombre"
                type="text"
                className="form-control"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre y Apellido"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                id="email"
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tucorreo@example.com"
              />
              <div id="emailHelp" className="form-text">
                No compartiremos tu correo con nadie.
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Teléfono</label>
              <input
                id="telefono"
                type="tel"
                className="form-control"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+56912345678"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mensaje</label>
              <textarea
                id="mensaje"
                className="form-control"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows="3"
                placeholder="¿Qué quisieras cotizar?"
              />
            </div>
            <Button type="submit" className="btn btn-primary">
              Enviar
            </Button>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default Contacto;
