import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useIndexedDB } from 'react-indexed-db';
import { ConversionHistory } from "../types/forex";

interface MatTableProps {
    rates?: any;
    currency?: string;
    headers: string[];
    data?: ConversionHistory;
    type: string;
    renenderDataOnDelete?: Function;
}

const MatTable: React.FC<any> = ({rates, currency, headers, data, type, renenderDataOnDelete}) => {
  const { deleteRecord, getAll } = useIndexedDB('forex');
  let rows: any = [];

  if (type === 'forex-history') {
    for (const key in rates) {
        rows.push({date: key, rate: rates[key][currency]});
    }
  } else {
    rows = data;
  }

  const handleClickDelete = (id: number | undefined) => {
    deleteRecord(id).then(() => {
        renenderDataOnDelete();
    });
  }

  return (
    <TableContainer component={Paper} >
      <Table sx={{ minWidth: 200 }} aria-label="data table">
        <TableHead>
            <TableRow>
            {headers.map((heading: string) => (
              <TableCell key={heading}>{heading}</TableCell>
            ))}
            </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any) => (
            <TableRow
              key={row.date + row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            <TableCell component="th" scope="row">
              {row.date}
            </TableCell>
            {(type === 'forex-history') &&
              <TableCell component="th" scope="row">
                {row.rate}
              </TableCell>
            }
            {(type === 'search-history') &&
              <>
                <TableCell component="th" scope="row">
                  {row.event}
                </TableCell>
                <TableCell onClick={() => handleClickDelete(row.id)}>
                    <DeleteForeverIcon sx={{cursor: 'pointer'}}/> 
                </TableCell>
              </>
            }
            </TableRow>
            ))}
          </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MatTable;
