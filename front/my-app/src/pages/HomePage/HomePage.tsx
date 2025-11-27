import type {FC} from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes";
import { Button, Col, Container, Row } from "react-bootstrap";

export const HomePage: FC = () => {
  return (
    <Container>
      <Row className="justify-content-center text-center">
        <Col md={8}>
          <h1 className="mb-4">Itunes Music</h1>
          <p className="lead mb-4">
            Добро пожаловать в Itunes Music! Здесь вы можете найти музыку на
            любой вкус.
          </p>
          <Link to="/itunes">
            <Button variant="primary" size="lg">
              Найти музыку
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};