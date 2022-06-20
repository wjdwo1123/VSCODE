//**************************************** 2020.11-23 박민호 수정 시작 ****************************************
import { put, takeEvery, takeLatest, call, all } from 'redux-saga/effects';
import axios from 'axios';
import * as types from 'erp/logistic/sales/action/SalesActionType';
import deliverySuccess from '../reducer/SalesReducer';



function* deliveryCompleteData(action) {
    try {
        console.log('action', action);
        const { data } = yield axios.get(
            'http://localhost:8282/logi/logistics/sales/searchDeliveryInfoList'
        );
        yield console.log('@@@@@납품데이터조회@@@');
        yield console.log(data.gridRowJson);
        //yield put(deliverySuccess(data));
        yield put({ type: types.DELIVERY_COMPLETE_SUCCESS, payload: data.gridRowJson });

    } catch (e) {
        console.log('@@@@@납품 에러발생 ㅠㅠㅠㅠ@@@@@');
        console.log(e);
        // yield put(actions.deliveryCompleteFailure(e.message));
    }
}

function* deliveryDivisionData(action) {
    try {
        yield axios.post(
            'http://localhost:8282/logi/logistics/sales/deliverDivisionUpdate',

            {
                deliverUpdate: action.payload.DeliveryInsert
            }
        );
    } catch (e) {
        // yield put(actions.deliveryDivisionFailure(e.message));
    }
}


function* orderCompleteData(action) {
    try {
        console.log('action', action);
        const { data } = yield axios.get(
            'http://localhost:8282/logi/purchase/getOrderDialog'
        );
        yield console.log('@@@@@ 발주데이터조회 @@@');
        yield console.log(data.gridRowJson);
        //yield put(orderSuccess(data));
        yield put({ type: types.ORDER_COMPLETE_SUCCESS, payload: data.gridRowJson });

    } catch (e) {
        console.log('@@@@@발주 에러발생 ㅠㅠㅠㅠ@@@@@');
        console.log(e);
        // yield put(actions.orderCompleteFailure(e.message));
    }
}


function* orderDivisionData(action) {
    try {
        yield axios.post(
            'http://localhost:8282/logi/purchase/updateOrderInfo',
            {orderUpdate: action.payload.OrderInsert},
            { headers: { "Content-Type": "application/json" }}
        
        );
    } catch (e) {
        // yield put(actions.deliveryDivisionFailure(e.message));
    }
}



export function* deliveryCompleteDataSaga() {
    yield takeEvery(types.DELIVERY_COMPLETE_REQUEST, deliveryCompleteData);
}

export function* deliveryDivisionDataSaga() {
    yield takeLatest(types.DELIVERY_DIVISON_START, deliveryDivisionData);
}


export function* orderCompleteDataSaga() {
    yield takeEvery(types.ORDER_COMPLETE_REQUEST, orderCompleteData);
}

export function* orderDivisionDataSaga() {
    yield takeLatest(types.ORDER_DIVISON_START, orderDivisionData);
}

//**************************************** 2020.11.23 박민호 수정 종료 ****************************************
export default function* SalesSaga() {
    yield all([call(deliveryCompleteDataSaga),
                call(deliveryDivisionDataSaga),
                call(orderCompleteDataSaga), 
                call(orderDivisionDataSaga),
            ]);
}
