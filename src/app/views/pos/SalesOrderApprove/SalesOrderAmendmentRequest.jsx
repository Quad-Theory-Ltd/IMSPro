

import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import axios from 'axios'
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

// import ResetTvIcon from '@mui/icons-material/ResetTv';
import {
    Button,
    Grid,
    Icon,
    Snackbar,
    Alert,
    styled,
} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { APIUrl } from 'app/views/environment';
const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

export const SalesOrderNewApprove = ({ row }) => {


    const [SalesOrderAmendmentList, setSalesOrderAmendmentList] = useState([])
    const [AmendmentRequestList, setAmendmentRequestList] = useState([])
    const [ApprovalPassword, setApprovalPassword] = useState('');
    const [open, setOpen] = useState({ IsOpen: false, IsPassword: false, IsSelect: false });


    useEffect(() => {
        console.log('AmendmentRequestList', AmendmentRequestList)
    }, [AmendmentRequestList]);



    useEffect(() => {

        GetSalesOrderAmendment();
    }, [open]);


    function GetSalesOrderAmendment() {
        axios.get(APIUrl + 'ExpApproval/GetSalesOrder?approvalType=SOAmendment&DepartmentName=Software Development&SectionId=12')
            .then(response => {
                //console.log(response)
                response.data.forEach(function (arrayItem) {

                    arrayItem.IsCheck = false;

                    var res1 = arrayItem.DocDate.substring(0, 5);
                    if (res1 === "/Date") {
                        var parsedDate1 = new Date(parseInt(arrayItem.DocDate.substr(6)));
                        var date1 = parsedDate1.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                        arrayItem.DocDate = date1;

                    }
                });
                setSalesOrderAmendmentList(response.data)
                //console.log(response.data)
            }).catch(error => {
                console.log('error')
            })
    }


    function handleClose(_, reason) {
        if (reason === "clickaway") {
            return;
        }
        setOpen({ ...open, IsOpen: false, IsPassword: false, IsSelect: false });
    }

    const SaveSalesOrderApprove = (event) => {
        axios.get(APIUrl + 'ExpApproval/CheckDuplicate?approvalType=SOAmendment&approvalPassword=' + ApprovalPassword)
            .then(response => {
                if (response.data.length > 0) {
                    setOpen({ ...open, IsPassword: true });
                    return;
                } else {
                    if (AmendmentRequestList.length === 0) {
                        setOpen({ ...open, IsSelect: true });
                        return;
                    } else {
                        AmendmentRequestList[0].ApprovalPassword = ApprovalPassword;
                        axios.post(APIUrl + 'ExpApprovalApi/UpdateApproval', AmendmentRequestList,)
                            .then(function (response) {
                                if (response.data !== '') {
                                    setOpen({ ...open, IsOpen: true });
                                    setAmendmentRequestList([])
                                    setApprovalPassword('')
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }

                }
            }).catch(error => {
                console.log('error')
            })



    };



    const handleChange = (event) => {
        event.persist();

        setApprovalPassword(event.target.value)
    }

    function handleRadioChange(row, IsCheck) {
        row.ApprovedBy = 2;
        row.IsApproved = true;
        row.IsCheck = true;
        setAmendmentRequestList([row])


    };


    return (
        <div>

            <Snackbar open={open.IsPassword} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }} variant="filled">
                    Password already used!
                </Alert>
            </Snackbar>
            <Snackbar open={open.IsOpen} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }} variant="filled">
                    Sales Order Approve Save Successfully
                </Alert>
            </Snackbar>
            <Snackbar open={open.IsSelect} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }} variant="filled">
                    Please select at least one new approval
                </Alert>
            </Snackbar>
            <ValidatorForm onSubmit={SaveSalesOrderApprove} onError={() => null}>
                <Grid container spacing={1}>
                    <Grid item lg={12} md={12} sm={12} xs={12} >
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">SL.No</TableCell>
                                        <TableCell align="center">Chk</TableCell>
                                        <TableCell align="center">Sales Order No</TableCell>
                                        <TableCell align="center">Sales Order Date</TableCell>
                                        <TableCell align="center">Factory</TableCell>
                                        <TableCell align="center">Company</TableCell>
                                        <TableCell align="center">Amount</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {SalesOrderAmendmentList.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">{index + 1}</TableCell>
                                            <TableCell align="center">
                                                <input
                                                    type="radio"
                                                    name="Amendment"
                                                    onClick={(event) => {

                                                        handleRadioChange(row, event.target.checked)
                                                    }}
                                                />

                                            </TableCell>
                                            <TableCell align="center">{row.DocNo}</TableCell>
                                            <TableCell align="center">{row.DocDate}</TableCell>
                                            <TableCell align="center">{row.FactoryName}</TableCell>
                                            <TableCell align="center">{row.Party}</TableCell>
                                            <TableCell align="center">{row.Amount}</TableCell>
                                            <TableCell align="center">
                                                <Button color="primary" size="small" variant="outlined" fullWidth>
                                                    <Icon>print</Icon>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>


                <br />
                <Grid container spacing={1}>
                    <Grid item lg={3} md={3} sm={6} xs={6}>
                        <TextField
                            type="text"
                            name="Password"
                            id="standard-basic"
                            value={ApprovalPassword || ''}
                            onChange={handleChange}
                            label="Password"
                            size='small'
                        />
                    </Grid>
                    <Grid item md={2}>
                        <Button color="primary" variant="contained" type="submit" disabled={!ApprovalPassword || AmendmentRequestList.length <= 0}>
                            <Icon>save</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</Span>
                        </Button>
                    </Grid>
                    {/* <Grid item md={2}>
                        <Button color="primary" variant="contained" type="button" onClick={handelReset}>
                            <ResetTvIcon></ResetTvIcon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Reset</Span>
                        </Button>
                    </Grid> */}


                </Grid>


            </ValidatorForm>



        </div>
    );

};

export default SalesOrderNewApprove;
