import {APIUrl} from 'app/views/environment';
import MenuItem from '@mui/material/MenuItem';
import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import axios from 'axios'
import { TextValidator } from "react-material-ui-form-validator";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import {
    Button,
    Grid,
    Icon,
    styled,
} from "@mui/material";
import Autocomplete
    //{ createFilterOptions } 
    from "@mui/material/Autocomplete";

const AutoComplete = styled(Autocomplete)(() => ({
    width: "100%",
    marginBottom: '16px',
}));
const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

// const _filterOptions = createFilterOptions();
// const filterOptions = (options, state) => {
//   const result = _filterOptions(options, state);

//   if (result.length !== 0) {
//     return _filterOptions(options, {
//       ...state,
//       getOptionLabel: (o) => o.MaterialTypeId.toString()
//     });
//   }

//   return result;
// };


const SalesOrderAddItem = ({ salesOrder, POReferencelist, SalesOrderDetailAdAttributeLst, setArrFunc }) => {
    const RollDirectionList = ["Regular", "Face In", "Face Out", "Clock Wise", "Anti Clock Wise", "As Per Approved Sample", "Sheet Format"];
    const [LabelBrandList, setLabelBrandList] = useState([])
    const [MaterialTypeList, setMaterialTypeList] = useState([])
    const [ItemSearchList, setItemSearchList] = useState([])
    const [ItemUnitlist, setItemUnitlist] = useState([])
    const [HsCodeList, setHsCodeList] = useState([])


    const [pos_SalesOrderDetailAdAttributeLst, setPos_SalesOrderDetailAdAttributeLst] = useState([])
    const [pos_SalesOrderDetail, setPos_SalesOrderDetail] = useState({ OrderUnitId: 2, RollDirection: 'Regular', MaterialTypeId: 0 });
    const {
        ItemId,
        LabelBrandId,
        MaterialTypeId,
        PcPerRoll,
        ItemName,
        ItemDescription,
        ItemDescriptionTwo,
        ItemCode,
        OrderQty,
        OrderPrice,
        VatPercentage,
        VatAmount,
        Amount,
        OrderUnitId,
        HsCodeId,
        RollDirection,
        Ups,
        SerialNumber,
    } = pos_SalesOrderDetail;

    useEffect(() => {
        //console.log('useEffect pos_SalesOrderDetail:', pos_SalesOrderDetail)
        setArrFunc(pos_SalesOrderDetailAdAttributeLst);
        setPos_SalesOrderDetailAdAttributeLst(SalesOrderDetailAdAttributeLst)
    }, [setArrFunc, SalesOrderDetailAdAttributeLst]);

    useEffect(() => {
        GetLabelBrand();
        GetAllItem();
        GetMaterialType();
        GetAllItemUnit();
        GetHsCode();
        
    }, []);


    function GetLabelBrand() {
        const criteria = "IsActive = 1";
        axios.get(APIUrl + 'LabelBrand/GetLabelBrandDynamic?searchCriteria=' + criteria)
            .then(response => {
                const LabelBrandList = response.data.filter(x => x.CompanyId === 11 && x.ItemId === 12);
                setLabelBrandList(LabelBrandList)
            }).catch(error => {
                console.log('error')
            })
    }
    function GetAllItem() {
        axios.get(APIUrl + 'Item/GetAllItem')
            .then(response => {
                setItemSearchList(response.data)
            }).catch(error => {
                console.log('error')
            })
    }
    function GetMaterialType() {
        axios.get(APIUrl + 'MaterialType/GetAllMaterialType')
            .then(response => {
                setMaterialTypeList(response.data)
            }).catch(error => {
                console.log('error')
            })
    }
    function GetAllItemUnit() {
        axios.get(APIUrl + 'Unit/GetAllUnit')
            .then(response => {
                setItemUnitlist(response.data)
            }).catch(error => {
                console.log('error')
            })
    }
    function GetHsCode() {
        axios.get(APIUrl + 'ItemHsCode/Get')
            .then(response => {
                setHsCodeList(response.data)
                //console.log(response.data)
            }).catch(error => {
                console.log('error')
            })
    }
    function GetCompanyWiseItemForSOByCompanyId(ddlItemName) {
        axios.get(APIUrl + 'Item/GetCompanyWiseItemForSO?ItemId=' + ddlItemName.ItemId + '&CompanyId=' + salesOrder.CompanyId)
            .then(response => {
                const Item = response.data[0];

                const MaterialType = MaterialTypeList.filter(x => x.MaterialTypeId === Item.MaterialTypeId)[0];
                //setPos_SalesOrderDetail(Item);
                if (MaterialType !== undefined) {
                    setPos_SalesOrderDetail({
                        ...pos_SalesOrderDetail,
                        ItemId: Item.ItemId,
                        ItemAddAttId: Item.ItemId,
                        ItemName: Item.ItemName,
                        ItemDescription: Item.ItemDescription,
                        ItemDescriptionTwo: Item.ItemDescriptionTwo,
                        ItemCode: Item.ItemCode,
                        PcPerRoll: Item.PcPerRoll,
                        OrderPrice: Item.OrderPrice,
                        HsCodeId: Item.HsCodeId,
                        MaterialTypeId: MaterialType.MaterialTypeId,
                        MaterialTypeName: MaterialType.MaterialTypeName,
                        MaterialTypeCode: MaterialType.MaterialTypeCode,
                    });
                }


            }).catch(error => {
                console.log('error')
            })
    }


    const handleddlLabelBrandChange = (event, ddlLabelBrand) => {
        if (ddlLabelBrand != null) {
            var LabelBrandId = ddlLabelBrand.LabelBrandId;
            setPos_SalesOrderDetail({ ...pos_SalesOrderDetail, LabelBrandId });
            //GetAllCompanyAddress(CompanyId)
        } else {
            LabelBrandId = null;
            setPos_SalesOrderDetail({ ...pos_SalesOrderDetail, LabelBrandId });
        }
    }
    const handleddlMaterialTypeChange = (event, ddlMaterialType) => {
        if (ddlMaterialType != null) {
            var MaterialTypeId = ddlMaterialType.MaterialTypeId;
            setPos_SalesOrderDetail({ ...pos_SalesOrderDetail, MaterialTypeId });
            //GetAllCompanyAddress(CompanyId)
        } else {
            MaterialTypeId = null;
            setPos_SalesOrderDetail({ ...pos_SalesOrderDetail, MaterialTypeId });
        }
    }

    const handleddlItemNameChange = (event, ddlItemName) => {
        if (ddlItemName != null) {
            //var ItemId = ddlItemName.ItemId;
            //const MaterialType = MaterialTypeList.filter(x => x.MaterialTypeId === ddlItemName.MaterialTypeId);
            setPos_SalesOrderDetail({
                ...pos_SalesOrderDetail,
                ItemId: ddlItemName.ItemId,
                ItemAddAttId: ddlItemName.ItemId,
                ItemName: ddlItemName.ItemName,
                ItemDescription: ddlItemName.ItemDescription,
                ItemCode: ddlItemName.ItemCode,
                PcPerRoll: ddlItemName.PcPerRoll,
                OrderPrice: ddlItemName.OrderPrice,
                HsCodeId: ddlItemName.HsCodeId,

            });

            GetCompanyWiseItemForSOByCompanyId(ddlItemName)

        } else {
            var ItemId = null;
            setPos_SalesOrderDetail({ ...pos_SalesOrderDetail, ItemId, ItemAddAttId: ItemId });
        }
    }

    const handleChange = (event) => {
        event.persist();
        setPos_SalesOrderDetail({ ...pos_SalesOrderDetail, [event.target.name]: event.target.value });
    };
    const AddSalesOrderDetail = (event) => {
        setPos_SalesOrderDetailAdAttributeLst([...pos_SalesOrderDetailAdAttributeLst, pos_SalesOrderDetail]);
        setPos_SalesOrderDetail({ OrderUnitId: 2, RollDirection: 'Regular', MaterialTypeId: 0, ItemId: null, ItemAddAttId: null })

    };

    return (
        <div>
            <Grid container spacing={1}>
                <Grid item lg={5} md={5} sm={6} xs={6}>
                    <AutoComplete
                        options={ItemSearchList}
                        getOptionLabel={(option) => option.ItemName + ' ~ ' + option.ItemDescription + " ~ Size Code: " + option.ItemCode + " ~ Sub Category: " + option.SubCategoryName}
                        isOptionEqualToValue={(option, value) => option.ItemId === value.ItemId}
                        onChange={handleddlItemNameChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}

                                label="Search for: Item Name ~ Description ~ Size Code ~ Sub Category"
                                variant="outlined"
                                fullWidth
                                value={ItemId || 0}
                            />
                        )}
                    />
                </Grid>

                <Grid item lg={2} md={2} sm={6} xs={6}>
                    <AutoComplete
                        options={LabelBrandList}
                        getOptionLabel={(option) => option.LabelBrandName}
                        isOptionEqualToValue={(option, value) => option.LabelBrandId === value.LabelBrandId}
                        onChange={handleddlLabelBrandChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}

                                label="Select Label Brand"
                                variant="outlined"
                                fullWidth
                                value={LabelBrandId || 0}
                            />
                        )}
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={6} xs={6}>
                    <AutoComplete
                        options={MaterialTypeList}
                        getOptionLabel={(option) => option.MaterialTypeName + ' ~ ' + option.MaterialTypeCode}
                        isOptionEqualToValue={(option, value) => option.MaterialTypeId === value.MaterialTypeId}
                        // filterOptions={filterOptions}
                        //defaultValue={{ MaterialTypeCode: MaterialTypeCode, MaterialTypeName: MaterialTypeName }}
                        // defaultValue={
                        //     pos_SalesOrderDetail === 0 ? null : pos_SalesOrderDetail
                        // }
                        value={pos_SalesOrderDetail.MaterialTypeId === 0 ? null : pos_SalesOrderDetail}
                        onChange={handleddlMaterialTypeChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}

                                label="Select Material Type"
                                variant="outlined"
                                fullWidth
                                value={MaterialTypeId || 0}
                            />
                        )}
                        autoSelect
                    />
                </Grid>

                <Grid item lg={2} md={2} sm={6} xs={6}>
                    <TextField
                        type="number"
                        name="PcPerRoll"
                        id="standard-basic"
                        value={PcPerRoll || ''}
                        onChange={handleChange}
                        label="Pc Per Roll"
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item lg={3} md={3} sm={6} xs={6}>
                    <TextField
                        type="text"
                        name="ItemName"
                        id="standard-basic"
                        value={ItemName || ''}
                        onChange={handleChange}
                        label="Item Name"
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={6} xs={6}>
                    <TextField
                        type="text"
                        name="ItemDescription"
                        id="standard-basic"
                        value={ItemDescription || ''}
                        onChange={handleChange}
                        label="Description One"
                        disabled
                    />
                </Grid>
                <Grid item lg={4} md={4} sm={6} xs={6}>
                    <TextField
                        type="text"
                        name="ItemDescriptionTwo"
                        id="standard-basic"
                        value={ItemDescriptionTwo || ''}
                        onChange={handleChange}
                        label="Description Two"
                    />
                </Grid>
                <Grid item lg={2} md={2} sm={6} xs={6}>
                    <TextField
                        type="text"
                        name="ItemCode"
                        id="standard-basic"
                        value={ItemCode || ''}
                        onChange={handleChange}
                        label="Size Code"
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item lg={2} md={2} sm={6} xs={6}>
                    <TextField
                        type="text"
                        name="OrderQty"
                        id="standard-basic"
                        value={OrderQty || ''}
                        onChange={handleChange}
                        label="Order Qty"
                    />
                </Grid>
                <Grid item lg={2} md={2} sm={6} xs={6}>
                    <TextField
                        type="text"
                        name="OrderPrice"
                        id="standard-basic"
                        value={OrderPrice || ''}
                        onChange={handleChange}
                        label="Order Price"
                    />
                </Grid>
                <Grid item lg={2} md={2} sm={6} xs={6}>
                    <TextField
                        type="text"
                        name="VatPercentage"
                        id="standard-basic"
                        value={VatPercentage || ""}
                        onChange={handleChange}
                        label="VatPercentage"
                    />
                </Grid>
                <Grid item lg={2} md={2} sm={6} xs={6}>
                    <TextField
                        type="text"
                        name="VatAmount"
                        id="standard-basic"
                        value={VatAmount || ""}
                        onChange={handleChange}
                        label="Vat Amount"
                    />
                </Grid>
                <Grid item lg={2} md={2} sm={6} xs={6}>
                    <TextField
                        type="text"
                        name="Amount"
                        id="standard-basic"
                        value={Amount || ""}
                        onChange={handleChange}
                        label="Amount"
                    />
                </Grid>
                <Grid item lg={2} md={2} sm={6} xs={6}>
                    <TextField
                        id="outlined-select-Unit"
                        select
                        label="Select Unit"
                        value={OrderUnitId || ''}
                        defaultValue={0}
                        onChange={(event, data) => {
                            const OrderUnitId = data.props.value;
                            setPos_SalesOrderDetail({ ...pos_SalesOrderDetail, OrderUnitId });
                        }}
                    >
                        <MenuItem disabled value="">
                            <em>Select Unit</em>
                        </MenuItem>
                        {
                            ItemUnitlist.map((ItemUnit, index) =>
                                <MenuItem key={index} value={ItemUnit.ItemUnitId}>{ItemUnit.UnitName}</MenuItem>
                            )
                        }
                    </TextField>
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item lg={3} md={3} sm={6} xs={6}>
                    <TextField
                        id="outlined-select-HsCode"
                        select
                        label="Select Hs Code"
                        value={HsCodeId || ''}
                        defaultValue={0}
                        onChange={(event, data) => {
                            const HsCodeId = data.props.value;
                            setPos_SalesOrderDetail({ ...pos_SalesOrderDetail, HsCodeId });
                        }}
                    >
                        <MenuItem disabled value="">
                            <em>Select Hs Code</em>
                        </MenuItem>
                        {
                            HsCodeList.map((HsCode, index) =>
                                <MenuItem key={index} value={HsCode.HsCodeId}>{HsCode.HsCode}</MenuItem>
                            )
                        }
                    </TextField>
                </Grid>
                <Grid item lg={3} md={3} sm={6} xs={6}>
                    <TextField
                        id="ddlRollDirection"
                        select
                        label="Select Roll Direction"
                        name='RollDirection'
                        value={RollDirection || ''}
                        defaultValue={''}
                        onChange={(event, data) => {
                            const RollDirection = data.props.value;
                            setPos_SalesOrderDetail({ ...pos_SalesOrderDetail, RollDirection });

                        }}
                    >
                        <MenuItem disabled value="">
                            <em>Select Roll Direction</em>
                        </MenuItem>
                        {
                            RollDirectionList.map((RollDirection, index) =>
                                <MenuItem key={index} value={RollDirection}>{RollDirection}</MenuItem>
                            )
                        }
                    </TextField>
                </Grid>
                <Grid item lg={3} md={3} sm={6} xs={6}>
                    <TextField
                        type="text"
                        name="Ups"
                        id="standard-basic"
                        value={Ups || ''}
                        onChange={handleChange}
                        label="Ups"
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={6} xs={6}>
                    <TextField
                        type="text"
                        name="SerialNumber"
                        id="standard-basic"
                        value={SerialNumber || ''}
                        onChange={handleChange}
                        label="Serial Number"
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item lg={10} md={10} sm={6} xs={6} mt={1} >

                </Grid>
                <Grid item lg={2} md={2} sm={6} xs={6} mt={1} >
                    <Button color="primary" variant="outlined" fullWidth onClick={AddSalesOrderDetail}>
                        <Icon>add</Icon>
                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Add</Span>
                    </Button>
                </Grid>
            </Grid>
            <br />
            <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12} >
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">SL.No</TableCell>
                                    <TableCell align="center">Name</TableCell>
                                    <TableCell align="center">Description</TableCell>
                                    <TableCell align="center">Description 2</TableCell>
                                    <TableCell align="center">Pc/Roll</TableCell>
                                    <TableCell align="center">Direction</TableCell>
                                    <TableCell align="center">Ups</TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                    <TableCell align="center">Price</TableCell>
                                    <TableCell align="center">Vat(%)</TableCell>
                                    <TableCell align="center">Amount</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pos_SalesOrderDetailAdAttributeLst.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell align="center">{row.ItemName}</TableCell>
                                        <TableCell align="center">{row.ItemDescription}</TableCell>
                                        <TableCell align="center">{row.ItemDescriptionTwo}</TableCell>
                                        <TableCell align="center">{row.PcPerRoll}</TableCell>
                                        <TableCell align="center">{row.RollDirection}</TableCell>
                                        <TableCell align="center">{row.Ups}</TableCell>
                                        <TableCell align="center">{row.OrderQty}</TableCell>
                                        <TableCell align="center">{row.OrderPrice}</TableCell>
                                        <TableCell align="center">{row.VatPercentage}</TableCell>
                                        <TableCell align="center">{row.Amount}</TableCell>
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
            <br />

        </div>
    );

};

export default SalesOrderAddItem;
