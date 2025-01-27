import { useEffect, useState } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  styled,
  CircularProgress,
  Box
} from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import { Feature, ResultsData } from '../types';
import { getBackendUrl } from '../config';

const StyledTableCell = styled(TableCell)(() => ({
  fontWeight: 'bold',
  padding: '16px',
  borderRight: '1px solid rgba(224, 224, 224, 1)',
}));

const StatusCell = styled(TableCell)<{ status: 'passed' | 'failed' }>(({ status }) => ({
  backgroundColor: status === 'passed' ? '#e6ffe6' : '#ffe6e6',
  color: status === 'passed' ? '#006400' : '#8b0000',
  textAlign: 'center',
  fontWeight: 'bold',
  padding: '16px',
  borderRight: '1px solid rgba(224, 224, 224, 1)',
}));

const Dashboard = () => {
  const [data, setData] = useState<ResultsData>({});
  const [featureTypes, setFeatureTypes] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendUrl, setBackendUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initializeBackendUrl = async () => {
      try {
        const url = await getBackendUrl();
        console.log('Backend URL initialized:', url); // Debug log
        setBackendUrl(url);
      } catch (error) {
        console.error('Failed to initialize backend URL:', error);
        setError('Failed to connect to backend server');
        setLoading(false);
      }
    };
    initializeBackendUrl();
  }, []);

  useEffect(() => {
    if (!backendUrl) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data from:', `${backendUrl}/results`); // Debug log
        const response = await axios.get(`${backendUrl}/results`);
        const responseData = response.data as ResultsData;
        console.log('Received data:', responseData); // Debug log
        setData(responseData);
        
        // Extract unique feature types
        const types = new Set<string>();
        Object.values(responseData).forEach((features) => {
          (features as Feature[]).forEach(feature => types.add(feature.type));
        });
        setFeatureTypes(Array.from(types));

        // Get dates in order
        const sortedDates = Object.keys(responseData).sort((a, b) => 
          moment(a, 'DD/MM/YYYY').valueOf() - moment(b, 'DD/MM/YYYY').valueOf()
        );
        setDates(sortedDates);
        setError('');
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data from server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [backendUrl]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px" color="error.main">
        {error}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Feature</StyledTableCell>
            {dates.map(date => (
              <StyledTableCell key={date} align="center">
                {date}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {featureTypes.map(featureType => (
            <TableRow key={featureType}>
              <StyledTableCell component="th" scope="row">
                {featureType}
              </StyledTableCell>
              {dates.map(date => {
                const feature = data[date]?.find(f => f.type === featureType);
                return feature ? (
                  <StatusCell key={date} status={feature.status}>
                    {feature.test_cases_count}
                  </StatusCell>
                ) : (
                  <TableCell key={date} align="center">-</TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Dashboard; 