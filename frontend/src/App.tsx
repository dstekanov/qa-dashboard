import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import Dashboard from './components/Dashboard'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} sx={{ py: 4 }}>
        <Dashboard />
      </Container>
    </ThemeProvider>
  )
}

export default App
