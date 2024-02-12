import React from 'react';
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export type CardProps = {
  id?: number,
  src?: string;
  title: React.ReactNode;
  onButtonClick?: React.MouseEventHandler;
  onImageClick?: React.MouseEventHandler;
};

const OneCard: React.FC<CardProps> = ({id, title, src, onImageClick }) => {
  return (
    <Card>
      <Link to={`categorys/${id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Image
            style={{ cursor: 'pointer', width: '100%', height: 'auto' }}
            onClick={onImageClick}
            src={src ? src : "https://www.solaredge.com/us/sites/nam/files/Placeholders/Placeholder-4-3.jpg"}
            rounded
          />
        </div>
      </Link>
      <Card.Body className='d-flex flex-column'>
        <Card.Title className='pt-3'>{title}</Card.Title>
        
      </Card.Body>
    </Card>
  );
};

export default OneCard;