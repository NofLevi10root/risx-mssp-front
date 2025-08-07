import React, { useState, useEffect } from "react";
import axios from 'axios';
import GeneralContext from '../../Context';



 const check_and_active_interval_of_python = async(backEndURL,isMainProcessWork,set_isMainProcessWork)=>{ 

console.log("check_and_active_interval_of_python general");
  if (backEndURL == null || backEndURL == undefined || backEndURL == ""){return}
            try{
                const res = await axios.get(`${backEndURL}/process/check-and-active-interval-of-python`);
                if (res){
                  
               if(res){   
                console.log("check_and_active_interval_of_python 123" , res.data);
                set_isMainProcessWork(res.data)
             return  res.data
               }
          
            }}
            catch(err){   console.log(err);}
        }




const kill_interval_of_python = async(backEndURL,isMainProcessWork,set_isMainProcessWork)=>{ 
        console.log("kill_interval_of_python 22");
          if (backEndURL == null || backEndURL == undefined || backEndURL == ""){return}
                    try{
                        const res = await axios.get(`${backEndURL}/process/kill-interval-of-python`);
                        if (res){
                          
                       if(res){   

                        if(res.data?.message === "Process(es) killed successfully."){set_isMainProcessWork(false);   return true     }
                         else { return false }
                        // set_isMainProcessWork(res.data)
               
                       }
                  
                    }}
                    catch(err){   console.log(err); return false}
                }
        


        export { check_and_active_interval_of_python ,kill_interval_of_python};