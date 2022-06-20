import React, { useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import { useDispatch, useSelector } from "react-redux";
import { SEARCH_MONTH_SALARY_LIST_REQUEST } from "erp/hr/ActionType/ActionType";
import useSelectItem from "erp/hr/Page/MonthSalary/useSelectItem";
import Select from "react-select";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  DialogActions,
  Button,
  FormControl,
} from "@material-ui/core";
import { useThemeSwitcher } from "mui-theme-switcher";

const OpenSearchSalaryDialog = ({ open, close, value }) => {
  const [date, setDate] = useState("");
  const [positionGridApi, setPositionGridApi] = React.useState();
  const data = useSelector(({ HrReducer }) => HrReducer.monthSalary, []);
  const dispatch = useDispatch();
  const [journalLists, setJournalLists] = useState([
    //분개는 단 두가지만 표현한다 현금/ 공제금액 그리고 이부분들은 set을 사용하면 작동안된다.
    {
      journalNo: "NEW JOURNAL", // 여기서 분개 번호가 만들어짐.
      slipNo: "NEW",
      balanceDivision: "차변",
      accountCode: "0603", //급여는 노무비로 넣었다.
      accountName: "급여",
      customerCode: null,
      leftDebtorPrice: "", // 차변
      rightCreditsPrice: 0, // 대변
    },
    {
      journalNo: "NEW JOURNAL",
      slipNo: "NEW",
      balanceDivision: "대변",
      accountCode: "0101", //급여에 대한 현금
      accountName: "현금",
      customerCode: null,
      leftDebtorPrice: 0, // 차변
      rightCreditsPrice: "", // 대변
    },
    {
      journalNo: "NEW JOURNAL",
      slipNo: "NEW",
      balanceDivision: "차변",
      accountCode: "0621", //공제금을 세부적으로 구분하지 않고 보험료로 전표발행
      accountName: "보험료",
      customerCode: null,
      leftDebtorPrice: "", // 차변
      rightCreditsPrice: 0, // 대변
    },
    {
      journalNo: "NEW JOURNAL",
      slipNo: "NEW",
      balanceDivision: "대변",
      accountCode: "0101", //공제금에 대한 현금
      accountName: "현금",
      customerCode: null,
      leftDebtorPrice: 0, // 차변
      rightCreditsPrice: "", // 대변
    },
  ]);

  const onGridReady = params => {
    setPositionGridApi(params.api);
    params.api.sizeColumnsToFit(); // 칼럼 사이즈 자동조절
  };
  const set1 = useSelectItem(); //날짜 선택창

  const DatehandleChange = newValue => {
    setDate(newValue.value);
  };
  //========================== 그리드내용 ==========================
  const accountColumnDefs = [
    { width: "100", headerCheckboxSelection: true, checkboxSelection: true },
    { headerName: "사원코드", field: "empCode" },
    { headerName: "적용연월", field: "applyYearMonth", hide: true },
    {
      headerName: "총 급여",
      field: "salary",
      valueFormatter: currencyFormatter,
    },
    {
      headerName: "연차미사용수당",
      field: "unusedDaySalary",
      valueFormatter: currencyFormatter,
    },
    {
      headerName: "경비지급액",
      field: "cost",
      valueFormatter: currencyFormatter,
    },
    {
      headerName: "초과수당 합계",
      field: "totalExtSal",
      valueFormatter: currencyFormatter,
    },
    {
      headerName: "공제금액 합계",
      field: "totalDeduction",
      valueFormatter: currencyFormatter,
    },
    {
      headerName: "차인지급액",
      field: "realSalary",
      valueFormatter: currencyFormatter,
    },
    { headerName: "실지급액", field: "totalPayment", hide: true },
    { headerName: "마감여부", field: "finalizeStatus" },
  ];
  //========================== 그리드를 클릭했을 때 발생되는 이벤트 ==========================
  // onClose 와 open 값을 비구조 할당과 동시에 Dialog가 닫히면서
  // onClose안에 객체(data, division) 을 가지고 AccountSearch 컴포넌트로 감.

  // onclick 에 handleClose 실행되면서 close 함수호출

  function currencyFormatter(params) {
    return formatNumber(params.value) + " 원";
  }

  function formatNumber(number) {
    // this puts commas into the number eg 1000 goes to 1,000,
    // i pulled this from stack overflow, i have no idea how it works
    return Math.floor(number)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  const Close = () => {
    close({
      division: "SalaryDialog",
    });
  };

  const SumSalary = () => {
    const salaryRows = positionGridApi.getSelectedRows();
    var realSalary = 0;
    var totalDeduction = 0;

    if (salaryRows.length === 0) {
      alert("선택된 값이 없습니다");
      return;
    }
    console.log(salaryRows[0].finalizeStatus);

    for (var i = 0; i < salaryRows.length; i++) {
      if (salaryRows[i].finalizeStatus === "Y") {
        alert("마감여부 확인 바랍니다");
        return;
      }
      realSalary += parseInt(salaryRows[i].realSalary);
      totalDeduction += parseInt(salaryRows[i].totalDeduction);
    }
    const newJournal = journalLists.map((journalState, index) => {
      switch (index) {
        case 0:
          return {
            ...journalState,
            leftDebtorPrice: realSalary,
          };

        case 1:
          return {
            ...journalState,
            rightCreditsPrice: realSalary,
          };

        case 2:
          return {
            ...journalState,
            leftDebtorPrice: totalDeduction,
          };

        case 3:
          return {
            ...journalState,
            rightCreditsPrice: totalDeduction,
          };

        default:
          return { ...journalState };
      }
    });
    console.log("newJournal", newJournal);
    close({
      newJournal,
      salaryRows,
      division: "SalaryDialog",
    });
  };
  const selectData = async () => {
    //월별 급여조회 호출
    await dispatch({
      type: SEARCH_MONTH_SALARY_LIST_REQUEST,
      payload: {
        applyYearMonth: date,
        deptCode: "ALL",
      },
    });
  };
  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      width: state.selectProps.width,
      borderBottom: "1px dotted pink",
      color: state.selectProps.menuColor,
      padding: 20,
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";

      return { ...provided, opacity, transition };
    },
  };

  const { dark } = useThemeSwitcher();

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={open}
      fullWidth={true}
      maxWidth={"70%"}
    >
      <DialogTitle id="simple-dialog-title" Align="center">
        임금/납품
      </DialogTitle>
      <DialogContent dividers>
        <List>
          <div Align="center">
            <FormControl style={{ minWidth: "250px" }}>
              <Select
                styles={customStyles}
                onChange={DatehandleChange}
                options={set1.selectedmonth}
                placeholder="값을 선택해주세요"
              ></Select>
            </FormControl>
            <Button
              variant="contained"
              size="large"
              color="primary"
              startIcon={<SearchIcon />} //아이콘
              onClick={selectData}
            >
              검색
            </Button>
          </div>
          <div
            className={dark ? "ag-theme-alpine-dark" : "ag-theme-material"}
            style={{
              height: "800px",
              width: "100%",

              paddingTop: "8px",
            }}
          >
            <AgGridReact
              columnDefs={accountColumnDefs} //컬럼명
              rowSelection="multiple" // 하나만 선택 가능.
              getRowStyle={function(param) {
                return { "text-align": "center" };
              }} //body 가운데 정렬
              onGridReady={onGridReady}
              rowData={data}
            />
          </div>
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={SumSalary} color="primary">
          Submit
        </Button>
        <Button onClick={Close} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default OpenSearchSalaryDialog;
