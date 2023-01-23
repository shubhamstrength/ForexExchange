import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import { ConversionHistory } from '../types/forex';
import MatTable from './table';

const History: React.FC = ({}) => {

const { getAll } = useIndexedDB('forex');
const [forexData, setForexData] = useState<any[]>([]);

useEffect(() => {
  getAll().then(dataFromDB => {
    setForexData(dataFromDB);
  });
}, [forexData]);

const renenderDataOnDelete = () => {
  getAll().then(dataFromDB => {
    setForexData(dataFromDB);
  });
}

  return (
    <>
      <Container maxWidth="xl" className="m-top">
        <h2>History</h2>
        {forexData.length > 0 &&
          <MatTable 
            data={forexData} 
            headers={['Date', 'Event', 'Action']} 
            type='search-history' 
            renenderDataOnDelete={renenderDataOnDelete}
          />
        }
      </Container>
    </>
  );
}

export default History;
