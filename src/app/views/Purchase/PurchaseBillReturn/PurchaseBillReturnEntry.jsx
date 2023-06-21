import { DatePicker } from "@mui/lab";
import { Breadcrumb, SimpleCard } from "app/components";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    Button,
    Checkbox,
    FormControlLabel,
    Autocomplete,
    Grid,
    Icon,
    Radio,
    RadioGroup,
    Box,
    IconButton,
    styled,
    TableFooter,
} from "@mui/material";

import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import axios from 'axios'
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { APIUrl } from 'app/views/environment';

const AutoComplete = styled(Autocomplete)(() => ({
    width: "100%",
    // marginBottom: '16px',
}));
const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));


const subscribarList = [
    {
        name: "john doe",
        date: "18 january, 2019",
        amount: 1000,
        status: "close",
        company: "ABC Fintech LTD.",
    },
    {
        name: "kessy bryan",
        date: "10 january, 2019",
        amount: 9000,
        status: "open",
        company: "My Fintech LTD.",
    },
    {
        name: "james cassegne",
        date: "8 january, 2019",
        amount: 5000,
        status: "close",
        company: "Collboy Tech LTD.",
    },
    {
        name: "lucy brown",
        date: "1 january, 2019",
        amount: 89000,
        status: "open",
        company: "ABC Fintech LTD.",
    },
    {
        name: "lucy brown",
        date: "1 january, 2019",
        amount: 89000,
        status: "open",
        company: "ABC Fintech LTD.",
    },
    {
        name: "lucy brown",
        date: "1 january, 2019",
        amount: 89000,
        status: "open",
        company: "ABC Fintech LTD.",
    },
];

export const PurchaseBillReturnEntry = ({ row }) => {
    const [state, setState] = useState({ date: new Date() });
    const [PurchaseBillItemList, setPurchaseBillItemList] = useState([])

    useEffect(() => {
        GetReceiveQtyForPurchaseReturn();
        ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
            if (value !== state.password) return false;

            return true;
        });
        return () => ValidatorForm.removeValidationRule("isPasswordMatch");
    }, [state.password]);

    const handleSubmit = (event) => {
        // console.log("submitted");
        // console.log(event);
    };

    const handleChange = (event) => {
        event.persist();
        setState({ ...state, [event.target.name]: event.target.value });
    };

    const handleDateChange = (date) => setState({ ...state, date });

    const {
        username,
        firstName,
        creditCard,
        mobile,
        password,
        confirmPassword,
        gender,
        date,
        email,
    } = state;
    
    function GetReceiveQtyForPurchaseReturn() {
        console.log(APIUrl);
        axios.get(APIUrl + 'PurchaseBill/GetReceiveQtyForPurchaseReturn?PBId=60134' + "&IsLocal=true")
            .then(response => {
                //console.log(response)
                setPurchaseBillItemList(response.data)
                //console.log(response.data)
            }).catch(error => {
                console.log('error')
            })
    }

    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <SimpleCard title="Purchase Bill Return Entry">
                    <Grid container spacing={2}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 0 }}>
                            <AutoComplete
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Supplier Name"
                                        variant="outlined"
                                        fullWidth
                                        validators={["required"]}
                                        errorMessages={["This field is required"]}
                                    />
                                )}
                                autoSelect
                            />
                            <AutoComplete
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Purchase Bill No"
                                        variant="outlined"
                                        fullWidth
                                        validators={["required"]}
                                        errorMessages={["This field is required"]}
                                    />
                                )}
                                autoSelect
                            />


                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    renderInput={(props) => (
                                        <TextField
                                            {...props}
                                            label="Purchase Return Date"
                                            id="mui-pickers-date"
                                            sx={{ mb: 2, width: "100%" }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 0 }}>
                            <TextField
                                type="text"
                                name="Department"
                                label="Received Department"
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                                disabled
                            />
                            <TextField
                                name="PurchaseReturnNo"
                                type="text"
                                label="Purchase Return No"
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                                disabled
                            />
                        </Grid>
                    </Grid>
                </SimpleCard>
                <br></br>
                <SimpleCard title="Purchase Bill Item List">
                    <Box width="100%" overflow="auto">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">SL No.</TableCell>
                                        <TableCell align="center">Item Name</TableCell>
                                        <TableCell align="center">PB Qty</TableCell>
                                        <TableCell align="center">PB Unit Price</TableCell>
                                        <TableCell align="center">Rcv. Qty</TableCell>
                                        <TableCell align="center">Rcv. Unit Price</TableCell>
                                        <TableCell align="center">VAT (%)</TableCell>
                                        <TableCell align="center">VAT Amt.</TableCell>
                                        <TableCell align="center">Total PB Amt.</TableCell>
                                        <TableCell align="center">Total Rcv. Amt.</TableCell>
                                        {/* <TableCell align="right">Action</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {PurchaseBillItemList.map((aItem, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="left">
                                                {index + 1}
                                                <FormControlLabel
                                                    style={{ paddingInline: '1em' }}
                                                    control={<Checkbox />}
                                                    label=""
                                                />
                                            </TableCell>
                                            <TableCell align="left">{aItem.ItemDescription}</TableCell>
                                            <TableCell align="center">{aItem.PBQty}</TableCell>
                                            <TableCell align="center">{aItem.PBUnitPrice}</TableCell>
                                            <TableCell align="center">{aItem.ReceiveQty}</TableCell>
                                            <TableCell align="center">{aItem.ReceiveUnitPrice}</TableCell>
                                            <TableCell align="center">{(aItem.VatAmount/aItem.PBQty) / 100}</TableCell>
                                            <TableCell align="center">{aItem.VatAmount}</TableCell>
                                            <TableCell align="center">{aItem.PBUnitPrice *  aItem.PBQty}</TableCell>
                                            <TableCell align="center">{aItem.ReceiveUnitPrice *  aItem.ReceiveQty}</TableCell>
                                            {/* <TableCell align="right">
                                                <IconButton>
                                                    <Icon color="error">close</Icon>
                                                </IconButton>
                                            </TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </SimpleCard>
                <br></br>
                <SimpleCard title="Return Item List">
                    <Box width="100%" overflow="auto">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">SL No.</TableCell>
                                        <TableCell align="center">Item Name</TableCell>
                                        <TableCell align="center">Rcv. Qty</TableCell>
                                        <TableCell align="center">Rcv. Unit Price</TableCell>
                                        <TableCell align="center">VAT Amt.</TableCell>
                                        <TableCell align="center">Return Qty</TableCell>
                                        <TableCell align="center">Return Amt.</TableCell>
                                        <TableCell align="center">VAT (%)</TableCell>
                                        <TableCell align="center">VAT Amt.</TableCell>
                                        <TableCell align="center">Total Amt.</TableCell>
                                        {/* <TableCell align="right">Action</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {subscribarList.map((subscriber, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="left">{index + 1}</TableCell>
                                            <TableCell align="center">{subscriber.name}</TableCell>
                                            <TableCell align="center">{subscriber.company}</TableCell>
                                            <TableCell align="center">{subscriber.date}</TableCell>
                                            <TableCell align="center">{subscriber.status}</TableCell>
                                            <TableCell align="center">${subscriber.amount}</TableCell>
                                            <TableCell align="center">${subscriber.amount}</TableCell>
                                            <TableCell align="center">${subscriber.amount}</TableCell>
                                            <TableCell align="center">${subscriber.amount}</TableCell>
                                            <TableCell align="center">${subscriber.amount}</TableCell>
                                            {/* <TableCell align="right">
                                                <IconButton>
                                                    <Icon color="error">close</Icon>
                                                </IconButton>
                                            </TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={9} align="right">Total:</TableCell>
                                        <TableCell>$ 999999999</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Box>
                </SimpleCard>
                <br></br>
                <Button color="primary" variant="contained" type="submit">
                    <Icon>send</Icon>
                    <Span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</Span>
                </Button>
            </ValidatorForm>
        </div>
    );

};

export default PurchaseBillReturnEntry;