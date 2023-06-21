import { Box, styled, useTheme } from '@mui/material';
import SimpleCard from 'app/components/SimpleCard';
import Breadcrumb from 'app/components/Breadcrumb';
import SalesOrderNewApprove from './SalesOrderNewApprove';
import SalesOrderAmendmentRequest from './SalesOrderAmendmentRequest';
import {useState } from "react";


import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

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

const AppSalesOrderApprove = () => {
  const theme = useTheme();
  const [value, setValue] = useState('New Approval');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'POS', path: '/pos' }, { name: 'Sales Order Approve' }]} />
      </Box>

      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="New Approval" value="New Approval" />
              <Tab label="Amendment Request" value="2" />
              {/* <Tab label="Item Three" value="3" /> */}
            </TabList>
          </Box>
          <TabPanel value="New Approval">
            <SimpleCard title="Sales Order New Approve">
              <SalesOrderNewApprove
                height="350px"
                color={[
                  theme.palette.primary.dark,
                  theme.palette.primary.main,
                  theme.palette.primary.light,
                ]}
              />
            </SimpleCard>
          </TabPanel>
          <TabPanel value="2">
          <SimpleCard title="Sales Order Amendment Request">
              <SalesOrderAmendmentRequest
                height="350px"
                color={[
                  theme.palette.primary.dark,
                  theme.palette.primary.main,
                  theme.palette.primary.light,
                ]}
              />
            </SimpleCard>
          </TabPanel>
          {/* <TabPanel value="3">Item Three</TabPanel> */}
        </TabContext>
      </Box>






    </Container>
  );
};

export default AppSalesOrderApprove;
