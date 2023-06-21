import { Box, styled, useTheme } from '@mui/material';
import SimpleCard from 'app/components/SimpleCard';
import Breadcrumb from 'app/components/Breadcrumb';
import PurchaseOrderEntry from './PurchaseOrderEntry';
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

const AppPurchaseOrder = () => {
    const theme = useTheme();

    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: 'PURCHASE', path: '/purchase' }, { name: 'Purchase Order' }]} />
            </Box>
            <AppContext.Provider>
                <SimpleCard title="Purchase Order Entry">
                    <PurchaseOrderEntry
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

export default AppPurchaseOrder;
