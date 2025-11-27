// src/components/ElementCard/ElementCard.tsx
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { Element } from '../../modules/types';
import './ElementCard.css';

interface Props {
  element: Element;
}

const DEFAULT_IMAGE = 'https://via.placeholder.com/180?text=No+Image';

export const ElementCard: FC<Props> = ({ element }) => {
  return (
    <div className="element-card">
      <img
        src={element.image || DEFAULT_IMAGE}
        alt={element.name}
        className="card-img"
        onError={(e) => {
          e.currentTarget.src = DEFAULT_IMAGE;
        }}
      />
      <h3>{element.name}</h3>
      <p className="description">{element.description}</p>
      <div className="properties">
        <p>
          <strong>pH:</strong> {element.ph}
        </p>
        <p>
          <strong>Концентрация:</strong> {element.concentration}
        </p>
      </div>
      <Link to={`/elements/${element.id}`} className="btn btn-primary">
        Подробнее
      </Link>
    </div>
  );
};
