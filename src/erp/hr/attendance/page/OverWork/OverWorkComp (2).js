import React from "react";
import UseStyles from "./UseStyles";
import {
  Paper,
  TextField,
  Button,
  Grid,
  AppBar,
  InputLabel,
  Box,
  Typography,
  Toolbar,
  MenuItem,
  Select,
  FormControl,
  OutlinedInput,
} from "@material-ui/core";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import useInput from "util/useInput";
import OverWorkInput from "./OverWorkInput";

import { useDispatch } from "react-redux";
import { REST_ATTD_REQUEST } from "erp/hr/attendance/reducer/RestReducer";
import Axios from "axios";

//*************************초과근무 신청 =시작= 유찬 _20.08.31 *************************
const OverWorkComp = props => {
  const columnDefs = OverWorkInput;
  const classes = UseStyles();
  const dayOffData = useInput();
  const fromDate = useInput("2020-01-01");
  const toDate = useInput("2020-12-31");
  let selectedInput = document.getElementsByName("attdRestTypeCode")[0];
  const codeDivision = element => {
    if (typeof element == "undefined") return "";
    else {
      // console.log(element.value);
      return element.value;
    }
  };
  const getInnerText = compVal => {
    console.log("////////////////" + compVal);
    if (!compVal) return;
    let returnVal = "";
    switch (compVal) {
      case "ASC008":
        returnVal = "초과근무";
        break;
      default:
        alert("compVal 확인요망");
    }
    return returnVal;
  };

  const serchDayOff = () => {
    Axios.get("http://localhost:8282/hr/attendance/findRestAttdList", {
      params: {
        startDate: fromDate.value,
        endDate: toDate.value,
        empCode: sessionStorage.getItem("empCodeInfo_token"),
        code: codeDivision(selectedInput),
      },
    })
      .then(response => {
        dayOffData.setValue(response.data.restAttdList);
      })
      .catch(err => {
        console.log(err);
      });
  };
  // togle
  const [costOpen, setCostOpen] = React.useState(false);
  const [attdRestOpen, setAttdRestOpen] = React.useState(false);

  function costHandleClose() {
    setCostOpen(false);
  }

  function costHandleOpen() {
    setCostOpen(true);
  }

  function attdRestHandleClose() {
    // console.log(data);
    setAttdRestOpen(false);
  }

  function attdRestHandleOpen() {
    setAttdRestOpen(true);
  }

  const attdRestStartDate = useInput();
  const attdRestEndDate = useInput();
  const attdRestTypeCode = useInput();
  const cause = useInput();
  const cost = useInput();
  const startTime = useInput();
  const endTime = useInput();

  const dispatch = useDispatch();

  const BatchDailyAttdRest = () => {
    if (!codeDivision(selectedInput)) {
      alert("근태외 구분란을 입력하세요");
      return;
    }

    const numberOfDays = (
      (new Date(attdRestEndDate.value).getTime() -
        new Date(attdRestStartDate.value).getTime()) /
      (1000 * 60 * 60 * 24)
    ).toString();

    const timeFormAlter = primitiveTime => {
      if (!primitiveTime) return;
      let changedTime = primitiveTime.replace(":", "");
      if (changedTime.charAt(0) == 0)
        changedTime = changedTime.replace(/(^0+)/, "");

      return Number(changedTime);
    };

    const restAttdApplyData = {
      empCode: sessionStorage.getItem("empCodeInfo_token"),
      restTypeCode: attdRestTypeCode.value,
      restTypeName: getInnerText(codeDivision(selectedInput)),
      requestDate: new Date().toISOString().substring(0, 10),
      startDate: attdRestStartDate.value,
      endDate: attdRestEndDate.value,
      cause: cause.value,
      applovalStatus: "승인대기", // RST_ATTD테이블 칼럼 오탈자
      rejectCause: "",
      cost: "", // getInnerText(cost.value), RST_ATTD테이블에 COST칼럼은 있지만, 해당칼럼은 NUMBER형이다. 각 항목에 대한 비용이 정의된 테이블을 찾지못했음
      startTime: timeFormAlter(startTime.value),
      endTime: timeFormAlter(endTime.value),
      numberOfDays: numberOfDays == "NaN" ? 0 : numberOfDays,
    };
    dispatch({ type: REST_ATTD_REQUEST, data: restAttdApplyData });
  };

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.topPaper}>
          <FormControl variant="outlined" className={classes.topFormControl}>
            <InputLabel
              ref={inputLabel}
              htmlFor="outlined-attdRestTypeCode-simple"
            >
              ATTD TYPE
            </InputLabel>
            <Select
              input={
                <OutlinedInput
                  labelWidth={labelWidth}
                  name="attdRestTypeCode"
                  id="outlined-attdRestTypeCode-simple"
                />
              }
              open={attdRestOpen}
              onClose={attdRestHandleClose}
              onOpen={attdRestHandleOpen}
              onChange={attdRestTypeCode.onChange}
            >
              <option value="ASC008">초과근무</option>
              {/*                 <option value="ADC005">사외출</option>
                <option value="DAC004">조퇴</option> */}
            </Select>
          </FormControl>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.leftPaper}>
          <AppBar position="relative" className={classes.subCategory}>
            <Toolbar>
              <Typography variant="h5">초과근무 신청</Typography>
            </Toolbar>
          </AppBar>
          <br />
          <form>
            <TextField
              id="attdRestStartDate"
              label="초과근무 시작일"
              type="date"
              variant="outlined"
              defaultValue={attdRestStartDate.value}
              onChange={attdRestStartDate.onChange}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <TextField
              id="attdRestEndDate"
              label="초과근무 종료일"
              type="date"
              variant="outlined"
              defaultValue={attdRestEndDate.value}
              onChange={attdRestEndDate.onChange}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <TextField
              id="startTime"
              label="시작시간"
              type="time"
              defaultValue={startTime.value}
              onChange={startTime.onChange}
              className={classes.textField}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <TextField
              id="endTime"
              label="종료시간"
              type="time"
              defaultValue={endTime.value}
              onChange={endTime.onChange}
              className={classes.textField}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel ref={inputLabel} htmlFor="outlined-cost-simple">
                COST
              </InputLabel>
              <Select
                input={
                  <OutlinedInput
                    labelWidth={labelWidth}
                    name="cost"
                    id="outlined-cost-simple"
                  />
                }
                open={costOpen}
                onClose={costHandleClose}
                onOpen={costHandleOpen}
                value={cost.value}
                onChange={cost.onChange}
              >
                <MenuItem value="ASC008">초과근무</MenuItem>
              </Select>
            </FormControl>
            <br />
            <TextField
              id="cause"
              label="근태외 사유"
              variant="outlined"
              defaultValue={cause.value}
              onChange={cause.onChange}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
          <Box textAlign="right">
            <Button
              variant={"outlined"}
              color={"primary"}
              onClick={BatchDailyAttdRest}
              className={classes.button}
            >
              신청
            </Button>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <Paper className={classes.rightPaper}>
          <AppBar position="relative" className={classes.subCategory}>
            <Toolbar>
              <Typography variant="h5">초과근무 현황조회</Typography>
            </Toolbar>
          </AppBar>
          <br />
          <div>
            <TextField
              id={"fromDate"}
              label={"검색날짜"}
              type={"date"}
              defaultValue={fromDate.value}
              onChange={fromDate.onChange}
              className={classes.textField}
              variant="outlined"
            />
            ~
            <TextField
              id={"toDate"}
              label={"검색날짜"}
              type={"date"}
              defaultValue={toDate.value}
              onChange={toDate.onChange}
              className={classes.textField}
              variant="outlined"
            />
            <Button
              variant={"outlined"}
              color={"primary"}
              onClick={serchDayOff}
              className={classes.button}
            >
              조회
            </Button>
          </div>
          <div
            className={"ag-theme-material"}
            style={{
              height: "400px",
              width: "100%",
            }}
          >
            <AgGridReact columnDefs={columnDefs} rowData={dayOffData.value} />
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OverWorkComp;

//*************************초과근무 신청 =종료= 유찬 _20.08.31 *************************
