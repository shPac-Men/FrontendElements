// import type { FC } from 'react';
// import { Form, Row, Col, Button } from 'react-bootstrap';
// import type { Filters } from '../../types/chemistry';
// //import './SearchFilters.css';

// interface Props {
//   filters: Filters;
//   onFiltersChange: (filters: Filters) => void;
//   onSearch: () => void;
//   loading?: boolean;
// }

// const SearchFilters: FC<Props> = ({ filters, onFiltersChange, onSearch, loading }) => {
//   const handleInputChange = (field: keyof Filters, value: string) => {
//     onFiltersChange({
//       ...filters,
//       [field]: value || undefined
//     });
//   };

//   const handleNumberChange = (field: keyof Filters, value: string) => {
//     onFiltersChange({
//       ...filters,
//       [field]: value ? parseFloat(value) : undefined
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSearch();
//   };

//   return (
//     <Form onSubmit={handleSubmit} className="search-filters">
//       <Row className="g-3 align-items-end">
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>Поиск по названию</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Введите запрос..."
//               value={filters.query || ''}
//               onChange={(e) => handleInputChange('query', e.target.value)}
//             />
//           </Form.Group>
//         </Col>
        
//         <Col md={2}>
//           <Form.Group>
//             <Form.Label>pH от</Form.Label>
//             <Form.Control
//               type="number"
//               step="0.1"
//               placeholder="0"
//               value={filters.minPh || ''}
//               onChange={(e) => handleNumberChange('minPh', e.target.value)}
//             />
//           </Form.Group>
//         </Col>
        
//         <Col md={2}>
//           <Form.Group>
//             <Form.Label>pH до</Form.Label>
//             <Form.Control
//               type="number"
//               step="0.1"
//               placeholder="14"
//               value={filters.maxPh || ''}
//               onChange={(e) => handleNumberChange('maxPh', e.target.value)}
//             />
//           </Form.Group>
//         </Col>
        
//         <Col md={2}>
//           <Form.Group>
//             <Form.Label>Конц. от</Form.Label>
//             <Form.Control
//               type="number"
//               step="0.1"
//               placeholder="0"
//               value={filters.minConcentration || ''}
//               onChange={(e) => handleNumberChange('minConcentration', e.target.value)}
//             />
//           </Form.Group>
//         </Col>
        
//         <Col md={2}>
//           <Form.Group>
//             <Form.Label>Конц. до</Form.Label>
//             <Form.Control
//               type="number"
//               step="0.1"
//               placeholder="10"
//               value={filters.maxConcentration || ''}
//               onChange={(e) => handleNumberChange('maxConcentration', e.target.value)}
//             />
//           </Form.Group>
//         </Col>
        
//         <Col md={1}>
//           <Button 
//             variant="primary" 
//             type="submit" 
//             disabled={loading}
//             className="w-100"
//           >
//             {loading ? '...' : 'Найти'}
//           </Button>
//         </Col>
//       </Row>
//     </Form>
//   );
// };

// export default SearchFilters;