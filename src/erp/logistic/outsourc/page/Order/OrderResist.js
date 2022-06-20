//2020-12-04 64기 정준혁
import React, { useState, useCallback } from 'react';
import MyCalendar from 'util/LogiUtil/MyCalendar';
import MyGrid from 'util/LogiUtil/MyGrid';
import { Button } from '@material-ui/core';
import { getDatePicker } from 'erp/hr/util/datePicker';
import { today } from 'erp/hr/util/lib';
import Swal from 'sweetalert2';
import OutSourcOrderableColumn from './OutSourcOrderableColumn';
import useAsync from 'util/useAsync';
import moment from 'moment';
import * as api from '../../api';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MyDialog from 'util/LogiUtil/MyDialog';
import AmountDialog from './AmountDialog';
import Axios from 'axios';

const OrderRegist = () => {

    let today = moment(new Date()).format('yyyy-MM-DD');
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [condition, setCondition] = useState('claimDate');
    const [openAmountDialog, setOpenAmountDialog] = useState(false);
    const [itemCost, setItemCost] = useState(null);
    const [gridApi, setGridApi] = useState();

    const [orderableList, orderableListFetch] = useAsync((param) =>api.searchOrderableList(param), [], true);

    const basicInfo = (startDate, endDate) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };

    const onChangeDate = e => {
        console.log(e);
        if (e.target.id === 'startDate') {
            setStartDate(e.target.value);
        } else {
            setEndDate(e.target.value);
        }
    };

    const onClicked = () =>{
        const param = {
            searchDateCondition: condition,
            startDate: startDate,
            endDate: endDate
        }
        orderableListFetch(param);
    };

    const conditionChange = e => {
        setCondition(e.target.value);
    };

    
    const handleOpenDialog = params => {
    if (
        params.colDef.field === 'outsourcAmount' ||
        params.colDef.field === 'unitPriceOfOutsourc')
            setOpenAmountDialog(true);
    };
    const handleCloseAmountDialog = params => {
        // console.log(params);
        setOpenAmountDialog(false);
    };
    const handleSearchItemCode = () => {
        // console.log(gridApiEstimateDetail.getSelectedRows())

        var row = gridApi.getSelectedRows();
        let param = {
            itemCode: row[0].itemCode
        };
        Axios.get('http://localhost:8282/logi/outsourc/getStandardUnitPrice', {
            params: param
        })
            .then(response => {
                setItemCost(response.data.gridRowJson);
                console.log(response.data.gridRowJson);
                // console.log(itemCost);
            })
            .catch(e => {
                console.log(e);
            });
    };

    function onGridReadyEstimateDetail(params) {
        setGridApi(params.api);
        params.api.sizeColumnsToFit();
    }

    const regist = () =>
    {
        const rows = gridApi.getSelectedRows();
        console.log(rows);

        let bool = false;

        rows.forEach(el => {
            bool = bool||(parseInt(el.necessaryAmount) < parseInt(el.outsourcAmount));
            if(bool){
                return Swal.fire({
                    icon: 'error',
                    title: '외주수량 초과'
                });
            }
        });
        if(bool) return;
        //Axios.post('http://localhost:8282/logi/outsourc/insertOutsourc',rows);

        Axios.post('http://localhost:4000/erp/logi/outsourc/insertOutsourc',rows);

        console.log("외주 발주 함");

        gridApi.updateRowData({remove:rows});
    }

    return (
        <>
            <MyGrid
                column={OutSourcOrderableColumn}
                title={'외주 발주 등록'}
                onCellClicked={handleOpenDialog}
                rowSelection="multiple"
                components={{ datePicker: getDatePicker() }}
                list={orderableList.data ? orderableList.data.gridRowJson : null}
                api={onGridReadyEstimateDetail}
            >
                <div style={{ float: 'left' }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginRight: '1vh', marginTop: '1vh' }}
                        onClick={regist}
                    >
                        외주 발주 등록
                    </Button>
                </div>
                <div align="left" style={{ float: 'left' }}>
                    <RadioGroup
                        row
                        aria-label="searchDateCondition"
                        name="searchDateCondition"
                        defaultValue="claimDate"
                    >
                        <FormControlLabel
                            value="claimDate"
                            control={<Radio />}
                            label="발주/작업지시 기한"
                            style={{ marginRight: '1vh', marginTop: '1vh' }}
                            onChange={conditionChange}
                        />
                        <FormControlLabel
                            value="dueDate"
                            control={<Radio />}
                            label="발주/작업지시 완료기한"
                            style={{ marginRight: '1vh', marginTop: '1vh' }}
                            onChange={conditionChange}
                        />
                    </RadioGroup>
                </div>
                <MyCalendar  onChangeDate={onChangeDate} basicInfo={basicInfo}/>
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginRight: '1vh', marginTop: '1vh' }}
                    onClick={onClicked}
                >
                    외주 발주 등록 가능 리스트 조회
                </Button>
            </MyGrid>

            <MyDialog open={openAmountDialog} close={handleCloseAmountDialog}>
                    <AmountDialog
                        close={handleCloseAmountDialog}
                        handleSearchItemCode={handleSearchItemCode}
                        itemCost={itemCost}
                        gridApi={gridApi}
                    />
                </MyDialog>
        </>
    );
};

export default OrderRegist;