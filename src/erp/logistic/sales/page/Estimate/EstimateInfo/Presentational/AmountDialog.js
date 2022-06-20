import { TextField, Button } from '@material-ui/core';
import Axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import MyGrid from 'util/LogiUtil/MyGrid';

const AmountDialog = props => {
    const [itemCost, setItemCost] = useState(null);
    const [total, setTotal] = useState(null);
    const [itemAmount, setItemAmount] = useState(null);

    const useStyles = makeStyles(theme => ({
        root: {
            flexGrow: 1
        },
        title: {
            flexGrow: 1,
            marginLeft: '3vw',
            marginTop: 'calc(6vh - 4vh)',
            height: '6vh',
            fontSize: '3vh'
        },
        btn: {
            flexGrow: 1,
            marginBottom: '1vh',
            marginTop: '1vh'
        },
        appBar: {
            flexGrow: 1,
            width: '100%',
            height: '10vh'
        },
        text: {
            flexGrow: 1,
            fontSize: '3vh'
        },
        float: {
            float: 'left'
        }
    }));

    const classes = useStyles();

    useEffect(() => {
        props.handleSearchItemCode();
        setItemCost(props.itemCost);
    }, [itemCost, props]);

    const handleChangeTotal = useCallback(
        e => {
            setItemAmount(e.target.value);
            setTotal(e.target.value * props.itemCost);
        },
        [itemCost, props]
    );

    const handleConfirmAmount = params => {
        var row = props.gridApiEstimateDetail.getSelectedRows();
        row[0].estimateAmount = itemAmount;
        row[0].unitPriceOfEstimate = itemCost;
        row[0].sumPriceOfEstimate = total;

        console.log(row);
        props.gridApiEstimateDetail.updateRowData({ update: row });
        props.close();
    };

    return (
        <div className={classes.root}>
            <div>
                <AppBar position="static" className={classes.appBar}>
                    <Typography className={classes.title}>견적수량 / 견적단가 입력</Typography>
                </AppBar>
            </div>
            <div align="center">
                <div>
                    <h4>견적수량</h4>{' '}
                    <TextField
                        id="amountTxf"
                        variant="outlined"
                        onChange={handleChangeTotal}
                        value={itemAmount}
                    />
                </div>
                <div>
                    <h4>견적단가</h4> <TextField id="costTxf" variant="outlined" value={itemCost} />
                </div>
                <div>
                    <h4>합계액 :</h4>
                    <TextField disabled id="standard-disabled" value={total} />
                </div>
                <div>
                    <Button onClick={handleConfirmAmount}>OK</Button>
                    <Button onClick={props.handleCloseAmountDialog} className={classes.btn}>
                        CANCLE
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AmountDialog;
