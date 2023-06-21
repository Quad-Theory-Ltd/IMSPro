import { Stack, useTheme } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Breadcrumb, SimpleCard } from "app/components";
import PurchaseBillReturnEntry from './PurchaseBillReturnEntry';
import AppContext from 'app/contexts/AppContext'

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
}));

const AppPurchaseBillReturn = () => {
    const theme = useTheme();
    const value = {};

    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: 'PURCHASE', path: '/purchase' }, { name: 'Purchase Bill Return' }]} />
            </Box>
            <AppContext.Provider value={value}>
                <Stack spacing={3}>
                    <PurchaseBillReturnEntry
                        //height="350px"
                        color={[
                            theme.palette.primary.dark,
                            theme.palette.primary.main,
                            theme.palette.primary.light,
                        ]}
                    />
                </Stack>
            </AppContext.Provider>

        </Container>
    );
};

export default AppPurchaseBillReturn;
