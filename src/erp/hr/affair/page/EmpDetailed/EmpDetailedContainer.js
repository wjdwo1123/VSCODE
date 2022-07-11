import axios from "axios";
import { useEffect, useState } from "react";
import "./Back.css"
import { AgGridReact } from "ag-grid-react";
import {Collapse, Button, Card, Fade} from 'react-bootstrap'

import React from "react";
//import EmpDetailed from "./SimpleEmpSearch/EmpDetailed";
import { connect } from "react-redux";
import { EmpDetailedInfoRequest, EmpUpdateRequest } from "../../saga/EmpInfoSaga";
import { PositionListRequest } from "../../saga/PositionSaga";

const EmpDetailedContainer = props => {
  /*********************변수*********************/
  const [부서목록,부서목록변경]=useState([]);
  const [회원정보,회원정보변경]=useState([]);
  const [회원정보뿌리기,회원정보뿌리기변경]=useState([]);
  const [사진,사진변경]=useState([]);
  const [이름,이름변경]=useState([]);
  const [생일,생일변경]=useState([]);
  const [성별,성별변경]=useState([]);
  const [사코,사코변경]=useState([]);
  const [클릭한사원, 클릭한사원변경]=useState([]);
  const [그리드상태,그리드상태변경]=useState(false);
  const [클릭모음,클릭모음변경]=useState([]);
  const [open, setOpen] = useState(false);
  // const [rowData, setRowData] = useState([
  //   {사원명: "A", 사원코드: "a"},
  //   {사원명: "B", 사원코드: "b"}
  // ]);
  const rowData = 클릭한사원.map((value,index) => {
    return {
      empName: value.empName,
      empCode: value.empCode,
      deptCode: value.deptCode
   };
  })
  const [columnDefs] = useState([
      { headerName: "직원이름", field: "empName",checkboxSelection: true },
      { headerName: "사원코드", field: "empCode"},
      { headerName: "부서코드", field: "deptCode"}
  ])
  /*********************펑션*********************/
  useEffect(()=>{
    
     axios
    .get('http://localhost:8282/hr/base/deptList')
    .then((result)=>{ 부서목록변경(result.data.list); })
    .catch(
        console.log("부서조회실패"),
        console.log("vs올리는중")
    );

     axios
    .get('http://localhost:8282/hr/affair/empList')
    .then((result)=>{ 회원정보변경(result.data.empList); })
    .catch( console.log("회원조회실패") );

  },[]);

  function changeEmp(e){
    let 클릭한회원의인덱스=회원정보.findIndex((list)=>{	
			return list.empName===e.target.value
		})
    회원정보뿌리기변경(회원정보[클릭한회원의인덱스]);
    사진변경("");
    var copy=[...사진];
    copy.push("/"+회원정보[클릭한회원의인덱스].img);
    사진변경(copy);
  }

  function remove(){
     axios
    .get('http://localhost:8282/hr/affair/remove', { params: { ename: 회원정보뿌리기.empName } } )
    .then( console.log("삭제성공") )
    .catch( console.log("삭제실패") )
    .finally( window.location.reload() )
  }

  function update(){
     axios
    .get('http://localhost:8282/hr/affair/update', { params: {
          empName : 이름,
          birthDate : 생일,
          gender : 성별,
          empCode : 사코,
      }})
    .then( console.log("수정성공") )
    .catch( (e)=>{console.log("수정실패"+e)} )
    .finally( window.location.reload() )
  }

  function create(){
     axios
    .get('http://localhost:8282/hr/affair/modify', { params: {
          empName : 이름,
          birthDate : 생일,
          gender : 성별,
          empCode : 사코,
      }})
    .then( console.log("등록성공") )
    .catch( console.log("등록실패") )
    .finally( window.location.reload() )
  }
  function changeGrid(e){
     그리드상태변경(true);
      let 클릭한코드=회원정보.filter(a => a.deptCode==e); //e:클릭한부서 클릭한코드:클릭한부서에 해당하는 회원정보
      클릭한사원변경(클릭한코드);
  }
  function onRowClicked(e){
    console.log("★"+JSON.stringify(e));
    let 클릭한회원의인덱스=회원정보.findIndex((list)=>{	
			return list.empName===e.empName
		})
    회원정보뿌리기변경(회원정보[클릭한회원의인덱스]);
    사진변경("");
    var copy=[...사진];
    copy.push("/"+회원정보[클릭한회원의인덱스].img);
    사진변경(copy);
  }


  function onSelectionChanged(e){
      클릭모음변경(e.api.getSelectedRows());
      console.log(e.api.getSelectedRows())
  }

  function removeClick(){
    // {
    //   클릭모음.map((value,index)=>{
    //     return(
    //       클릭삭제.push(value.empCode)
    //     )
    //   })
    // }
     axios
      .post('http://localhost:8282/hr/affair/togetherRemove',{
        emp: 클릭모음
      })
      .then((result)=>{console.log("삭제성공"+result)})
      .catch((e)=>{console.log("삭제실패"+e)})
  }
  /*********************뷰단*********************/
  return (
    <div>
      dddㄹㅇ게임 ㄱㄱ
      ㅎㅇ오랜만
      <div>월집</div>
            사원명&nbsp;&nbsp;
            <select onChange={(e)=>{changeEmp(e)}}>
                <option style={{display:"none"}}>=====</option>
                {
                회원정보.map((value,index)=>{
                return(
                <option key={index}>{value.empName}</option>
                )
                })
                }
            </select>
            <div className="back1">
              <div style={{backgroundColor:"red",color:"white"}}>프로필 정보</div>
                <span className="back2">
                  <img src={사진} className="back4"/>
                </span>
                <div className="back3">
                    <br />프로필사진
                    <br /><br />
                    이름&nbsp;&nbsp;<input value={회원정보뿌리기.empName} placeholder="이름이 조회됩니다" onChange={ (e)=>{이름변경(e.target.value)} } />
                    <br /><br />
                    생일&nbsp;&nbsp;<input value={회원정보뿌리기.birthDate} placeholder="생일이 조회됩니다" onChange={ (e)=>{생일변경(e.target.value)} } />
                    <br /><br />
                    성별&nbsp;&nbsp;<input value={회원정보뿌리기.gender} placeholder="성별이 조회됩니다" onChange={ (e)=>{성별변경(e.target.value)} } />
                    <br /><br />
                    사코&nbsp;&nbsp;<input value={회원정보뿌리기.empCode} placeholder="사원코드가 조회됩니다" onChange={ (e)=>{사코변경(e.target.value)} } />
                    <br /><br />
                    부코&nbsp;&nbsp;<input value={회원정보뿌리기.deptCode} placeholder="부서코드는 읽기전용"  readOnly="true" />
                    <br /><br />
                    &nbsp;&nbsp;&nbsp;
                    <button type="button" className="btn btn-warning" onClick={update}>수정</button>&nbsp;&nbsp;
                    <button type="button" className="btn btn-primary" onClick={create}>등록</button>&nbsp;&nbsp;
                    <button type="button" className="btn btn-danger" onClick={remove}>삭제</button>
                </div>
            </div>

            <br /><br />
            부서명&nbsp;&nbsp;
            <select onChange={ (e)=>{changeGrid(e.target.value)} }>
                <option style={{display:"none"}}>=====</option>
                {
                부서목록.map((value,index)=>{
                return(
                <option key={index} value={value.deptCode}>{value.deptName}</option>
                )
                })
                }
            </select>
            {
            그리드상태===true
            ? <div className="grid1">그리드</div>
            : null
            }
            



      

<div className="container" style={{marginLeft:"60%"}}>
  <h3>Colored Progress Bars</h3>
  <p>The contextual classes colors the progress bars:</p> 
  <div className="progress">
    <div className="progress-bar progress-bar-success" role="progressbar" style={{width:"20%", backgroundColor:"hotpink"}}>
      40% Complete (success)
    </div>
  </div>
  </div>
<br />


<div style={{marginLeft:"60%"}}>
    <div class="container">
        <h3>Bordered Table[emp]</h3>
        <p>The .table-bordered class adds borders to a table:사원한명 테이블</p>            
        <table class="table-dark table-striped" style={{marginLeft:"1%", width:"500px"}}>
            <thead>
                <tr>
                <th>사원명</th>
                <th>성별</th>
                <th>생일</th>
                <th>사원코드</th>
                <th>부서코드</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>{회원정보뿌리기.empName}</td>
                <td>{회원정보뿌리기.gender}</td>
                <td>{회원정보뿌리기.birthDate}</td>
                <td>{회원정보뿌리기.empCode}</td>
                <td>{회원정보뿌리기.deptCode}</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
              {
                클릭한사원.map((value,index)=>{
                  return(
                    <div className="gg" key={index}>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                            {value.empName}
                            </div>
                            <div className="col">
                            {value.detailCodeName}
                            </div>
                            <div className="col">
                            {value.birthDate}
                            </div>
                          </div>
                    </div>
                    </div>
                  )
                })
              }
            
        
        {
          그리드상태===true
          ?
          <div className="ag-theme-alpine" style={{height: 400, width: 600, Top:50}} >
          <AgGridReact style={{marginTop:50}} rowData={rowData} columnDefs={columnDefs} rowSelection="multiple" onRowClicked={ (e)=>{onRowClicked(e.data)} } onSelectionChanged={onSelectionChanged}>
          </AgGridReact>
          <button onClick={removeClick}>클릭한행들 삭제</button>
        </div>
          :null
        }
         


        






    </div>
  );
};

const mapStateToProps = state => {
  return {
    status: state.hr.affair.status,
    errorCode: state.hr.affair.errorCode,
    errorMsg: state.hr.affair.errorMsg,
    company: state.hr.affair.company,
    workPlace: state.hr.affair.workPlace,
    positionList: state.hr.affair.positionList,
    empDetailedInfo: state.hr.affair.empDetailedInfo,

  };
};

export default connect(mapStateToProps, { PositionListRequest ,EmpDetailedInfoRequest,  EmpUpdateRequest })(EmpDetailedContainer);
