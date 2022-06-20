import { Typography, AppBar, Toolbar, TextField, Button } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import MyDialog from 'util/LogiUtil/MyDialog';
import CustomerDialog from '../Presentational/CustomerDialog';
import ItemDialog from '../Presentational/ItemDialog';
import AmountDialog from '../Presentational/AmountDialog';
import EstimateDetail from '../Presentational/EstimateDetail';
import Estimate from '../Presentational/Estimate';
import moment from 'moment';
import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { getDatePicker } from 'util/LogiUtil/DatePicker';
import * as api from 'erp/logistic/sales/api';
import useAsync from 'util/useAsync';

const EstimateRegister = () => {
    const today = moment().format('YYYY-MM-DD');
    const [gridApiEstimate, setGridApiEstimate] = useState(null);
    const [gridApiEstimateDetail, setGridApiEstimateDetail] = useState();
    const [gridColumnApiEstimate, setGridColumnApiEstimate] = useState(null);
    const [gridColumnApiEstimateDetail, setGridColumnApiEstimateDetail] = useState(null);
    const [targetDate, setTargetDate] = useState(today);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [rowDataEstimate, setRowDataEstimate] = useState([]);
    const [rowDataEstimateDetail, setRowDataEstimateDetail] = useState([]);
    const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
    const [openItemDialog, setOpenItemDialog] = useState(false);
    const [openAmountDialog, setOpenAmountDialog] = useState(false);
    const [idEstimate, setIdEstimate] = useState(0);
    const [idEstimateDetail, setIdEstimateDetail] = useState(0);

    // 견적 그리드 컬럼 정보
    const columnDefsEstimate = [
        { headerName: '거래처명', field: 'customerName' },
        { headerName: '견적일자', field: 'estimateDate', cellEditor: 'datePicker' },
        { headerName: '유효일자', field: 'effectiveDate', cellEditor: 'datePicker' },
        { headerName: '견적담당자', field: 'personCodeInCharge' },
        { headerName: '견적요청자', field: 'estimateRequester' },
        { headerName: '비고', field: 'description' }
    ];

    const columnDefsEstimateDetail = [
        { headerName: '품목코드', field: 'itemCode' },
        { headerName: '품목명', field: 'itemName' },
        { headerName: '단위', field: 'unitOfEstimate' },
        { headerName: '납기일', field: 'dueDateOfEstimate', cellEditor: 'datePicker' },
        { headerName: '견적수량', field: 'estimateAmount' },
        { headerName: '견적단가', field: 'unitPriceOfEstimate' },
        { headerName: '합계액', field: 'sumPriceOfEstimate' },
        { headerName: '비고', field: 'description' },
        {
            headerName: '삭제',
            field: 'remove',
            cellRenderer: 'btnRemove'
        }
    ];

    const frameworkComponents = {
        btnRemove: () => {
            return BtnRemove(handleRemove);
        }
    };

    function onGridReadyEstimate(params) {
        setGridApiEstimate(params.api);
        setGridColumnApiEstimate(params.columnApi);
        params.api.sizeColumnsToFit();
    }

    function onGridReadyEstimateDetail(params) {
        setGridApiEstimateDetail(params.api);
        setGridColumnApiEstimateDetail(params.columnApi);
        params.api.sizeColumnsToFit();
    }

    const handleChangeDate = e => {
        if (e.target.id === 'targetDate') {
            setTargetDate(e.target.value);
        }
    };

    const handleOpenDialog = params => {
        if (params.colDef.field === 'customerName') {
            setOpenCustomerDialog(true);
        } else if (params.colDef.field === 'itemName' || params.colDef.field === 'itemCode') {
            setOpenItemDialog(true);
        } else if (
            params.colDef.field === 'estimateAmount' ||
            params.colDef.field === 'unitPriceOfEstimate'
        ) {
            setOpenAmountDialog(true);
        } else if (params.colDef.field === 'remove') {
            var row = gridApiEstimateDetail.getSelectedRows();
            gridApiEstimateDetail.updateRowData({ remove: row });

            var newData = rowDataEstimateDetail.filter(node => node.id !== row[0].id);
            setRowDataEstimateDetail(newData);
        }
    };

    const handleCloseCustomerDialog = params => {
        setOpenCustomerDialog(false);
    };

    const handleCloseItemDialog = params => {
        setOpenItemDialog(false);
    };
    const handleCloseAmountDialog = params => {
        setOpenAmountDialog(false);
    };

    const handleAddEstimateRow = () => {
        console.log(gridApiEstimate.getDisplayedRowCount());

        if (gridApiEstimate.getDisplayedRowCount() < 1) {
            var newRow = [
                {
                    customerName: '',
                    estimateDate: today,
                    effectiveDate: '',
                    personCodeInCharge: sessionStorage.getItem('empNameInfo_token'),
                    estimateRequester: sessionStorage.getItem('empNameInfo_token'),
                    description: '',
                    status: 'INSERT',
                    id: idEstimate
                }
            ];
            setIdEstimateDetail(idEstimate + 1);

            gridApiEstimate.updateRowData({ add: newRow });
            setRowDataEstimate(newRow);

        }
    };

    const handleAddEstimateDetailRow = () => {

        var newData = {
            itemCode: '',
            itemName: '',
            unitOfEstimate: 'EA',
            dueDateOfEstimate: '',
            estimateAmount: 0,
            unitPriceOfEstimate: 0,
            sumPriceOfEstimate: 0,
            description: '',
            remove: '',
            status: 'INSERT',
            id: idEstimateDetail
        };
        setIdEstimateDetail(idEstimateDetail + 1);
        setRowDataEstimateDetail([...rowDataEstimateDetail, newData]);
    };

    const handleCustomerSelected = params => {
        var selectedData = gridApiEstimate.getSelectedRows();
        selectedData[0].customerName = params.data.customerName;
        selectedData[0].customerCode = params.data.customerCode;

        gridApiEstimate.updateRowData({ update: selectedData });

        setRowDataEstimate(selectedData);

        handleAddEstimateDetailRow();
    };

    useEffect(() => {
        console.log(rowDataEstimateDetail);
    }, [rowDataEstimateDetail]);

    useEffect(() => {
        console.log(rowDataEstimate);
    }, [rowDataEstimate]);

    const handleItemSelected = params => {
        var selectedData = gridApiEstimateDetail.getSelectedRows();
        selectedData[0].itemCode = params.data.itemCode;
        selectedData[0].itemName = params.data.itemName;

        gridApiEstimateDetail.updateRowData({ update: selectedData });
    };

const [itemCost, searchItemCostFetch] = useAsync((param) =>api.searchItemCode(param), [], true);

    const handleSearchItemCode = () => {
        var row = gridApiEstimateDetail.getSelectedRows();
        let param = {
            itemCode: row[0].itemCode
        };
        searchItemCostFetch(param);
    };

    const handleRemove = e => {
        e.defaultPrevented();
        console.log(e);
    };

const [estimateRow, saveEstimateRowFetch] = useAsync((param) =>api.saveEstimateRow(param), [], true);
    const handleSaveEstimateRow = () => {
        rowDataEstimate[0].estimateDetailTOList = rowDataEstimateDetail;
        console.log(rowDataEstimate);

        saveEstimateRowFetch(rowDataEstimate[0]);
        setRowDataEstimate([]);
        setRowDataEstimateDetail([]);
    };

    return (
        <>
            <div>
                <div>
                    <AppBar position="static" color="primary">
                        <Toolbar>
                            <Typography component="h2" variant="h4">
                                견적등록
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </div>

                <Estimate
                    onChangeDate={handleChangeDate}
                    addEstimateRow={handleAddEstimateRow}
                    saveEstimateRow={handleSaveEstimateRow}
                    columnDefsEstimate={columnDefsEstimate}
                    onGridReady={onGridReadyEstimate}
                    handleOpenDialog={handleOpenDialog}
                    components={{ datePicker: getDatePicker() }}
                    rowData={rowDataEstimate}
                />

                <MyDialog open={openCustomerDialog} close={handleCloseCustomerDialog}>
                    <CustomerDialog
                        close={handleCloseCustomerDialog}
                        onCellClicked={handleCustomerSelected}
                    />
                </MyDialog>

                {/* 견적상세 그리드 및 버튼 */}
                <EstimateDetail
                    handleAddEstimateDetailRow={handleAddEstimateDetailRow}
                    columnDefsEstimateDetail={columnDefsEstimateDetail}
                    onGridReadyEstimateDetail={onGridReadyEstimateDetail}
                    handleOpenDialog={handleOpenDialog}
                    frameworkComponents={frameworkComponents}
                    components={{ datePicker: getDatePicker() }}
                    rowData={rowDataEstimateDetail}
                />

                <MyDialog open={openItemDialog} close={handleCloseItemDialog}>
                    <ItemDialog close={handleCloseItemDialog} onCellClicked={handleItemSelected} />
                </MyDialog>

                <MyDialog open={openAmountDialog} close={handleCloseAmountDialog}>
                    <AmountDialog
                        close={handleCloseAmountDialog}
                        handleSearchItemCode={handleSearchItemCode}
                        itemCost={itemCost.data ? itemCost.data.gridRowJson:null}
                        gridApiEstimateDetail={gridApiEstimateDetail}
                    />
                </MyDialog>
            </div>
        </>
    );
};

const BtnRemove = handleRemove => {
    return (
        <Button variant="contained" color="secondary">
            Remove
        </Button>
    );
};

export default EstimateRegister;
