import React, { useState, useContext, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';

import {
  PopUp_Error,
  PopUp_All_Good,
  PopUp_Are_You_Sure,
  // PopUp_Are_You_Sure
} from "../Components/PopUp_Smart";

import GeneralContext from "../Context";
import axios from "axios";

import { check_and_active_interval_of_python } from "../Components/Features/ProcessFunctions";

function Constantfunctions({ isMainProcessWork, set_isMainProcessWork }) {
  const { backEndURL, user_id, expiryDate } = useContext(GeneralContext);

  // const [isHovered, setIsHovered] = useState(false);

  const [PopUp_Error____show, set_PopUp_Error____show] = useState(false);
  const [PopUp_Error____txt, set_PopUp_Error____txt] = useState({
    HeadLine: "",
    paragraph: "",
    buttonTitle: "",
  });

  const [PopUp_All_Good__show, set_PopUp_All_Good__show] = useState(false);
  const [PopUp_All_Good__txt, set_PopUp_All_Good__txt] = useState({
    HeadLine: "Success",
    paragraph: "successfully",
    buttonTitle: "Close",
  });

  const [PopUp_Are_You_Sure__show, set_PopUp_Are_You_Sure__show] =
    useState(false);
  const [PopUp_Are_You_Sure__txt, set_PopUp_Are_You_Sure__txt] = useState({
    HeadLine: "Are You Sure?",
    paragraph: "The record will be deleted from the system",
    buttonTrue: "True",
    buttonFalse: "False",
  });

  const checkExpiryDate = (expiryDate) => {
    if (expiryDate === undefined || expiryDate === null || expiryDate === "") {
      return;
    }

    function string_to_date(dateString) {
      try {
        const dateStringArray = dateString.split("-");
        const day = dateStringArray[0];
        const month = dateStringArray[1];
        const year = dateStringArray[2];
        const event = new Date(`${month} ${day}, ${year} `);

        return event;
      } catch (err) {
        console.log(err);
        return "error in date";
      }
    }

    const formattedExpiryDate = string_to_date(expiryDate);
    const currentDate = new Date();

    if (currentDate > formattedExpiryDate) {
      set_PopUp_Error____txt({
        HeadLine: "Expired",
        paragraph:
          "This version of Risx MSSP has expired. Please contact us to renew your subscription. Please note that using the software beyond the expiration date is illegal.",
        buttonTitle: "Close",
      });
      set_PopUp_Error____show(true);
    } else {
      console.log("Not yet expired.");
    }
  };

  useEffect(() => {
    checkExpiryDate(expiryDate);
  }, [expiryDate]); // for first load
  useEffect(() => {
    const interval = setInterval(() => {
      checkExpiryDate(expiryDate);
    }, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [expiryDate]); // Set interval to check expiry daily

  const check_main_process_status = async () => {
    if (backEndURL === undefined) {
      return;
    }
    try {
      const res = await axios.get(
        `${backEndURL}/process/check-interval-status`
      );
      if (res) {
        set_isMainProcessWork(res.data);

        console.log("check_main_process_status22", res.data);

        if (res.data === false) {
          console.log("Ineraval is off", res.data);

          set_PopUp_Are_You_Sure__txt({
            HeadLine: "Ineraval is off",
            paragraph: "Do yo want enable it?",
            buttonTrue: "Yes",
            buttonFalse: "No",
          });

          set_PopUp_Are_You_Sure__show(true);
        }
      }
    } catch (err) {
      console.log("check-interval-status", err);
    }
  };

  async function got_to_check_and_active_interval_of_python() {
    const do_active = await check_and_active_interval_of_python(
      backEndURL,
      isMainProcessWork,
      set_isMainProcessWork
    );

    console.log("do_active", do_active);

    if (do_active) {
      console.log("do_active", do_active);
      set_PopUp_Are_You_Sure__show(false);
    } else if (do_active === false) {
      console.log("do_active", do_active);
      set_PopUp_Are_You_Sure__show(false);
      set_PopUp_Error____txt({
        HeadLine: "Failed",
        paragraph: "Failed active VelociraptorInterval.py",
        buttonTitle: "Close",
      });
      set_PopUp_Error____show(true);
    }
  }

  useEffect(() => {
    check_main_process_status();
  }, [backEndURL]); // for first load
  useEffect(() => {
    const interval = setInterval(() => {
      check_main_process_status();
    }, 100000);
    return () => clearInterval(interval);
  }, []); // Set interval to check expiry daily

  const handle_Close_PopUp_Are_You_Sure = () => {
    set_PopUp_Are_You_Sure__show(false);
  };

  const handle_active_interval_process = async () => {
    set_PopUp_Error____txt({
      HeadLine: "Work in Progress..",
      paragraph:
        "Final touches underway; anticipate completion shortly. Stay tuned for updates.",
      buttonTitle: "Close",
    });
    set_PopUp_Error____show(true);
  };

  return (
    <div className="">
      {PopUp_All_Good__show && (
        <PopUp_All_Good
          popUp_show={PopUp_All_Good__show}
          set_popUp_show={set_PopUp_All_Good__show}
          HeadLine={PopUp_All_Good__txt.HeadLine}
          paragraph={PopUp_All_Good__txt.paragraph}
          buttonTitle={PopUp_All_Good__txt.buttonTitle}
        />
      )}

      {PopUp_Error____show && (
        <PopUp_Error
          popUp_show={PopUp_Error____show}
          set_popUp_show={set_PopUp_Error____show}
          HeadLine={PopUp_Error____txt.HeadLine}
          paragraph={PopUp_Error____txt.paragraph}
          buttonTitle={PopUp_Error____txt.buttonTitle}
        />
      )}

      {PopUp_Are_You_Sure__show && (
        <PopUp_Are_You_Sure
          popUp_show={PopUp_Are_You_Sure__show}
          set_popUp_show={set_PopUp_Are_You_Sure__show}
          HeadLine={PopUp_Are_You_Sure__txt.HeadLine}
          paragraph={PopUp_Are_You_Sure__txt.paragraph}
          button_True_text={PopUp_Are_You_Sure__txt.buttonTrue}
          button_False_text={PopUp_Are_You_Sure__txt.buttonFalse}
          True_action={got_to_check_and_active_interval_of_python}
          False_action={handle_Close_PopUp_Are_You_Sure}
        />
      )}
    </div>
  );
}

export default Constantfunctions;

// useEffect(() => {
//   const name = localStorage.getItem('username');

//   if (name) {
//     set_user_name(name);
//   } else {
//     console.log('No username found in local storage.');
//   }
// }, []);

//  const check_and_active_interval_of_python = async()=>{

//   if (backEndURL == null || backEndURL == undefined || backEndURL == ""){return}
//             try{
//                 const res = await axios.get(`${backEndURL}/process/check-and-active-interval-of-python`);
//                 if (res){

//                if(res){
//                 console.log("check_and_active_interval_of_python 123" , res.data);

//                }

//             }}
//             catch(err){   console.log(err);}
//         }
