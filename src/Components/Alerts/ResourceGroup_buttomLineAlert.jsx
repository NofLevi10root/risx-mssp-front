import React from "react";

import { ReactComponent as IconArrowRight } from "../icons/ico-arrowRight.svg";
import { ReactComponent as IconArrowLeft } from "../icons/ico-arrowLeft.svg";
// import { format_date_type_a } from '../Features/DateFormat.js';
function ResourceGroup_buttomLineAlert({
  records_number,
  ListPartitionIndex,
  setListPartitionIndex,
  AlertName,
}) {
  // const time = new Date()
  // const format_date = format_date_type_a(time);

  const HandleArrowPress = async (Direction) => {
    console.log(ListPartitionIndex);
    const indexCopy = { ...ListPartitionIndex };
    if (indexCopy[AlertName] === undefined) {
      console.log(
        "99999999999999999999999999999999999999hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"
      );

      indexCopy[AlertName] = 0;
    }
    if (Direction) {
      indexCopy[AlertName] += 1;
      if (indexCopy[AlertName] <= Math.ceil(records_number / 20) - 1) {
        console.log("+1");

        setListPartitionIndex(indexCopy);
      }
    } else {
      indexCopy[AlertName] -= 1;
      if (indexCopy[AlertName] >= 0) {
        console.log("-1");
        setListPartitionIndex(indexCopy);
      }
    }
  };

  return (
    <div className="resource-group-list-buttomLine   ">
      <p className="font-type-menu  Color-Grey2  ml-b">
        Records: {records_number || 0}
      </p>

      <div className="display-flex mr-c">
        <button onClick={() => HandleArrowPress(false)} className="btn-type1">
          <IconArrowLeft className="icon-type1 " />{" "}
        </button>
        <p className="font-type-menu   Color-Grey2 mr-b ml-b">
          Page {(ListPartitionIndex[AlertName] ?? 0) + 1} of{" "}
          {Math.ceil(records_number / 20) ?? 1}
        </p>
        <button onClick={() => HandleArrowPress(true)} className="btn-type1">
          <IconArrowRight className="icon-type1 " />{" "}
        </button>
      </div>

      {/* <p className='font-type-menu Color-Grey2'>{format_date}</p> */}
    </div>
  );
}

export default ResourceGroup_buttomLineAlert;
