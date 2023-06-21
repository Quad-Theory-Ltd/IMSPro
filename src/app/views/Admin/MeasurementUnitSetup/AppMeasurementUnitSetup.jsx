import { Box, styled, useTheme } from '@mui/material';
import SimpleCard from 'app/components/SimpleCard';
import Breadcrumb from 'app/components/Breadcrumb';
import MeasurementUnitSetupEntry from './MeasurementUnitSetupEntry';
import AppContext from 'app/contexts/AppContext'

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: {
    margin: '16px',
  },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '16px',
    },
  },
}));

const AppMeasurementUnitSetup = () => {
  const theme = useTheme();

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'ADMIN', path: '/admin' }, { name: 'Measurement Unit Setup' }]} />
      </Box>
      <AppContext.Provider>
        <SimpleCard title="Measurement Unit Setup Entry">
          <MeasurementUnitSetupEntry
            height="350px"
            color={[
              theme.palette.primary.dark,
              theme.palette.primary.main,
              theme.palette.primary.light,
            ]}
          />
        </SimpleCard>

        <Box sx={{ py: '12px' }} />
      </AppContext.Provider>

    </Container>
  );
};

export default AppMeasurementUnitSetup;
