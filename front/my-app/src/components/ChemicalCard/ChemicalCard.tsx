import type { FC } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { ChemicalElement } from '../../types/chemistry';
import './ChemicalCard.css';

interface Props {
  element: ChemicalElement;
  onAddToMixing?: (id: number) => void;
}

const ChemicalCard: FC<Props> = ({ element, onAddToMixing }) => {
  const handleAddToMixing = () => {
    onAddToMixing?.(element.id);
  };

  return (
    <Card className="chemical-card">
      <Card.Img 
        variant="top" 
        src={element.image} 
        alt={element.name}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/default_element.png';
        }}
        className="chemical-card__image"
      />
      <Card.Body>
        <Card.Title className="chemical-card__formula">
          {element.name}
        </Card.Title>
        <Card.Text className="chemical-card__description">
          {element.description}
        </Card.Text>
        <div className="chemical-card__properties">
          <div className="property">
            <span className="property-label">pH:</span>
            <span className="property-value">{element.ph}</span>
          </div>
          <div className="property">
            <span className="property-label">Концентрация:</span>
            <span className="property-value">{element.concentration} M</span>
          </div>
        </div>
        <div className="chemical-card__actions">
          <Link to={`/elements/${element.id}`}>
            <Button variant="outline-primary" size="sm">
              Подробнее
            </Button>
          </Link>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleAddToMixing}
          >
            В корзину
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ChemicalCard;