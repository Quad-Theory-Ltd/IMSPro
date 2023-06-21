import { Box, styled, useTheme } from '@mui/material';
import SimpleCard from 'app/components/SimpleCard';
import Breadcrumb from 'app/components/Breadcrumb';
import PurchaseBillCancellationEntry from './PurchaseBillCancellationEntry';
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

const AppPurchaseBillCancellation = () => {
    const theme = useTheme();

    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: 'PURCHASE', path: '/purchase' }, { name: 'Purchase Bill Cancellation' }]} />
            </Box>
            <AppContext.Provider>
                <SimpleCard title="Purchase Bill Cancellation">
                    <PurchaseBillCancellationEntry
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

export default AppPurchaseBillCancellation;
