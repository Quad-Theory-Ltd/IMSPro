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
import SalesOrderAddItem from './SalesOrderAddItem';
import ResetTvIcon from '@mui/icons-material/ResetTv';
import IconButton from '@mui/material/IconButton';
import Fingerprint from '@mui/icons-material/Fingerprint';
import {
  Button,
  Checkbox,
  Grid,
  Icon,
  styled,
  Autocomplete,
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

export const SalesOrderEntry = ({ row }) => {

  // const date = new Date(),
  // dateString = date.toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'});
  const SalesOrderTypeList = ["Local", "Export"];
  const [ConpanyList, setConpanyList] = useState([])
  const [CompanyBillingAddressList, setCompanyBillingAddressList] = useState([])
  const [CompanyDeliveryAddressList, setCompanyDeliveryAddressList] = useState([])
  const [employeeList, setEmployeeList] = useState([])
  const [Branchlist, setBranchlist] = useState([])
  const [CurrencyList, setCurrencyList] = useState([])
  const [prictTypeList, setPrictTypeList] = useState([])
  const [showPOPanel, setShowPOPanel] = useState(false)

  const [POReference, setPOReference] = useState({ PODate: new Date() })
  const [POReferencelist, setPOReferencelist] = useState([])
  const [pos_SaleOrderBillDetaillst, setPos_SaleOrderBillDetaillst] = useState([])
  const [pos_SalesOrderDetailAdAttributeLst, setPos_SalesOrderDetailAdAttributeLst] = useState([])
  //const [VoidList, setVoidList] = useState([])
  const { PONo, PODate, POFile } = POReference;


  const { TempSalesOrder, setTempSalesOrder } = useContext(AppContext);

  const [salesOrder, setSalesOrder] = useState({
    ConversionRate: 80,
    SalesOrderType: 'Export',
    CurrencyId: 2,
    CurrencyType: 'USD',
    PriceTypeId: 1,
    PreparedById: 0,
    AddressId: 0,
  });
  const {
    SalesOrderDate,
    DeliveryDate,
    SalesOrderNo,
    Remarks,
    CompanyId,
    SalesOrderType,
    ConversionRate,
    CurrencyId,
    PriceTypeId,
    BranchId,
    PreparedById,
    CompanyNameBilling,
    AddressBilling,
    CompanyNameDelivery,
    AddressDelivery,
    IsCPT,
    CPTCost,
  } = salesOrder;

  const [open, setOpen] = useState({ IsOpen: false });
  const { soNo } = open;
  function handleClose(_, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen({ ...open, IsOpen: false });
  }

  useEffect(() => {
    console.log('useEffect pos_SaleOrderBillDetaillst:', pos_SaleOrderBillDetaillst)
  }, [pos_SaleOrderBillDetaillst, setTempSalesOrder]);

  useEffect(() => {
    const ddlEmployee = employeeList.filter(x => x.EmployeeId === TempSalesOrder.PreparedById)[0];
    if (ddlEmployee !== undefined) {
      setSalesOrder(salesOrder => (TempSalesOrder));
      setSalesOrder(salesOrder => ({ ...salesOrder, FullName: ddlEmployee.FullName, DesignationName: ddlEmployee.DesignationName }));

      const criteria = "[SOD].[SalesOrderId]= " + TempSalesOrder.SalesOrderId + " AND [SOD].[IsVoid]= 0";
      axios.get(APIUrl + 'SalesOrder/GetSalesOrderDetailDynamic?searchCriteria=' + criteria + "&orderBy=SalesOrderId")
        .then(response => {
          //console.log(response)
          setPos_SalesOrderDetailAdAttributeLst(response.data)
          //console.log(response.data)
        }).catch(error => {
          console.log('error')
        })
      axios.get(APIUrl + 'SalesOrder/GetPOReference?DocType=SO&DocumentId=' + TempSalesOrder.SalesOrderId)
        .then(response => {
          if (response.data.length !== 0) {
            response.data.forEach(function (aSd) {
              var res1 = aSd.PODate.substring(0, 5);
              if (res1 === "/Date") {
                var parsedDate1 = new Date(parseInt(aSd.PODate.substr(6)));
                var date1 = parsedDate1.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                aSd.PODate = date1;

              }
            });
            setPOReferencelist(response.data);
            setShowPOPanel(true);
          } else {
            setShowPOPanel(false)
          }

        }).catch(error => {
          console.log('error')
        })


    }

  }, [TempSalesOrder]);

  useEffect(() => {
    GetSalerOrderNo();
    GetAllCompany();
    GetAllEmployee();
    GetAllBranch();
    GetAllCurrency();
    GetAllPriceType();

  }, [open]);


  function GetSalerOrderNo() {
    axios.get(APIUrl + 'SalesOrder/GetSalesOrderNo')
      .then(response => {
        const MaxSalesOrderNo = response.data;
        const criteria = "IsActive=1";
        axios.get(APIUrl + 'FiscalYear/GetDynamic?searchCriteria=' + criteria + "&orderBy=FiscalYearId")
          .then(response => {
            const finYearHeadOffice = response.data.filter(x => x.BranchId === 1)[0].FiscalYearName;
            const OrderNo = 'SO/' + finYearHeadOffice + '/' + MaxSalesOrderNo;
            setSalesOrder(salesOrder => ({ ...salesOrder, SalesOrderNo: OrderNo }));
          }).catch(error => {
            console.log('error')
          })
      }).catch(error => {
        console.log('error')
      })
  }
  function GetAllCompany() {
    const criteria = "C.IsActive=1";
    axios.get(APIUrl + 'Company/GetCompanyDynamic?searchCriteria=' + criteria + "&orderBy=CompanyId")
      .then(response => {
        //console.log(response)
        setConpanyList(response.data)
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
  function GetAllBranch() {
    axios.get(APIUrl + 'Branch/GetAllBranch')
      .then(response => {
        setBranchlist(response.data)
        //console.log(response.data)
      }).catch(error => {
        console.log('error')
      })
  }
  function GetAllCurrency() {
    axios.get(APIUrl + 'SalesOrder/GetAllCurrency')
      .then(response => {
        setCurrencyList(response.data)
        //console.log(response.data)
      }).catch(error => {
        console.log('error')
      })
  }
  function GetAllPriceType() {
    axios.get(APIUrl + 'PriceType/GetAllPriceType')
      .then(response => {
        setPrictTypeList(response.data)
        //console.log(response.data)
      }).catch(error => {
        console.log('error')
      })
  }
  function GetAllCompanyAddress(CompanyId) {
    axios.get(APIUrl + 'Company/GetCompanyBillDeliveryAddressByCompanyId?CompanyId=' + CompanyId)
      .then(response => {
        const AddressList = response.data;

        const CompanyBillingAddressList = AddressList.filter(x => x.AddressType === 'Billing');
        const CompanyDeliveryAddressList = AddressList.filter(x => x.AddressType === 'Delivery');
        setCompanyBillingAddressList(CompanyBillingAddressList)
        setCompanyDeliveryAddressList(CompanyDeliveryAddressList)
      }).catch(error => {
        console.log('error')
      })
  }

  const setCurrency = useCallback((SalesOrderType) => {
    SalesOrderType === 'Export' ? setSalesOrder(salesOrder => ({ ...salesOrder, ConversionRate: 80 })) : setSalesOrder(salesOrder => ({ ...salesOrder, ConversionRate: 1 }));
    SalesOrderType === 'Export' ? setSalesOrder(salesOrder => ({ ...salesOrder, CurrencyId: 2 })) : setSalesOrder(salesOrder => ({ ...salesOrder, CurrencyId: 1 }));
  }, [setSalesOrder])

  const setConversionRate = useCallback((CurrencyId) => {
    CurrencyId === 1 ? setSalesOrder(salesOrder => ({ ...salesOrder, ConversionRate: 1 })) : setSalesOrder(salesOrder => ({ ...salesOrder, ConversionRate: 80 }));

  }, [setSalesOrder])




  const SaveOrder = (event) => {
    salesOrder.pos_SaleOrderBillDetaillst = pos_SaleOrderBillDetaillst;
    axios.post(APIUrl + 'SalesOrderApi/SaveSO', salesOrder,)
      .then(function (response) {
        if (response.data !== '') {
          var SoIdsAndNo = response.data.split(",");
          setOpen({ ...open, IsOpen: true, soNo: SoIdsAndNo[1] });
          setPos_SaleOrderBillDetaillst([])
          setPOReferencelist([])
          setSalesOrder(salesOrder => ({
            ConversionRate: 80,
            SalesOrderType: 'Export',
            CurrencyId: 2,
            CurrencyType: 'USD',
            PriceTypeId: 1,
            PreparedById: 0,
            AddressId: 0,
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
    setSalesOrder({ ...salesOrder, [event.target.name]: event.target.value });
  };
  const AddPOReference = (event) => {
    const PODate = new Date(POReference.PODate);
    POReference.PODate = PODate.toDateString();
    setPOReferencelist([...POReferencelist, POReference]);
    setPOReference({ PODate: '' })
  };


  const handleSalesOrderDateChange = (event) => { setSalesOrder({ ...salesOrder, SalesOrderDate: event.target.value }); }
  const handleDeliveryDateChange = (event) => { setSalesOrder({ ...salesOrder, DeliveryDate: event.target.value }); }
  const handlePODateDateChange = (event) => { setPOReference({ ...POReference, PODate: event.target.value }); }

  const handleddlCompanyChange = (event, ddlCompany) => {
    if (ddlCompany != null) {
      var CompanyId = ddlCompany.CompanyId;
      var CompanyName = ddlCompany.CompanyName;
      setSalesOrder({ ...salesOrder, CompanyId, CompanyName });
      GetAllCompanyAddress(CompanyId)
    } else {
      CompanyId = null;
      CompanyName = '';
      setSalesOrder({ ...salesOrder, CompanyId, CompanyName });
    }
  }

  const handleddlEmployeeChange = (event, ddlPreparedBy) => {
    if (ddlPreparedBy != null) {
      var PreparedById = ddlPreparedBy.EmployeeId;
      var FullName = ddlPreparedBy.FullName;
      var DesignationName = ddlPreparedBy.DesignationName;
      setSalesOrder({ ...salesOrder, PreparedById, FullName, DesignationName });
    } else {
      PreparedById = null;
      FullName = '';
      DesignationName = '';
      setSalesOrder({ ...salesOrder, PreparedById });
    }
  }

  const handelReset = (event, data) => {
    setSalesOrder({
      ConversionRate: 80,
      SalesOrderType: 'Export',
      CurrencyId: 2,
      CurrencyType: 'USD',
      PriceTypeId: 1,
    });
  }

  const [ApprovalPassword, setApprovalPassword] = useState('');
  const LoadSalesOrder = () => {
    axios.get(APIUrl + 'SalesOrder/pos_SalesOrderAmendment_GetForEdit?approvalType=SOAmendment&approvalPassword=' + ApprovalPassword)
      .then(response => {
        const SalesOrder = response.data[0];

        var res1 = SalesOrder.SalesOrderDate.substring(0, 5);
        if (res1 === "/Date") {
          var parsedDate1 = new Date(parseInt(SalesOrder.SalesOrderDate.substr(6)));
          var date1 = parsedDate1.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          SalesOrder.SalesOrderDate = date1;

        }
        var res2 = SalesOrder.DeliveryDate.substring(0, 5);
        if (res2 === "/Date") {
          var parsedDate2 = new Date(parseInt(SalesOrder.DeliveryDate.substr(6)));
          var date2 = parsedDate2.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          SalesOrder.DeliveryDate = date2;

        }
        SalesOrder.BranchId = SalesOrder.FactoryId;
        SalesOrder.EmployeeId = SalesOrder.PreparedById;
        SalesOrder.SalesOrderDate = formatDate(SalesOrder.SalesOrderDate)
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
  return (
    <div>
      <pre>
        {JSON.stringify(salesOrder, null, 2)}
      </pre>

      <Snackbar open={open.IsOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }} variant="filled">
          Sales Order No: {soNo}, Save Successfully
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
          <Grid item lg={3} md={3} sm={6} xs={6}>
            <TextField
              id="date"
              label="Sales Order Date"
              type="date"
              value={SalesOrderDate}
              onChange={handleSalesOrderDateChange}
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
              name="SalesOrderNo"
              id="standard-basic"
              value={SalesOrderNo || ''}
              onChange={handleChange}

              label="Sales Order No"
              validators={["required"]}
              errorMessages={["This field is required"]}
              disabled
            //validators={["required", "minStringLength: 4", "maxStringLength: 9"]}
            />
          </Grid>
          <Grid item lg={3} md={3} sm={6} xs={6}>
            <TextField
              id="date"
              label="Delivery Date"
              type="date"
              value={DeliveryDate}
              onChange={handleDeliveryDateChange}
              sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
              validators={["required"]}
              errorMessages={["This field is required"]}
            />
          </Grid>
          <Grid item lg={3} md={3} sm={6} xs={6}>

            <AutoComplete
              options={ConpanyList}
              getOptionLabel={(option) => option.CompanyName || ""}
              isOptionEqualToValue={(option, value) => option.CompanyId === value.CompanyId}
              value={salesOrder.CompanyId === 0 ? null : salesOrder || ""}
              onChange={handleddlCompanyChange}
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

        </Grid>
        <Grid container spacing={1}>
          <Grid item lg={3} md={3} sm={6} xs={6}>
            <AutoComplete
              freeSolo
              options={CompanyBillingAddressList}
              getOptionLabel={(option) => option.AddressCompanyName || ""}
              isOptionEqualToValue={(option, value) => option.AddressId === value.AddressId}
              onInputChange={(event, CompanyNameBilling) => {
                setSalesOrder({ ...salesOrder, CompanyNameBilling });
              }}
              inputValue={CompanyNameBilling || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Company Name Billing"
                  variant="outlined"
                  fullWidth
                  value={CompanyNameBilling || ""}
                  validators={["required"]}
                  errorMessages={["This field is required"]}
                />
              )}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={6}>
            <AutoComplete
              freeSolo
              options={CompanyBillingAddressList}
              getOptionLabel={(option) => option.Address || ""}
              isOptionEqualToValue={(option, value) => option.AddressId === value.AddressId}
              onInputChange={(event, AddressBilling) => {
                setSalesOrder({ ...salesOrder, AddressBilling });
              }}
              inputValue={AddressBilling || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Address Billing"
                  variant="outlined"
                  fullWidth
                  value={AddressBilling || ""}
                  validators={["required"]}
                  errorMessages={["This field is required"]}
                />
              )}
            />
          </Grid>
          <Grid item lg={3} md={3} sm={6} xs={6}>
            <AutoComplete
              options={employeeList}
              getOptionLabel={(option) => option.FullName + ' ~ ' + option.DesignationName || ""}
              isOptionEqualToValue={(option, value) => option.EmployeeId === value.EmployeeId}

              onChange={handleddlEmployeeChange}
              value={salesOrder.PreparedById === 0 ? null : salesOrder}
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
        </Grid>
        <Grid container spacing={1}>
          <Grid item lg={3} md={3} sm={6} xs={6}>
            <AutoComplete
              freeSolo
              options={CompanyDeliveryAddressList}
              getOptionLabel={(option) => option.AddressCompanyName || ""}
              isOptionEqualToValue={(option, value) => option.AddressId === value.AddressId}
              onInputChange={(event, CompanyNameDelivery) => {
                setSalesOrder({ ...salesOrder, CompanyNameDelivery });
              }}
              inputValue={CompanyNameDelivery || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Company Name Delivery"
                  variant="outlined"
                  fullWidth
                  value={CompanyNameDelivery || ""}
                  validators={["required"]}
                  errorMessages={["This field is required"]}
                />
              )}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={6}>
            <AutoComplete
              freeSolo
              options={CompanyDeliveryAddressList}
              getOptionLabel={(option) => option.Address || ""}
              isOptionEqualToValue={(option, value) => option.AddressId === value.AddressId}
              onInputChange={(event, AddressDelivery) => {
                setSalesOrder({ ...salesOrder, AddressDelivery });
              }}
              inputValue={AddressDelivery || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Address Delivery"
                  variant="outlined"
                  fullWidth
                  value={AddressDelivery || ""}
                  validators={["required"]}
                  errorMessages={["This field is required"]}
                />
              )}
            />
          </Grid>
          <Grid item lg={3} md={3} sm={6} xs={6}>
            <TextField
              type="text"
              name="Remarks"
              id="standard-basic"
              multiline
              maxRows={4}
              value={Remarks || ""}
              onChange={handleChange}
              label="Remarks"
            />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item lg={3} md={3} sm={6} xs={6} >
            <TextField
              id="ddlBranch"
              select
              label="Select Branch"
              value={BranchId || ''}
              defaultValue={0}
              onChange={(event, data) => {
                const BranchId = data.props.value
                setSalesOrder({ ...salesOrder, BranchId });
              }}
              validators={["required"]}
              errorMessages={["This field is required"]}
            //helperText="Please select your currency"
            >
              <MenuItem disabled value="">
                <em>Select Branch</em>
              </MenuItem>
              {
                Branchlist.map((Branch, index) =>
                  <MenuItem key={index} value={Branch.BranchId}>{Branch.BranchName}</MenuItem>
                )
              }
            </TextField>

          </Grid>
          <Grid item lg={2} md={2} sm={6} xs={6}>
            <TextField
              id="ddlSalesOrderType"
              select
              label="Select S.O. Type"
              name='SalesOrderType'
              value={SalesOrderType || ''}
              defaultValue={''}
              onChange={(event, data) => {
                const SalesOrderType = data.props.value;
                setSalesOrder({ ...salesOrder, SalesOrderType });
                setCurrency(SalesOrderType)

              }}
              //helperText="Please select your currency"
              validators={["required"]}
              errorMessages={["This field is required"]}
            >
              <MenuItem disabled value="">
                <em>Select Sales Order Type</em>
              </MenuItem>
              {
                SalesOrderTypeList.map((SalesOrderType, index) =>
                  <MenuItem key={index} value={SalesOrderType}>{SalesOrderType}</MenuItem>
                )
              }
            </TextField>
          </Grid>
          <Grid item lg={2} md={2} sm={6} xs={6}>
            <TextField
              id="outlined-select-currency"
              select
              label="Select Currency"
              value={CurrencyId || ''}
              defaultValue={0}
              onChange={(event, data) => {
                const CurrencyId = data.props.value;
                const CurrencyType = data.props.children;
                setSalesOrder({ ...salesOrder, CurrencyId, CurrencyType });
                setConversionRate(CurrencyId)
              }}
              //helperText="Please select your currency"
              validators={["required"]}
              errorMessages={["This field is required"]}
            >
              <MenuItem disabled value="">
                <em>Select currency</em>
              </MenuItem>
              {
                CurrencyList.map((Currency, index) =>
                  <MenuItem key={index} value={Currency.CurrencyId}>{Currency.CurrencyShort}</MenuItem>
                )
              }
            </TextField>
          </Grid>
          <Grid item lg={2} md={2} sm={6} xs={6}>
            <TextField
              type="number"
              name="ConversionRate"
              id="standard-basic"
              value={ConversionRate || ""}
              onChange={handleChange}

              label="Conversion Rate"
              validators={["required"]}
              errorMessages={["This field is required"]}
            //validators={["required", "minStringLength: 4", "maxStringLength: 9"]}
            />
          </Grid>
          <Grid item lg={3} md={3} sm={6} xs={6}>
            <TextField
              id="outlined-select-PriceType"
              select
              label="Select Price Type"
              value={PriceTypeId || ''}
              defaultValue={0}
              onChange={(event, data) => {
                const PriceTypeId = data.props.value;
                setSalesOrder({ ...salesOrder, PriceTypeId });
              }}
              //helperText="Please select your currency"
              validators={["required"]}
              errorMessages={["This field is required"]}
            >
              <MenuItem disabled value="">
                <em>Select Price Type</em>
              </MenuItem>
              {
                prictTypeList.map((prictType, index) =>
                  <MenuItem key={index} value={prictType.PriceTypeId}>{prictType.PriceTypeName}</MenuItem>
                )
              }
            </TextField>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item lg={2} md={2} sm={6} xs={6} >
            <Checkbox
              value={showPOPanel}
              checked={showPOPanel}
              onChange={(event, data) => {
                setShowPOPanel(data)
              }}
              color="success" /> Show P.O Panel
          </Grid>
          {showPOPanel ?
            <>
              <Grid item lg={3} md={3} sm={6} xs={6} >
                <TextField
                  type="text"
                  name="PONo"
                  id="standard-basic"
                  //multiline
                  //maxRows={4}
                  value={PONo || ""}
                  onChange={(event) => {
                    const PONo = event.target.value
                    setPOReference({ ...POReference, PONo });
                  }}
                  label="PO No"
                />
              </Grid>
              <Grid item lg={3} md={3} sm={6} xs={6}>
                <TextField
                  id="date"
                  label="PO Date"
                  type="date"
                  value={PODate}
                  onChange={handlePODateDateChange}
                  sx={{ width: 220 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={PODate}
                    onChange={handlePODateDateChange}
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        id="mui-pickers-date1"
                        label="PO Date"
                        type="text"
                        sx={{ mb: 2, width: "100%" }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />
                </LocalizationProvider> */}
              </Grid>
              <Grid item lg={3} md={3} sm={6} xs={6} >
                <TextField
                  type="file"
                  name="POFile"
                  id="standard-basic"
                  //multiline
                  //maxRows={4}
                  value={POFile || ""}
                  onChange={(event) => {
                    const POFile = event.target.value
                    setPOReference({ ...POReference, POFile })

                  }}
                  label="PO File"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item lg={1} md={1} sm={6} xs={6} mt={1} >
                <Button
                  onClick={AddPOReference}
                  size="large"
                  variant="outlined"
                >Add</Button>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12} >
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">S/N</TableCell>
                        <TableCell align="center">PO No</TableCell>
                        <TableCell align="center">PO Date</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {POReferencelist.map((row, index) => (
                        <TableRow
                          key={index}
                        //sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">{row.PONo}</TableCell>
                          <TableCell align="center">{row.PODate}</TableCell>
                          <TableCell align="center"><Button size="small" variant="outlined">Remove</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </>
            : null
          }
        </Grid>
        <br></br>
        <Grid container spacing={1}>
          <Grid item lg={3} md={3} sm={6} xs={6} >
            <Checkbox
              value={IsCPT}
              onChange={(event, IsCPT) => {
                setSalesOrder({ ...salesOrder, IsCPT })
              }}
              color="secondary" /> Carriage Paid To (CPT)
          </Grid>
          {IsCPT ?
            <>
              <Grid item lg={3} md={3} sm={6} xs={6} >
                <TextField
                  type="number"
                  name="CPTCost"
                  id="standard-basic"
                  //multiline
                  //maxRows={4}
                  value={CPTCost || ""}
                  onChange={(event) => {
                    const CPTCost = event.target.value
                    setSalesOrder({ ...salesOrder, CPTCost });
                  }}
                  label="CPT Cost"
                />
              </Grid>
            </>
            : null
          }
        </Grid>

        <SimpleCard title="Sales Order Add Item">
          <SalesOrderAddItem salesOrder={salesOrder} POReferencelist={POReferencelist} SalesOrderDetailAdAttributeLst={pos_SalesOrderDetailAdAttributeLst} setArrFunc={setPos_SaleOrderBillDetaillst}
            height="350px"

          />
        </SimpleCard>
        <br />
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


      </ValidatorForm>

    </div>
  );

};

export default SalesOrderEntry;
