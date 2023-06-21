

import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import axios from 'axios'
import { ValidatorForm } from "react-material-ui-form-validator";

import ResetTvIcon from '@mui/icons-material/ResetTv';
import {
    Button,
    Grid,
    Icon,
    Snackbar,
    Alert,
    Checkbox
} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



import { APIUrl } from 'app/views/environment';


export const SalesOrderNewApprove = ({ row }) => {


    const [SalesApproveList, setSalesApproveList] = useState([])
    const [SalesOrderApproveList, setSalesOrderApproveList] = useState([])
    const [open, setOpen] = useState({ IsOpen: false });

    useEffect(() => {
        console.log('SalesOrderApproveList', SalesOrderApproveList)
    }, [SalesOrderApproveList]);



    useEffect(() => {

        GetAllSalesOrderAmendmentApprove();
    }, [open]);


    function GetAllSalesOrderAmendmentApprove() {
        axios.get(APIUrl + 'ExpApproval/GetSalesOrder?approvalType=SoNew&DepartmentName=Software Development&SectionId=12')
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
                setSalesApproveList(response.data)
                //console.log(response.data)
            }).catch(error => {
                console.log('error')
            })
    }







    function handleClose(_, reason) {
        if (reason === "clickaway") {
            return;
        }
        setOpen({ ...open, IsOpen: false });
    }

    const SaveSalesOrderApprove = (event) => {
        axios.post(APIUrl + 'ExpApprovalApi/UpdateApproval', SalesOrderApproveList,)
            .then(function (response) {
                if (response.data !== '') {
                    setOpen({ ...open, IsOpen: true });
                    //setPos_SaleOrderBillDetaillst([])
                }
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

    };



    function handleCheckboxChange(row, IsCheck) {
        if (IsCheck === true) {
            row.ApprovedBy = 2;
            row.IsApproved = true;
            row.IsCheck = true;
            setSalesOrderApproveList([...SalesOrderApproveList, row])
        } else {
            row.IsCheck = false;
            setSalesOrderApproveList(current =>
                current.filter(obj => {
                    return obj.DocumentId !== row.DocumentId;
                })
            );
        }

    };
    const handelReset = () => {
        SalesApproveList.forEach(function (arrayItem) {
            arrayItem.IsCheck = false;
        });
        setSalesOrderApproveList([]);
    }



    return (
        <div>

            <Snackbar open={open.IsOpen} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }} variant="filled">
                    Sales Order Approve Save Successfully
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
                                        <TableCell align="center">Invoice No.</TableCell>
                                        <TableCell align="center">Invoice Date</TableCell>
                                        <TableCell align="center">Factory</TableCell>
                                        <TableCell align="center">Company</TableCell>
                                        <TableCell align="center">Amount</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {SalesApproveList.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">{index + 1}</TableCell>
                                            <TableCell align="center">
                                                <Checkbox
                                                    checked={row.IsCheck}
                                                    //onChange={handleCheckboxChange(row)}
                                                    onClick={(event) => {

                                                        handleCheckboxChange(row, event.target.checked)
                                                        // setSalesApproveList(current =>
                                                        //     current.map(obj => {
                                                        //         if (obj.DocumentId === row.DocumentId) {
                                                        //             return { ...obj, IsCheck: event.target.checked };
                                                        //         }

                                                        //         return obj;
                                                        //     }),
                                                        // );
                                                        // setSalesOrderApproveList(SalesApproveList);
                                                        // setSalesOrderApproveList(current =>
                                                        //     current.filter(obj => {
                                                        //         return obj.IsCheck === true;
                                                        //     }),
                                                        // );
                                                    }}
                                                    color="secondary" />
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
                    <Grid item md={2}>
                        <Button color="primary" variant="contained" type="submit">
                            <Icon>save</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</Span>
                        </Button>
                    </Grid>
                    <Grid item md={2}>
                        <Button color="primary" variant="contained" type="button" onClick={handelReset}>
                            <ResetTvIcon></ResetTvIcon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Reset</Span>
                        </Button>
                    </Grid>


                </Grid>


            </ValidatorForm>



        </div>
    );

};

export default SalesOrderNewApprove;
