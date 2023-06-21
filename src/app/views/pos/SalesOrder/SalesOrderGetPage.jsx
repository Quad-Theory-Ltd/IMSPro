import { useEffect, useState, useContext } from "react";
import axios from 'axios'

import {
  Button,
  Grid,
  Icon,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import AppContext from 'app/contexts/AppContext';
//import { SalesOrderEntry } from "./SalesOrderEntry";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';




import { APIUrl } from 'app/views/environment';
const SalesOrderGetPage = ({ handleClick }) => {

  const [Amendment, setAmendment] = useState({ IsOpenModal: false, ApprovalId: 0 });
  const [AmendmentReasonList, setAmendmentReasonList] = useState([]);
  const { IsOpenModal, CompanyName, SalesOrderNo, AmendmentReasonId, Remarks } = Amendment;

  const [open, setOpen] = useState({ IsOpen: false });
  function handleCloseAlart(_, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen({ ...open, IsOpen: false });
  }

  const handleClickOpen = (row) => {
    setAmendment(Amendment => ({ ...Amendment, IsOpenModal: true, CompanyName: row.CompanyName, SalesOrderNo: row.SalesOrderNo, DocumentId: row.SalesOrderId }));

  };

  const handleClose = () => {
    setAmendment(Amendment => ({ ...Amendment, IsOpenModal: false }));

  };

  const [SalesOrderListPaged, setSalesOrderListPaged] = useState([]);
  const [TotalRecord, setTotalRecord] = useState(0);

  const { TempSalesOrder, setTempSalesOrder } = useContext(AppContext)
  useEffect(() => {

    // console.log('useEffect SalesOrderListPaged:', SalesOrderListPaged)
    // console.log('useEffect TotalRecord:', TotalRecord)
    // console.log('useEffect TempSalesOrder:', TempSalesOrder)
  }, [SalesOrderListPaged, TotalRecord, TempSalesOrder]);

  useEffect(() => {
    var currentPage = 0;
    var PerPage = 10;
    GetSalesOrderPage(currentPage, PerPage);
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
    GetSalesOrderPage(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    GetSalesOrderPage(page, parseInt(event.target.value, 10));
  };

  function GetSalesOrderPage(currentPage, PerPage) {
    if (currentPage == null) currentPage = 0;
    var startRecordNo = (PerPage * currentPage) + 1;

    var FullSearchCriteria = '';
    axios.get(APIUrl + 'SalesOrder/GetSalesOrderPaged?startRecordNo=' + startRecordNo + '&rowPerPage=' + PerPage + "&whereClause=" + FullSearchCriteria + '&rows=' + 0)
      .then(response => {
        response.data.ListData.forEach(function (aSd) {
          var res1 = aSd.SalesOrderDate.substring(0, 5);
          if (res1 === "/Date") {
            var parsedDate1 = new Date(parseInt(aSd.SalesOrderDate.substr(6)));
            var date1 = parsedDate1.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            aSd.SalesOrderDate = date1;

          }
          var res2 = aSd.DeliveryDate.substring(0, 5);
          if (res2 === "/Date") {
            var parsedDate2 = new Date(parseInt(aSd.DeliveryDate.substr(6)));
            var date2 = parsedDate2.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            aSd.DeliveryDate = date2;

          }
        });
        setSalesOrderListPaged(response.data.ListData)
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
    Amendment.ApprovalType = "SOAmendment";
    axios.post(APIUrl + 'ExpApprovalApi/Save', Amendment,)
      .then(function (response) {
        if (response.data !== '') {
          setOpen({ ...open, IsOpen: true });
          setAmendment(Amendment => ({ ...Amendment, IsOpenModal: false }));
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  };

  return (
    <>
      <Snackbar open={open.IsOpen} autoHideDuration={6000} onClose={handleCloseAlart}>
        <Alert onClose={handleCloseAlart} severity="success" sx={{ width: "100%" }} variant="filled">
          Save Amendment Successfully
        </Alert>
      </Snackbar>
      <Typography component={'div'} variant={'body2'}>
        <Grid container spacing={1}>
          <Grid item lg={12} md={12} sm={12} xs={12} >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">SL.No</TableCell>
                    <TableCell align="center">Order No</TableCell>
                    <TableCell align="center">Order Date</TableCell>
                    <TableCell align="center">Factory</TableCell>
                    <TableCell align="center">Company Name</TableCell>
                    <TableCell align="center">Sales Person</TableCell>
                    <TableCell align="center">Type</TableCell>
                    <TableCell align="center">Doc Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {SalesOrderListPaged.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{index + ((page) * rowsPerPage) + 1}</TableCell>
                      <TableCell align="center">{row.SalesOrderNo}</TableCell>
                      <TableCell align="center">{row.SalesOrderDate}</TableCell>
                      <TableCell align="center">{row.FactoryName}</TableCell>
                      <TableCell align="center">{row.CompanyName}</TableCell>
                      <TableCell align="center">{row.RefEmployeeName}</TableCell>
                      <TableCell align="center">{row.SalesOrderType}</TableCell>
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

        <Dialog
          open={IsOpenModal}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Amendment Request"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Typography component={'span'} variant={'body2'}>
                Sales Order No:&nbsp;
                {SalesOrderNo} ,&nbsp; &nbsp;
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
                  value={Remarks || ""}
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
            <Button onClick={handleClose} autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Typography>

    </>

  );
};

export default SalesOrderGetPage;
