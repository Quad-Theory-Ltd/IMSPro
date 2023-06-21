// import { DatePicker } from '@mui/x-date-pickers/DatePicker'
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import MenuItem from '@mui/material/MenuItem';
import { Span } from "app/components/Typography";
import { useEffect, useCallback, useState, useContext } from "react";
import axios from 'axios'
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import SimpleCard from 'app/components/SimpleCard';

import ResetTvIcon from '@mui/icons-material/ResetTv';
import IconButton from '@mui/material/IconButton';
import Fingerprint from '@mui/icons-material/Fingerprint';



import TablePagination from '@mui/material/TablePagination';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



import {
    Button,
    Checkbox,
    Grid,
    Icon,
    styled,
    Autocomplete,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import AppContext from 'app/contexts/AppContext';
import { APIUrl } from 'app/views/environment';

const AutoComplete = styled(Autocomplete)(() => ({
    width: "100%",
    marginBottom: '16px',
}));
const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

export const InternalWorkOrderEntry = ({ row }) => {

    const [CompanyList, setCompanyList] = useState([])
    const [iwoListForGrid, setIwoListForGrid] = useState([])
    const [iwolist, setIwolist] = useState([])
    const [employeeList, setEmployeeList] = useState([])
    const [Storelist, setStorelist] = useState([])
    const [inv_InternalOrderDetailListItem, setInv_InternalOrderDetailListItem] = useState([])




    const { TempSalesOrder, setTempSalesOrder } = useContext(AppContext);

    const [internalWorkOrder, setInternalWorkOrder] = useState({
        PreparedById: 0,
    });
    const {
        InternalWorkOrderDate,
        InternalWorkOrderNo,
        PlaceOfDelivery,
        Remarks,
        CompanyId,
        SalesOrderId,
        DepartmentId,
        PreparedById,
    } = internalWorkOrder;

    const [open, setOpen] = useState({ IsOpen: false });
    const { iwoNo } = open;
    function handleClose(_, reason) {
        if (reason === "clickaway") {
            return;
        }
        setOpen({ ...open, IsOpen: false });
    }

    useEffect(() => {
        console.log('useEffect inv_InternalOrderDetailListItem:', inv_InternalOrderDetailListItem)
    }, [inv_InternalOrderDetailListItem, setTempSalesOrder]);

    useEffect(() => {
        const ddlEmployee = employeeList.filter(x => x.EmployeeId === TempSalesOrder.PreparedById)[0];
        if (ddlEmployee !== undefined) {
            setInternalWorkOrder(internalWorkOrder => (TempSalesOrder));
            setInternalWorkOrder(internalWorkOrder => ({ ...internalWorkOrder, FullName: ddlEmployee.FullName, DesignationName: ddlEmployee.DesignationName }));

            const criteria = "[SOD].[SalesOrderId]= " + TempSalesOrder.SalesOrderId + " AND [SOD].[IsVoid]= 0";
            axios.get(APIUrl + 'SalesOrder/GetSalesOrderDetailDynamic?searchCriteria=' + criteria + "&orderBy=SalesOrderId")
                .then(response => {
                    //console.log(response)
                    setInv_InternalOrderDetailListItem(response.data)
                    //console.log(response.data)
                }).catch(error => {
                    console.log('error')
                })


        }

    }, [TempSalesOrder]);

    useEffect(() => {
        GetAllCompany();
        GetTopSalesOrderDetailData();
        GetAllEmployee();
        departmentGetByBranchAndDeptTypeId();


    }, [open]);


    function GetAllCompany() {
        const criteria = "C.IsActive=1";
        axios.get(APIUrl + 'Company/GetCompanyDynamic?searchCriteria=' + criteria + "&orderBy=CompanyId")
            .then(response => {
                //console.log(response)
                setCompanyList(response.data)
                //console.log(response.data)
            }).catch(error => {
                console.log('error')
            })
    }

    function GetTopSalesOrderDetailData() {
        const criteria = "A.IsApproved = 1 AND (SELECT COUNT(ItemAddAttId) FROM pos_SalesOrderDetail WHERE SalesOrderId = SO.SalesOrderId) > (SELECT COUNT(FinishedItemId) FROM inv_InternalWorkOrderDetail IWOD INNER JOIN inv_InternalWorkOrder IWO ON IWOD.InternalWorkOrderId = IWO.InternalWorkOrderId WHERE IWO.SalesOrderId = SO.SalesOrderId)";
        axios.get(APIUrl + 'SalesOrder/GetSalesOrderDynamic?searchCriteria=' + criteria + "&orderBy=SalesOrderDate")
            .then(response => {
                //console.log(response)
                setIwoListForGrid(response.data)
                //console.log(response.data)
            }).catch(error => {
                console.log('error')
            })
    }

    function GetAllEmployee() {
        axios.get(APIUrl + 'Employee/GetAllEmployee')
            .then(response => {
                setEmployeeList(response.data)
                //console.log(response.data)
            }).catch(error => {
                console.log('error')
            })
    }

    function departmentGetByBranchAndDeptTypeId() {
        axios.get(APIUrl + 'User/GetUserDepartmentByUserId?userId=' + 2)
            .then(response => {
                setStorelist(response.data)
                //console.log(response.data)
            }).catch(error => {
                console.log('error')
            })
    }


    const SaveOrder = (event) => {
        internalWorkOrder.inv_InternalWorkOrderDetailList = inv_InternalOrderDetailListItem;
        axios.post(APIUrl + 'InternalWorkOrderApi/SaveIWO', internalWorkOrder,)
            .then(function (response) {
                if (response.data !== '') {
                    var SoIdsAndNo = response.data.split(",");
                    setOpen({ ...open, IsOpen: true, iwoNo: SoIdsAndNo[1] });
                    setInv_InternalOrderDetailListItem([])
                    setInternalWorkOrder(internalWorkOrder => ({
                        PreparedById: 0,
                    }));
                }
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

    };

    const handleChange = (event) => {
        event.persist();
        setInternalWorkOrder({ ...internalWorkOrder, [event.target.name]: event.target.value });
    };



    const handleInternalWorkOrderDateChange = (event) => { setInternalWorkOrder({ ...internalWorkOrder, InternalWorkOrderDate: event.target.value }); }

    const getWorkOrderDetails = (event, ddlSalesOrder) => {
        var SalesOrderId = ddlSalesOrder.SalesOrderId;
        var SalesOrderNo = ddlSalesOrder.SalesOrderNo;
        var PlaceOfDelivery = ddlSalesOrder.De;
        setInternalWorkOrder({ ...internalWorkOrder, SalesOrderId, SalesOrderNo, PlaceOfDelivery });
        axios.get(APIUrl + 'InternalWorkOrder/InternalWorkOrderGetMaxNoBySalesOrderId?SalesOrderId=' + SalesOrderId)
            .then(response => {
                setInternalWorkOrder(internalWorkOrder => ({ ...internalWorkOrder, InternalWorkOrderNo: response.data[0].InternalWorkOrderNo }));
            }).catch(error => {
                console.log('error')
            })


        axios.get(APIUrl + 'SalesOrder/GetItemForIWO?salesOrderId=' + SalesOrderId)
            .then(response => {
                if (response.data == 0) {
                    setInternalWorkOrder(internalWorkOrder => ({ ...internalWorkOrder, PlaceOfDelivery: "N/A" }));
                } else {
                    setInternalWorkOrder(internalWorkOrder => ({ ...internalWorkOrder, PlaceOfDelivery: response.data[0].AddressDelivery }));
                }
                setInv_InternalOrderDetailListItem(response.data)
            }).catch(error => {
                console.log('error')
            })



    }

    const CompanyLoadForGridIwo = (event, ddlCompany) => {
        var CompanyId = ddlCompany.CompanyId;
        var CompanyName = ddlCompany.CompanyName;
        setInternalWorkOrder({ ...internalWorkOrder, CompanyId, CompanyName });
        iwoListForGrid.forEach(function (aIWO) {
            if (ddlCompany.CompanyId === aIWO.CompanyId) {
                //setIwolist([...iwolist, aIWO]);
                iwolist.push(aIWO)
            }
        });
    }




    const handleddlEmployeeChange = (event, ddlPreparedBy) => {
        if (ddlPreparedBy != null) {
            var PreparedById = ddlPreparedBy.EmployeeId;
            var FullName = ddlPreparedBy.FullName;
            var DesignationName = ddlPreparedBy.DesignationName;
            setInternalWorkOrder({ ...internalWorkOrder, PreparedById, FullName, DesignationName });
        } else {
            PreparedById = null;
            FullName = '';
            DesignationName = '';
            setInternalWorkOrder({ ...internalWorkOrder, PreparedById });
        }
    }

    const handelReset = (event, data) => {
        setInternalWorkOrder({
            PreparedById: 0,
        });
    }

    const [ApprovalPassword, setApprovalPassword] = useState('');
    const LoadSalesOrder = () => {
        axios.get(APIUrl + 'SalesOrder/pos_SalesOrderAmendment_GetForEdit?approvalType=SOAmendment&approvalPassword=' + ApprovalPassword)
            .then(response => {
                const SalesOrder = response.data[0];

                var res1 = SalesOrder.InternalWorkOrderDate.substring(0, 5);
                if (res1 === "/Date") {
                    var parsedDate1 = new Date(parseInt(SalesOrder.InternalWorkOrderDate.substr(6)));
                    var date1 = parsedDate1.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                    SalesOrder.InternalWorkOrderDate = date1;

                }
                SalesOrder.BranchId = SalesOrder.FactoryId;
                SalesOrder.EmployeeId = SalesOrder.PreparedById;
                SalesOrder.InternalWorkOrderDate = formatDate(SalesOrder.InternalWorkOrderDate)
                SalesOrder.DeliveryDate = formatDate(SalesOrder.DeliveryDate)
                setTempSalesOrder(SalesOrder)
                //console.log(response.data)
            }).catch(error => {
                console.log('error')
            })
    }
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [year, month, day].join('-');
    }


    const [Amendment, setAmendment] = useState({ IsOpenModal: false, ApprovalId: 0 });
    const [AmendmentReasonList, setAmendmentReasonList] = useState([]);
    const { IsOpenModal,AmendmentRemarks, CompanyName, IWONo, AmendmentReasonId } = Amendment;

    const [openForAmendment, setOpenForAmendment] = useState({ IsOpen: false });
    function handleCloseAlart(_, reason) {
        if (reason === "clickaway") {
            return;
        }
        setOpen({ ...open, IsOpen: false });
    }

    const handleClickOpen = (row) => {
        setAmendment(Amendment => ({ ...Amendment, IsOpenModal: true, CompanyName: row.CompanyName, IWONo: row.InternalWorkOrderNo, DocumentId: row.InternalWorkOrderId }));

    };

    const handleCloseForAmendment = () => {
        setAmendment(Amendment => ({ ...Amendment, IsOpenModal: false }));

    };

    const [IwoListPaged, setIwoListPaged] = useState([]);
    const [TotalRecord, setTotalRecord] = useState(0);


    useEffect(() => {
        var currentPage = 0;
        var PerPage = 10;
        GetPagedIwo(currentPage, PerPage);
        GetAmendmentReason();
    }, [open]);

    function GetAmendmentReason() {

        axios.get(APIUrl + 'ExpAmendmentReason/GetAllAmendmentReason')
            .then(response => {
                setAmendmentReasonList(response.data)
            }).catch(error => {
                console.log('error')
            })
    }

    const [page, setPage] = useState(0); //currentPage
    const [rowsPerPage, setRowsPerPage] = useState(10); // PerPage

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        GetPagedIwo(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        GetPagedIwo(page, parseInt(event.target.value, 10));
    };

    function GetPagedIwo(currentPage, PerPage) {
        if (currentPage == null) currentPage = 0;
        var startRecordNo = (PerPage * currentPage) + 1;

        var FullSearchCriteria = '';
        axios.get(APIUrl + 'InternalWorkOrder/GetPagedIWO?startRecordNo=' + startRecordNo + '&rowPerPage=' + PerPage + "&whereClause=" + FullSearchCriteria + '&rows=' + 0)
            .then(response => {
                response.data.ListData.forEach(function (aSd) {
                    var res1 = aSd.InternalWorkOrderDate.substring(0, 5);
                    if (res1 === "/Date") {
                        var parsedDate1 = new Date(parseInt(aSd.InternalWorkOrderDate.substr(6)));
                        var date1 = parsedDate1.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                        aSd.InternalWorkOrderDate = date1;

                    }
                });
                setIwoListPaged(response.data.ListData)
                setTotalRecord(response.data.TotalRecord);

            }).catch(error => {
                console.log('error')
            })
    }

    // const SalesOrderSearch = () => {
    //GetSalesOrderPaged()
    // }
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [year, month, day].join('-');
    }

    function GetSalesOrder(row) {
        row.BranchId = row.FactoryId;
        row.EmployeeId = row.PreparedById;

        row.SalesOrderDate = formatDate(row.SalesOrderDate)
        row.DeliveryDate = formatDate(row.DeliveryDate)
        setTempSalesOrder(row)
    }


    const SaveAmendment = (event) => {
        Amendment.ApprovalType = "IWOAmendment";
        axios.post(APIUrl + 'ExpApprovalApi/Save', Amendment,)
            .then(function (response) {
                if (response.data !== '') {
                    setOpenForAmendment({ ...open, IsOpen: true });
                    setAmendment(Amendment => ({ ...Amendment, IsOpenModal: false }));
                }
            })
            .catch(function (error) {
                console.log(error);
            });


    }

    return (
        <div>
            <pre>
                {JSON.stringify(internalWorkOrder, null, 2)}
            </pre>

            <Snackbar open={open.IsOpen} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }} variant="filled">
                    Internal Work Order No: {iwoNo}, Save Successfully
                </Alert>
            </Snackbar>

            <ValidatorForm onSubmit={SaveOrder} onError={() => null}>
                <Grid container spacing={1}>
                    <Grid item lg={3} md={3} sm={6} xs={6}>
                        <TextField
                            type="passpord"
                            name="ApprovalPassword"
                            id="standard-basic"
                            value={ApprovalPassword || ''}
                            onChange={(event) => {
                                setApprovalPassword(event.target.value)
                            }}

                            label="Approval Password"
                        />
                    </Grid>
                    <Grid item md={2}>
                        {/* <Button color="primary" variant="contained" type="button" onClick={LoadSalesOrder}>
              <Icon>edit</Icon>
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Load</Span>
            </Button> */}
                        <IconButton aria-label="fingerprint" color="success" onClick={LoadSalesOrder}>
                            <Fingerprint />
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Load</Span>
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <AutoComplete
                            options={CompanyList}
                            getOptionLabel={(option) => option.CompanyName || ""}
                            isOptionEqualToValue={(option, value) => option.CompanyId === value.CompanyId}
                            onChange={CompanyLoadForGridIwo}
                            value={internalWorkOrder.CompanyId === 0 ? null : internalWorkOrder}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Company Name"
                                    variant="outlined"
                                    fullWidth
                                    value={CompanyId || 0}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                            )}
                            autoSelect
                        />

                    </Grid>

                    <Grid item lg={6} md={6} sm={12} xs={12}>

                        <AutoComplete
                            options={iwolist}
                            getOptionLabel={(option) => option.SalesOrderNo || ""}
                            isOptionEqualToValue={(option, value) => option.SalesOrderId === value.SalesOrderId}
                            value={internalWorkOrder.SalesOrderId === 0 ? null : internalWorkOrder || ""}
                            onChange={getWorkOrderDetails}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Sales Order No"
                                    variant="outlined"
                                    fullWidth
                                    value={SalesOrderId || 0}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                            )}
                            autoSelect
                        />
                    </Grid>

                </Grid>
                <Grid container spacing={1}>
                    <Grid item lg={3} md={3} sm={6} xs={6}>
                        <TextField
                            id="date"
                            label="Internal Work Order Date"
                            type="date"
                            value={InternalWorkOrderDate}
                            onChange={handleInternalWorkOrderDateChange}
                            sx={{ width: 220 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            validators={["required"]}
                            errorMessages={["This field is required"]}
                        />
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={6}>
                        <TextField
                            type="text"
                            name="InternalWorkOrderNo"
                            id="standard-basic"
                            value={InternalWorkOrderNo || ''}
                            onChange={handleChange}

                            label="Internal Work Order No"
                            validators={["required"]}
                            errorMessages={["This field is required"]}
                            disabled
                        //validators={["required", "minStringLength: 4", "maxStringLength: 9"]}
                        />
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={6}>
                        <AutoComplete
                            options={employeeList}
                            getOptionLabel={(option) => option.FullName + ' ~ ' + option.DesignationName || ""}
                            isOptionEqualToValue={(option, value) => option.EmployeeId === value.EmployeeId}

                            onChange={handleddlEmployeeChange}
                            value={internalWorkOrder.PreparedById === 0 ? null : internalWorkOrder}
                            renderInput={(params) => (
                                <TextField
                                    {...params}

                                    label="Employee Name"
                                    variant="outlined"
                                    fullWidth
                                    value={PreparedById || 0}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                            )}
                            autoSelect
                        />
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={6} >
                        <TextField
                            id="ddlStore"
                            select
                            label="Select Department For IWO"
                            value={DepartmentId || ''}
                            defaultValue={0}
                            onChange={(event, data) => {
                                const DepartmentId = data.props.value
                                setInternalWorkOrder({ ...internalWorkOrder, DepartmentId });
                            }}
                            validators={["required"]}
                            errorMessages={["This field is required"]}
                        //helperText="Please select your currency"
                        >
                            <MenuItem disabled value="">
                                <em>Select Department For IWO</em>
                            </MenuItem>
                            {
                                Storelist.map((Store, index) =>
                                    <MenuItem key={index} value={Store.DepartmentId}>{Store.DepartmentName}</MenuItem>
                                )
                            }
                        </TextField>

                    </Grid>
                </Grid>

                <Grid container spacing={1}>

                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextField
                            type="text"
                            name="PlaceOfDelivery"
                            id="standard-basic"
                            multiline
                            maxRows={4}
                            value={PlaceOfDelivery || ""}
                            onChange={handleChange}
                            label="Place Of Delivery"
                            disabled
                        />
                    </Grid>

                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextField
                            type="text"
                            name="Remarks"
                            id="standard-basic"
                            multiline
                            maxRows={4}
                            value={Remarks || ""}
                            onChange={handleChange}
                            label="Special Instruction"
                        />
                    </Grid>

                </Grid>
                <Grid container spacing={1}>
                    <Grid item lg={12} md={12} sm={12} xs={12} >
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">SL.No</TableCell>
                                        <TableCell align="center">Product Type</TableCell>
                                        <TableCell align="center">Name</TableCell>
                                        <TableCell align="center">Paper Type</TableCell>
                                        <TableCell align="center">Unit</TableCell>
                                        <TableCell align="center">Order Qty</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {inv_InternalOrderDetailListItem.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">{index + 1}</TableCell>
                                            <TableCell align="center">{row.CategoryName}</TableCell>
                                            <TableCell align="center">{row.ItemName}</TableCell>
                                            <TableCell align="center">{row.PaperTypeName}</TableCell>
                                            <TableCell align="center">{row.UnitName}</TableCell>
                                            <TableCell align="center">{row.OrderQty}</TableCell>
                                            <TableCell align="center">
                                                <Button color="primary" size="small" variant="outlined" fullWidth>
                                                    <Icon>delete</Icon>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
                <br></br>
                <Grid container spacing={1}>
                    <Grid item md={2}>
                        <Button color="primary" variant="contained" type="submit">
                            <Icon>save</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</Span>
                        </Button>
                    </Grid>
                    <Grid item md={2}>
                        <Button color="error" variant="outlined" type="button" onClick={handelReset}>
                            <ResetTvIcon></ResetTvIcon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Reset</Span>
                        </Button>
                    </Grid>


                </Grid>

                <Dialog
                    open={IsOpenModal}
                    onClose={handleCloseForAmendment}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Amendment Request"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Typography component={'span'} variant={'body2'}>
                                Internal Work Order No:&nbsp;
                                {IWONo} ,&nbsp; &nbsp;
                                Company Name:&nbsp;
                                {CompanyName}
                            </Typography>
                            <br></br>
                            <br></br>


                        </DialogContentText>
                        <Grid container spacing={1}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    id="outlined-select-AmendmentReason"
                                    select
                                    label="Select Amendment Reason"
                                    value={AmendmentReasonId || ''}
                                    defaultValue={0}
                                    onChange={(event, data) => {
                                        const AmendmentReasonId = data.props.value;
                                        setAmendment({ ...Amendment, AmendmentReasonId });
                                    }}
                                    fullWidth
                                >
                                    <MenuItem disabled value="">
                                        <em>Select Amendment Reason</em>
                                    </MenuItem>
                                    {
                                        AmendmentReasonList.map((AmendmentReason, index) =>
                                            <MenuItem key={index} value={AmendmentReason.AmendmentReasonId}>{AmendmentReason.AmendmentReasonName}</MenuItem>
                                        )
                                    }
                                </TextField>
                            </Grid>
                        </Grid>
                        <br></br>
                        <Grid container spacing={1}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    type="text"
                                    name="Remarks"
                                    id="standard-basic"
                                    multiline
                                    maxRows={4}
                                    value={AmendmentRemarks || ""}
                                    onChange={(event) => {
                                        setAmendment({ ...Amendment, [event.target.name]: event.target.value });
                                    }}
                                    label="Remarks"
                                    fullWidth

                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={SaveAmendment}>Request</Button>
                        <Button onClick={handleCloseForAmendment} autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </ValidatorForm>
            <Snackbar open={openForAmendment.IsOpen} autoHideDuration={6000} onClose={handleCloseAlart}>
                <Alert onClose={handleCloseAlart} severity="success" sx={{ width: "100%" }} variant="filled">
                    Save Amendment Successfully
                </Alert>
            </Snackbar>
            <br></br>
            <Typography component={'div'} variant={'body2'}>
                <Grid container spacing={1}>
                    <Grid item lg={12} md={12} sm={12} xs={12} >
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">SL.No</TableCell>
                                        <TableCell align="center">IWO No</TableCell>
                                        <TableCell align="center">IWO Date</TableCell>
                                        <TableCell align="center">Factory</TableCell>
                                        <TableCell align="center">Company Name</TableCell>
                                        <TableCell align="center">Prepared By</TableCell>
                                        <TableCell align="center">Doc Status</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {IwoListPaged.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">{index + ((page) * rowsPerPage) + 1}</TableCell>
                                            <TableCell align="center">{row.InternalWorkOrderNo}</TableCell>
                                            <TableCell align="center">{row.InternalWorkOrderDate}</TableCell>
                                            <TableCell align="center">{row.FactoryName}</TableCell>
                                            <TableCell align="center">{row.CompanyNameOnBill}</TableCell>
                                            <TableCell align="center">{row.PreparedByName}</TableCell>
                                            <TableCell align="center">{row.DocStatus}</TableCell>
                                            <TableCell align="center">
                                                {row.DocStatusId === 1 ?
                                                    <Button color="primary" size="small" variant="outlined"
                                                        onClick={() => {
                                                            GetSalesOrder(row)
                                                        }}
                                                        fullWidth>
                                                        <Icon>edit</Icon>
                                                    </Button>
                                                    : null}
                                                {row.IsCancelled ?
                                                    <Button color="primary" size="small" variant="outlined"
                                                        onClick={() => {

                                                        }}
                                                        fullWidth>
                                                        Cancelled
                                                    </Button>
                                                    : null}

                                                {row.DocStatusId === 2 || row.DocStatusId === 4 ?
                                                    <Button color="primary" size="small" variant="outlined"
                                                        onClick={() => {
                                                            handleClickOpen(row)
                                                        }}
                                                        fullWidth>
                                                        Request for Amendment
                                                    </Button>
                                                    : null}
                                                <Button color="primary" size="small" variant="outlined"
                                                    onClick={() => {

                                                    }}
                                                    fullWidth>
                                                    <Icon>print</Icon>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={TotalRecord}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    </Grid>
                </Grid>


            </Typography>

        </div>
    );

};

export default InternalWorkOrderEntry;
