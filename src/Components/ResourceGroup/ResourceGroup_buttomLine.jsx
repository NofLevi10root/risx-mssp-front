import React from 'react'

import { ReactComponent as IconArrowRight } from '../icons/ico-arrowRight.svg';
import { ReactComponent as IconArrowLeft } from '../icons/ico-arrowLeft.svg';
// import { format_date_type_a } from '../Features/DateFormat.js';
function ResourceGroup_buttomLine({records_number}) {

// const time = new Date()
// const format_date = format_date_type_a(time);
 


    return (
 
<div  className='resource-group-list-buttomLine   '>

<p className='font-type-menu  Color-Grey2  ml-b'>Records: {records_number || 0}</p>

<div className='display-flex mr-c'>
  <button className="btn-type1"><IconArrowLeft className="icon-type1 " />  </button>
  <p className='font-type-menu   Color-Grey2 mr-b ml-b'>Page 1 of 1</p>
  <button className="btn-type1"><IconArrowRight className="icon-type1 " />  </button>
  
  </div>

  {/* <p className='font-type-menu Color-Grey2'>{format_date}</p> */}
 
</div>


    );
  }
  
  export default ResourceGroup_buttomLine;

