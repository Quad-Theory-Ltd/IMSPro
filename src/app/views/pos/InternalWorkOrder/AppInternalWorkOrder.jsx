import { Box, styled, useTheme } from '@mui/material';
import SimpleCard from 'app/components/SimpleCard';
import Breadcrumb from 'app/components/Breadcrumb';
import InternalWorkOrderEntry from './InternalWorkOrderEntry';
//import SalesOrderAddItem from './SalesOrderAddItem';
//import SalesOrderGetPage from './SalesOrderGetPage';
import AppContext from 'app/contexts/AppContext'
import { useState, useMemo } from 'react';

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

const AppInternalWorkOrder = () => {
  const theme = useTheme();
  const [TempInternalWorkOrder, setTempInternalWorkOrder] = useState({});

  const value = useMemo(() => ({ TempInternalWorkOrder, setTempInternalWorkOrder }), [TempInternalWorkOrder, setTempInternalWorkOrder])

  const handleClick = (row) => {
    setTempInternalWorkOrder(row);
  };
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'POS', path: '/pos' }, { name: 'Internal Work Order' }]} />
      </Box>
      <AppContext.Provider value={value}>
        <SimpleCard title="Internal Work Order Entry">
          <InternalWorkOrderEntry
            height="350px"
            color={[
              theme.palette.primary.dark,
              theme.palette.primary.main,
              theme.palette.primary.light,
            ]}
          />
        </SimpleCard>

        <Box sx={{ py: '12px' }} />

        {/* <SimpleCard title="Sales Order Get Page">
          <SalesOrderGetPage
            handleClick={handleClick}
            height="350px"
            color={[
              theme.palette.primary.dark,
              theme.palette.primary.main,
              theme.palette.primary.light,
            ]}
          />
        </SimpleCard> */}
      </AppContext.Provider>



      {/* <Box sx={{ py: '12px' }} />
        <SimpleCard title="Sales Order Add Item">
          <SalesOrderAddItem
            height="350px"
            color={[
              theme.palette.primary.dark,
              theme.palette.primary.main,
              theme.palette.primary.light,
            ]}
          />
        </SimpleCard> */}

    </Container>
  );
};

export default AppInternalWorkOrder;
