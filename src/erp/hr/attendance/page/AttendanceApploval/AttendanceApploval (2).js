import React from "react";
import AttdAppl from "./AttdAppl";

//************************* 결제승인관리 시작 _재영 *************************
const AttendanceApploval = (props) => {
  console.log("<< AttendanceApploval.js >>");
  console.log("propspropsprops+++"+props);
  return (    
    console.log("AttendanceApploval리턴값+++"+JSON.stringify(props.attdApplList)),
    <div>
      <AttdAppl 
      searchAttdApplList={props.searchAttdApplList}
      attdApplList={props.attdApplList}
      update={props.update}
      flag={props.flag} />
    </div>
  );
};

export default AttendanceApploval;
//************************* 결제승인관리 종료 _재영 *************************
