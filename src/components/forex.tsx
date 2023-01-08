import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useEffect, useState } from 'react';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import { useQuery } from 'react-query';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent} from '@mui/material';
import { useIndexedDB } from 'react-indexed-db';
import MatTable from './table';

const fetchSymbolsData = async () => {
  const res = await fetch('https://api.exchangerate.host/symbols');
  return res.json();
};

const fetchConversionData = async ( from: string, to: string ) => {
  const res = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}`);
  return res.json();
};

const fetchConversionHistoryData = async ( startDate: string, endDate: string, from: string, to: string ) => { //2020-01-04
  const res = await fetch(`https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${endDate}
  &base=${from}&symbols=${to}`);
  return res.json();
};

const Forex: React.FC = ({}) => {

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [duration, setDuration] = useState(7);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toJSON().slice(0, 10));
  const [amount, setAmount] = useState(0);
  const [singleRate, setSingleRate] = useState(0);
  const [amountRate, setAmountRate] = useState(0);

  const { add } = useIndexedDB('forex');

  const endDate = new Date().toJSON().slice(0, 10);

  const { data: symbolsData } = useQuery(['symbol'], () => fetchSymbolsData());

  const { data: rate, refetch, isSuccess } = useQuery(['rate', from, to], () => fetchConversionData(from, to), 
  {
    enabled: false,
  });

  const { data: rateHistory, refetch: refetchHistory, isSuccess: historySuccess } = useQuery(['rate', startDate, endDate, from, to], () => fetchConversionHistoryData(startDate, endDate, from, to), 
  {
    enabled: false,
  });

  let symbols: string[] = [];

  if (symbolsData) {
    symbols = Object.keys(symbolsData?.symbols);
  }

  const defaultProps = {
    options: symbols,
    getOptionLabel: (option: string) => option
  };

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseInt(event.target.value));
  }

  const handleChangeFrom = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFrom(event.target.value.toUpperCase());
  }

  const handleChangeTo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTo(event.target.value.toUpperCase());
  }

  const handleDurationChange = (event: SelectChangeEvent<string>) => {
    setDuration(parseInt(event.target.value));
    setStartDate(new Date(Date.now() - parseInt(event.target.value) * 24 * 60 * 60 * 1000).toJSON().slice(0, 10));
    refetchHistory();
  }

  const convertData = () => {
    refetch();
    refetchHistory();
  }

  const exchangeCurrency = () => {
    const fromTemp = from;
    setTo(fromTemp);
    const totemp = to;
    setFrom(totemp);
    convertData();
  }

  useEffect(() => {
    if (isSuccess) {
      setAmountRate(parseFloat((rate.result * amount).toFixed(2)));
      setSingleRate(parseFloat((rate.result).toFixed(2)));
      add({ date: endDate, event: `Converted an amount of ${amount} from ${from} to ${to}` }).then(
        event => {
          console.log('added:', event);
        },
        error => {
          console.log(error);
        }
      );
    }
  }, [isSuccess, from, to, amount]);


  return (
    <>
      <Container maxWidth="xl" className="m-top">
        <h2>I want to Convert</h2>
        <Box
          component="form"
          sx={{
            marginBottom: '2rem',
            justifyContent: 'center',
            display: 'flex',
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="on"
        >
          <TextField id="standard-basic" label="Amount" variant="standard" onChange={handleChangeAmount}/>
          <Autocomplete
            {...defaultProps}
            id="auto-complete"
            autoComplete
            includeInputInList
            inputValue={from}
            renderInput={(params) => (
              <TextField {...params} label="From" variant="standard" onChange={handleChangeFrom}/>
            )}
          />
          <Button variant="contained" onClick={exchangeCurrency} sx={{width: 'fit-content !important',backgroundColor: 'white','color': '#009688',  "&:hover":{backgroundColor: 'white'}}}>
            <SyncAltIcon />
          </Button>
          <Autocomplete
            {...defaultProps}
            id="auto-complete-1"
            autoComplete
            includeInputInList
            inputValue={to}
            renderInput={(params) => (
              <TextField {...params} label="To" variant="standard" onChange={handleChangeTo}/>
            )}
          />
          <Button sx={{backgroundColor: '#009688', "&:hover":{backgroundColor: '#009688'}}} variant="contained" onClick={convertData}>Convert</Button>
        </Box>
        {
          isSuccess &&
          amount !== 0 &&
          <>
            <h1 className='conversionText'>{amount} {from} = 
            <span className='covertedVal'>{amountRate} {to}</span></h1>
            <p className='conversionText'>1 {from} = {singleRate} {to}</p>
            <p className='conversionText'>1 {to} = {parseFloat((1 / singleRate).toFixed(2))} {from}</p>
          </>
        }
        { historySuccess &&
        <>
          <div className="line fullwidth"></div>
          <h2>Exchange History</h2>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Duration</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={duration.toString()}
              onChange={handleDurationChange}
              label="Duration"
            >
              <MenuItem value={'7'}>7</MenuItem>
              <MenuItem value={'14'}>14</MenuItem>
            </Select>
          </FormControl>
          <MatTable rates={rateHistory.rates} currency={to} headers={['Date', 'Rate']} type='forex-history'/>
        </>
        }
        
      </Container>
    </>
  );
}

export default Forex;
