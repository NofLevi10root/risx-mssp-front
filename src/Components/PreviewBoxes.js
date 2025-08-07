import React, { useState, useEffect, useContext } from "react";
import { ReactComponent as IconLastRun } from "./icons/ico-lastrun.svg";
import { ReactComponent as IconReadMore } from "./icons/ico-readmore.svg";
import { ReactComponent as IcoKey } from "./icons/ico-eye.svg";
import { ReactComponent as IcoModule } from "./icons/ico-module-nonedge-blue.svg";
import { ReactComponent as IcoLink } from "./icons/ico-link-nonedge-blue.svg";
import { ReactComponent as IconMinus } from "./icons/ico-minus.svg";

import { PopUp_For_Read_More } from "./PopUp_Smart.js";

import {
  Make_url_from_id,
  fix_path,
} from "../Components/Dashboards/functions_for_dashboards";

import { format_date_type_a } from "../Components/Features/DateFormat";
import GeneralContext from "../Context";
import { Counter } from "./Features/AnimationCounter.js";
import axios from "axios";
import "./PreviewBoxes.css";
import "./StatusDisplay.css";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip);

//  console.log("tool_id",tool_id);

const time = new Date();
const format_date = format_date_type_a(time);

const getNestedValue = (obj, keyPath) => {
  if (!keyPath) return undefined;
  return keyPath.split(".").reduce((acc, key) => acc && acc[key], obj);
};

// function openInNewTab (toolURL) {
//   const newWindow = window.open(toolURL, '_blank', 'noopener,noreferrer')
//   if (newWindow) newWindow.opener = null
// }

const Handle_active_module = async (tool_id, backEndURL) => {
  try {
    const res = await axios.get(`${backEndURL}/tools/active-module`, {
      params: {
        module_id: tool_id,
      },
    });

    //  set_popUp_all_good____txt({  HeadLine:"Beginning of data processing",paragraph:"This process may take several minutes. The information will be displayed on the 'Results' section." ,buttonTitle:"Ok"})
    //  set_popUp_all_good____show(true)
    if (res.data) {
    }
  } catch (err) {
    console.log(err);
  }
};

const handle_Main_Btn = async (
  tool_id,
  toolURL,
  backEndURL,
  front_IP,
  front_URL
) => {
  // if ( link.includes("${FRONT_IP}")){ const realURl = link.replace("${FRONT_IP}", front_IP);
  //   window.open(  realURl , '_blank');
  //  ;   return }

  //  else if ( link.includes("${FRONT_URL}")){ const realURl = link.replace("${FRONT_URL}", front_URL);
  //   window.open(  realURl , '_blank');
  //  ;   return }

  //  else  { window.open(  link   , '_blank');;   return }

  console.log("handle_Main_Btn toolURL", toolURL);

  const fixed_path = fix_path(toolURL, front_IP, front_URL);

  if (fixed_path && tool_id !== "2001009") {
    window.open(fixed_path, "_blank");
  } else {
    // Get leakCheck api data
    // Work in progress

    const data = await axios.get(`${backEndURL}/config/GetAllLeakAsset`);
    console.log("LeakCheck url ", toolURL + data.data.join(","));
    // const res = await axios.get(`${backEndURL}/config`);
    // console.log(
    //   res?.data?.ClientData?.API?.LeakCheck,
    //   "44444444444444444444444444444444"
    // );

    // console.log("gggggggggggggggg",LeakJson);
  }

  // if(  toolURL.includes("${FRONT_IP}")){
  //   const realURl = toolURL.replace("${FRONT_IP}", front_IP);  openInNewTab(realURl)
  // }

  // else if(  toolURL.includes("${FRONT_URL}")){
  //   const realURl = toolURL.replace("${FRONT_URL}", front_URL);  openInNewTab(realURl)
  // }

  // else{

  //   openInNewTab(toolURL)
  // }

  // console.log("moduleLinks" , moduleLinks);

  // if (tool_id === '2001005') {
  // set_Show_PopUp_before_active_module_id(tool_id)
  // Handle_active_module(tool_id,backEndURL)
  // }
  //  else if (tool_id ===  '2001009') { set_Show_PopUp_tool___Dehashed(true)  }
  // else { }
};

function PreviewBox_type0_static({ BigNumber, text_under_big_number }) {
  return (
    <div
      className={`PreviewBox PreviewBox_static  `}
      // className={`box ${isFocused ? 'focused' : ''}`}
      // is_Filtering
    >
      <div className="PreviewBox_HeadLine"></div>
      <div>
        <div className="PreviewBox_BigNumber     font-type-h1 Color-Blue-Glow">
          {" "}
          <Counter target={BigNumber} isHovered={true} />{" "}
        </div>
        <div className="PreviewBox_SmallNumber   font-type-txt Color-Blue-Glow mr-a">
          {text_under_big_number}
        </div>
      </div>
      <div className="PreviewBox_ButtomLine"></div> {/*dont delete */}
    </div>
  );
}

function PreviewBox_type1_number({
  HeadLine,
  BigNumber,
  SmallNumber,
  StatusColor,
  date,
  resource_type_id,
  filter_Resource,
  set_filter_Resource,
  SmallNumberTxt,
  is_popup,
  txt_color,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [is_Filtering, set_is_Filtering] = useState(false);

  useEffect(() => {
    if (filter_Resource?.type_ids?.length === 0) {
      set_is_Filtering(false);
    }
  }, [filter_Resource]);

  const handle_filter_by_Type = (id) => {
    if (id === null || id === undefined) {
      set_filter_Resource({ type_ids: [], tool_ids: [] });

      return;
    } else {
      const found = filter_Resource.type_ids.find((ids) => ids === id);

      if (found === undefined) {
        const stayAsYouR = filter_Resource.tool_ids;
        set_filter_Resource({
          type_ids: [...filter_Resource.type_ids, id],
          tool_ids: stayAsYouR,
        });
        set_is_Filtering(true);
        // set_clear_all_btns_filter_preview(false)

        return;
      } else if (found === id) {
        // const index = filter_Resource.type_ids.indexOf(id);
        const filterd = filter_Resource.type_ids.filter(
          (element) => element !== id
        );
        const stayAsYouR = filter_Resource.tool_ids;
        set_filter_Resource({ type_ids: filterd, tool_ids: stayAsYouR });
        set_is_Filtering(false);

        return;
      }
    }
  };

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleLeave = () => {
    setIsHovered(false);
  };

  const StatusColorClass =
    StatusColor.toLowerCase() === "critical"
      ? "Bg-Red"
      : StatusColor.toLowerCase() === "high"
      ? "Bg-Orange-Red"
      : StatusColor.toLowerCase() === "medium"
      ? "Bg-Orange"
      : StatusColor.toLowerCase() === "low"
      ? "Bg-Yellow"
      : StatusColor === "red"
      ? "Bg-Red"
      : StatusColor === "blue"
      ? "Bg-Blue-Glow"
      : StatusColor == ""
      ? "Bg-Grey2"
      : StatusColor == undefined
      ? "Bg-Grey2"
      : "Bg-Grey2";

  return (
    <div
      className={`PreviewBox PreviewBox_for_type_count ${
        is_Filtering ? "PreviewBox_Filtering" : ""
      }  ${is_popup ? "PreviewBox-of-pop-up" : ""}`}
      // className={`box ${isFocused ? 'focused' : ''}`}
      // is_Filtering
      onClick={() => {
        handle_filter_by_Type(resource_type_id);
      }}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <div className="PreviewBox_HeadLine">
        <p className="font-type-menu">{HeadLine}</p>
        <div
          className={`${StatusColorClass}  light-bulb-type1`}
          style={{ backgroundColor: isHovered ? "#00DBFF" : txt_color || "" }}
        />
      </div>
      <div>
        <div className="PreviewBox_BigNumber     font-type-h1 Color-White">
          {" "}
          <Counter
            target={BigNumber}
            isHovered={isHovered}
            txt_color={txt_color}
          />{" "}
        </div>
        {SmallNumberTxt !== "" && (
          <div
            className="PreviewBox_SmallNumber   font-type-txt Color-White"
            style={{ color: isHovered ? "#00DBFF" : txt_color || "" }}
          >
            {SmallNumberTxt}: {SmallNumber}
          </div>
        )}
      </div>
      <div
        className="PreviewBox_ButtomLine"

        //  style={{  visibility: date === "NA" &&  'hidden' }}
      >
        <IconLastRun />
        <div className="font-type-very-sml-txt ">{date}</div>
      </div>{" "}
      {/*dont delete */}
    </div>
  );
}

function PreviewBox_type1_number_no_filters({
  HeadLine,
  BigNumber,
  SmallNumber,
  StatusColor,
  date,
  SmallNumberTxt,
  is_popup,

  txt_color,
  display_this,
  set_display_this,
  display_this_value,
}) {
  const dont_display_color = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--color-Grey2");
  const [isHovered, setIsHovered] = useState(false);
  const [is_Filtering, set_is_Filtering] = useState(false);

  const handle_click = () => {
    if (display_this === display_this_value) {
      set_display_this("prime_data");
    } else {
      set_display_this(display_this_value);
    }
  };

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleLeave = () => {
    setIsHovered(false);
  };

  const StatusColorClass =
    StatusColor.toLowerCase() === "critical"
      ? "alert-bg-color-critical"
      : StatusColor.toLowerCase() === "high"
      ? "alert-bg-color-high"
      : StatusColor.toLowerCase() === "medium"
      ? "alert-bg-color-medium"
      : StatusColor.toLowerCase() === "low"
      ? "alert-bg-color-low"
      : StatusColor.toLowerCase() === "all-good"
      ? "alert-bg-color-no-alert"
      : StatusColor === "red"
      ? "Bg-Red"
      : StatusColor === "blue"
      ? "Bg-Blue-Glow"
      : StatusColor === "green"
      ? "alert-bg-color-no-alert"
      : StatusColor == ""
      ? "alert-bg-color-none"
      : StatusColor == undefined
      ? "alert-bg-color-none"
      : "alert-bg-color-none";

  return (
    <div
      className={`PreviewBox PreviewBox_for_type_count ${
        is_Filtering ? "PreviewBox_Filtering" : ""
      }  ${is_popup ? "PreviewBox-of-pop-up" : ""}`}
      onClick={handle_click}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      style={{ width: "12%", minWidth: "180px" }}
    >
      <div className="PreviewBox_HeadLine">
        <p className="font-type-menu">{HeadLine}</p>

        <div
          className={`${StatusColorClass}  light-bulb-type1`}
          style={{ backgroundColor: isHovered ? "#00DBFF" : txt_color || "" }}
        />
      </div>
      <div>
        <div className="PreviewBox_BigNumber     font-type-h1 Color-White">
          <Counter
            target={BigNumber}
            isHovered={isHovered}
            txt_color={txt_color}
          />
        </div>

        {
          (SmallNumberTxt = !"" && (
            <div
              className="PreviewBox_SmallNumber   font-type-txt Color-White"
              style={{
                color: isHovered
                  ? "#00DBFF"
                  : BigNumber === "NA"
                  ? dont_display_color
                  : txt_color || "",
              }}
            >
              {SmallNumberTxt}
              {SmallNumber && ": "}
              {SmallNumber}
            </div>
          ))
        }
      </div>
      <div
        className="PreviewBox_ButtomLine"
        style={{ visibility: date === "NA" && "hidden" }}
      >
        <IconLastRun />
        <div className="font-type-very-sml-txt ">{date}</div>
      </div>{" "}
      {/*dont delete */}
    </div>
  );
}

function PreviewBox_type2_pie({
  colors,
  HeadLine,
  bar_numbers,
  bar_headlines,
  bar_title_legend,
  is_popup,
  enable_hover,
  display_this,
  set_display_this,
  display_this_value,
  minWidth,
}) {
  const [display_data, set_display_data] = useState(false);
  const [has_data, set_has_data] = useState(false);

  const handle_click = () => {
    if (set_display_this === undefined) {
      return;
    }
    if (display_this === display_this_value) {
      set_display_this("prime_data");
    } else {
      set_display_this(display_this_value);
    }
  };

  const BasicColors = bar_numbers.map((item, index, array) => {
    const alpha = (index + 1) / array.length; // Calculate alpha based on the item's position
    return `rgba(0, 219, 255, ${alpha})`; // Return red with calculated transparency
  });

  const AlertColors = [
    getComputedStyle(document.documentElement).getPropertyValue(
      "--alert-color-critical"
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      "--alert-color-high"
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      "--alert-color-medium"
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      "--alert-color-low"
    ),
  ];

  const dont_display_color = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--color-Grey2");

  // const bar_numbers_zero = [1]

  useEffect(() => {
    let sum = 0;

    for (let i = 0; i < bar_numbers.length; i++) {
      // console.log(bar_numbers[i]);
      sum += bar_numbers[i];
    }

    if (sum === 0) {
      set_has_data(false);
    } else {
      set_has_data(true);
    }
  }, [bar_numbers]);

  useEffect(() => {
    if (
      Array.isArray(bar_numbers) &&
      bar_numbers.length === 1 &&
      bar_numbers[0] === "NA"
      //  &&
      // Array.isArray(bar_headlines) &&
      // bar_headlines.length === 1 &&
      // bar_headlines[0] === "NA"
    ) {
      set_display_data(false);
    } else if (
      bar_numbers.length > 1 &&
      bar_numbers.every((item) => item === "NA")
    ) {
      set_display_data(false);
      console.log(HeadLine, "its more then 1 everybody id NA ", bar_numbers);
    } else {
      set_display_data(true);
    }
  }, [bar_numbers, bar_headlines]);

  const data = {
    // labels: ['Yes', 'No'],
    labels: bar_headlines,
    // labels:   all_Resource_Types.map(item => item.resource_type_name),
    datasets: [
      {
        label: bar_title_legend,
        // data: bar_numbers,
        // data: bar_numbers_zero,
        data: display_data === false ? [1] : has_data ? bar_numbers : [1],
        backgroundColor: (() => {
          if (display_data === false || has_data === false) {
            return dont_display_color;
          } else if (colors === "Basic") {
            return BasicColors;
          } else if (colors === "Alert") {
            return AlertColors;
          } else {
            return BasicColors; // default case
          }
        })(),
        borderWidth: 0,
        // style={{opacity:   (index +1) / all_Resource_Types.length   }} />
      },
    ],
  };

  const options = {
    cutout: 15,
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  };
  return (
    <div
      className={`PreviewBox PreviewBox-twice-size ${
        is_popup ? "PreviewBox-of-pop-up" : ""
      }  ${enable_hover ? "PreviewBox_for_type_count" : ""}`}
      style={{ minWidth: minWidth && minWidth }}
      onClick={handle_click}
    >
      <div className="PreviewBox_HeadLine">
        {" "}
        <p className="font-type-menu">{HeadLine}</p>{" "}
      </div>

      <div
        className="display-flex   justify-content-space-between"
        style={{ height: "100%" }}
      >
        <div
          className="display-flex  "
          style={{ width: "100%", height: "158px", justifyContent: "center" }}
        >
          <Doughnut data={data} options={options}></Doughnut>
          {/* <Doughnut  data={has_data ? data : data}  options={options}  ></Doughnut> */}
        </div>

        <div
          className="display-flex  justify-content-center  "
          style={{ width: "100%", gap: "2px" }}
        >
          {display_data && (
            <>
              <div
                className="display-flex flex-direction-column justify-content-center  "
                style={{ marginRight: "10px", gap: "2px" }}
              >
                {Array.isArray(bar_headlines) &&
                  bar_headlines?.map((Info, index) => {
                    return (
                      <div
                        className="display-flex"
                        style={{ marginRight: "auto" }}
                        key={index}
                      >
                        {colors === "Basic" && (
                          <div
                            className={` Bg-Blue-Glow light-bulb-type1 mr-a`}
                            style={{
                              opacity: (index + 1) / bar_headlines.length,
                            }}
                          />
                        )}
                        {colors === "Alert" && (
                          <div
                            className={` Bg-Blue-Glow light-bulb-type1 mr-a`}
                            style={{ backgroundColor: AlertColors[index] }}
                          />
                        )}
                        <p
                          className="   font-type-txt Color-White  "
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            // width: 'auto', // or any fixed width or max-width you prefer
                            // maxWidth:"100px",
                            // minWidth:"160px"
                          }}
                        >
                          {Info}{" "}
                        </p>
                      </div>
                    );
                  })}
              </div>

              <div
                className="display-flex flex-direction-column   "
                style={{ gap: "2px" }}
              >
                {Array.isArray(bar_numbers) &&
                  bar_numbers?.map((Info, index) => {
                    return (
                      <div
                        className="display-flex"
                        style={{ marginLeft: "auto" }}
                        key={index}
                      >
                        <p className="   font-type-txt Color-White  ">
                          {" "}
                          {Info}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}

          {!display_data && (
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p className="font-type-h4 Color-Grey2" style={{}}>
                No Records
              </p>{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewBox_type3_bar({
  HeadLine,
  bar_numbers,
  bar_headlines,
  bar_title_legend,
  is_popup,
  display_y_axis,
  colors,
  enable_hover,
  display_this,
  set_display_this,
  display_this_value,
}) {
  const [display_data, set_display_data] = useState(false);

  const BasicColors = bar_numbers.map((item, index, array) => {
    const alpha = (index + 1) / array.length; // Calculate alpha based on the item's position
    return `rgba(0, 219, 255, ${alpha})`; // Return red with calculated transparency
  });

  const AlertColors = [
    getComputedStyle(document.documentElement).getPropertyValue(
      "--alert-color-critical"
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      "--alert-color-high"
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      "--alert-color-medium"
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      "--alert-color-low"
    ),
  ];

  useEffect(() => {
    // console.log(HeadLine,"Array.isArray(bar_numbers) ",Array.isArray(bar_numbers) );
    // console.log(HeadLine,"bar_numbers.length) ",bar_numbers.length === 1 );
    // console.log(HeadLine,"bar_numbers[0] === NA",bar_numbers[0] === "NA"  );
    // console.log(HeadLine,"Array.isArray(bar_headlines)",Array.isArray(bar_headlines)  );
    // console.log(HeadLine," bar_headlines.length === 1", bar_headlines.length === 1  );
    // console.log(HeadLine,"bar_headlines[0] === NA",bar_headlines[0] === "NA" );
    // console.log(HeadLine," bar_numbers", bar_numbers);

    if (
      Array.isArray(bar_numbers) &&
      bar_numbers.length === 1 &&
      bar_numbers[0] === "NA" &&
      Array.isArray(bar_headlines) &&
      bar_headlines.length === 1 &&
      bar_headlines[0] === "NA"
    ) {
      set_display_data(false);
    } else {
      set_display_data(true);
    }
  }, [bar_numbers, bar_headlines]);

  const handle_click = () => {
    if (set_display_this === undefined) {
      return;
    }

    if (display_this === display_this_value) {
      set_display_this("prime_data");
    } else {
      set_display_this(display_this_value);
    }
  };

  const data = {
    // labels: ['Yes', 'No'],
    labels: bar_headlines,
    // labels:   all_Resource_Types.map(item => item.resource_type_name),
    datasets: [
      {
        label: bar_title_legend,
        data: bar_numbers,
        backgroundColor:
          display_data === false
            ? "grey"
            : (() => {
                if (colors === "Basic") {
                  return BasicColors;
                } else if (colors === "Alert") {
                  return AlertColors;
                } else {
                  return BasicColors; // default case
                }
              })(),
        borderWidth: 0,
        borderRadius: 100,
        barPercentage: 1.0,
        // barThickness:30,
        categoryPercentage: 1,
        // style={{opacity:   (index +1) / all_Resource_Types.length   }} />
      },
    ],
  };

  const options = {
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },

    scales: {
      x: {
        display: false,
        grid: {
          display: false,
          categoryPercentage: 1.0, // Adjust the space between categories/bars
          barPercentage: 1.0, // Ensure bars are 10% of the category width
        },
      },
      y: {
        display: display_y_axis,
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "#E5E5E5",
          precision: 0, // Display only full numbers (integers)
        },
      },
    },

    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      className={`PreviewBox PreviewBox-twice-size ${
        is_popup ? "PreviewBox-of-pop-up" : ""
      }  ${enable_hover ? "PreviewBox_for_type_count" : ""}`}
      onClick={handle_click}
    >
      {/* <div className={`PreviewBox PreviewBox-twice-size ${is_popup ? "PreviewBox-of-pop-up" : ""}`}> */}

      <div className="PreviewBox_HeadLine">
        {" "}
        <p className="font-type-menu">{HeadLine}</p>{" "}
      </div>

      {display_data && (
        <div
          className="display-flex justify-content-space-between"
          style={{
            height: "100%",
            paddingRight: "20px",
            paddingLeft: "20px",
            gap: "20px",
            overflowX: "hidden",
            maxWidth: "100%",
          }}
        >
          <div
            className="display-flex"
            style={{
              height: "170px",
              maxHeight: "170px",
              flexGrow: 1,
              overflow: "hidden",
              minWidth: "50%",
            }}
          >
            <Bar
              data={data}
              options={options}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div
            className="display-flex justify-content-center"
            style={{ width: "auto", gap: "2px" }}
          >
            <div
              className="display-flex flex-direction-column justify-content-center"
              style={{ marginRight: "10px", gap: "2px" }}
            >
              {Array.isArray(bar_headlines) &&
                bar_headlines.map((Info, index) => (
                  <div
                    className="display-flex"
                    style={{ marginRight: "auto" }}
                    key={index}
                  >
                    {colors === "Basic" && (
                      <div
                        className={`Bg-Blue-Glow light-bulb-type1 mr-a`}
                        style={{ opacity: (index + 1) / bar_headlines.length }}
                      />
                    )}
                    {colors === "Alert" && (
                      <div
                        className={`Bg-Blue-Glow light-bulb-type1 mr-a`}
                        style={{ backgroundColor: AlertColors[index] }}
                      />
                    )}
                    <p
                      className="font-type-txt Color-White"
                      style={{ width: "max-content" }}
                    >
                      {Info}
                    </p>
                  </div>
                ))}
            </div>

            <div
              className="display-flex flex-direction-column"
              style={{ gap: "2px" }}
            >
              {Array.isArray(bar_numbers) &&
                bar_numbers.map((Info, index) => (
                  <div
                    className="display-flex"
                    style={{ marginLeft: "auto" }}
                    key={index}
                  >
                    <p className="font-type-txt Color-White">{Info}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {!display_data && (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p className="font-type-h4 Color-Grey2" style={{}}>
            No Records
          </p>{" "}
        </div>
      )}
    </div>
  );
}

function PreviewBox_type4_legend2({ HeadLine, Status_Legend }) {
  const inProgress_combined =
    Status_Legend?.inProgress_InTime_Count +
    Status_Legend?.inProgress_not_InTime_Count;

  // const process_height = 16;
  // const process_width = 66;

  const statuses = [
    {
      count: Status_Legend?.completed_InTime_Count,
      label: "Complete",
      description: "",
      bar: "finish",
      time_text: "",
      error_note: false,
    },
    {
      count: Status_Legend?.completed_not_InTime_Count,
      label: "Complete*",
      description: "(Delayed)",
      bar: "finish",
      time_text: "+1 Day",
      error_note: true,
    },

    {
      count: inProgress_combined,
      label: "In Progress",
      description: "(On-time & Delayed)",
      bar: "half",
      time_text: "",
      error_note: false,
    },

    // { count: Status_Legend?.inProgress_InTime_Count,    label: 'In Progress',     description:"", bar: 'half', time_text:""   ,error_note:false},
    // { count: Status_Legend?.inProgress_not_InTime_Count,label: 'In Progress*',    description:"(not in time)",bar: 'half', time_text:"+15 Days" ,error_note:true},

    {
      count: Status_Legend?.hunt_InTime_Count,
      label: "Hunting",
      description: "",
      bar: "half",
      time_text: "",
      error_note: false,
    },
    {
      count: Status_Legend?.hunt_not_InTime_Count,
      label: "Hunting*",
      description: "(Delayed)",
      bar: "half",
      time_text: "+2 Hrs",
      error_note: true,
    },

    {
      count: Status_Legend?.Failed_Count,
      label: "Failed",
      description: "",
      bar: "failed",
      time_text: "",
      error_note: false,
    },
  ];

  return (
    <div className="PreviewBox PreviewBox-twice-size" style={{}}>
      <div className="PreviewBox_HeadLine">
        <p className="font-type-menu">{HeadLine}</p>
      </div>

      <div className="status-table">
        {statuses.map((status, index) => (
          <div key={index} className="status-row">
            <div className="font-type-txt Color-Grey1  status-count">
              {status?.count}
            </div>
            <div className="font-type-txt Color-White status-label">
              {status?.label}{" "}
              <span className="font-type-txt Color-Grey1">
                {status?.description}{" "}
              </span>
            </div>

            <div className="status-bar-and-time">
              <div className="status-bar">
                <div className={`status-bar-fill ${status?.bar}`} />
              </div>
              <div
                className={`font-type-txt   time-general  ${
                  status.error_note === true ? "not-in-time" : "in-time"
                }  `}
              >
                {status?.time_text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewBox_type5_hunt_data_tabla({
  BaseLine,
  HeadLine,
  is_popup,
  Artifact,
  HuntID,
  Status,
  Error,
  StartDate,
  artifact_or_module,
}) {
  const height_key_value = "18px";

  // BaseLine
  return (
    <div
      className={`PreviewBox PreviewBox-twice-size ${
        is_popup ? "PreviewBox-of-pop-up" : ""
      }`}
    >
      <div className="PreviewBox_HeadLine">
        <p className="font-type-menu  mb-c">{HeadLine}</p>
      </div>
      <div
        className=" "
        style={{ display: "flex", height: "100%", marginBottom: "auto" }}
      >
        <div
          className="display-flex flex-direction-column pop-up-basic-data pop-up-basic-data-keys mr-b"
          style={{ gap: "6px" }}
        >
          <p
            className="font-type-menu Color-White"
            style={{ height: height_key_value }}
          >
            {artifact_or_module}
          </p>
          <p
            className="font-type-menu Color-White"
            style={{ height: height_key_value }}
          >
            Start Date
          </p>
          <p
            className="font-type-menu Color-White"
            style={{ height: height_key_value }}
          >
            Hunt ID
          </p>
          <p
            className="font-type-menu Color-White"
            style={{ height: height_key_value }}
          >
            Status
          </p>
          <p
            className="font-type-menu Color-White"
            style={{ height: height_key_value }}
          >
            Error
          </p>
          {BaseLine && (
            <p
              className="font-type-menu Color-White"
              style={{ height: height_key_value }}
            >
              BaseLine
            </p>
          )}
        </div>

        <div
          className="display-flex flex-direction-column pop-up-basic-data pop-up-basic-data-values"
          style={{ gap: "6px" }}
        >
          <p
            className="font-type-txt Color-Grey1"
            style={{ height: height_key_value }}
          >
            {Artifact}
          </p>
          <p
            className="font-type-txt Color-Grey1"
            style={{ height: height_key_value }}
          >
            {StartDate}
          </p>
          <p
            className="font-type-txt Color-Grey1"
            style={{ height: height_key_value }}
          >
            {HuntID}
          </p>

          <p
            className="font-type-txt Color-Grey1"
            style={{ height: height_key_value }}
          >
            {Status}
          </p>
          <p
            className="font-type-txt Color-Grey1"
            style={{ height: height_key_value }}
          >
            {Error}
          </p>
          {BaseLine && (
            <p
              className="font-type-txt Color-Grey1"
              style={{
                height: "auto", // If you need a specific height, you can keep this; otherwise, remove it
                whiteSpace: "normal", // Allows the text to wrap to the next line
                overflowWrap: "break-word", // Ensures long words break and wrap within the container
                wordBreak: "break-word", // Breaks long words that exceed the container width
                margin: 0, // Optional: Removes default margin if needed
                padding: 0, // Optional: Removes default padding if needed
              }}
            >
              {BaseLine}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewBox_type9_arguments({ HeadLine, is_popup, Arguments }) {
  console.log("Arguments", Arguments);

  const keyStyle = { width: "150px", minWidth: "150px" };

  const LineStyle = {
    // maxHeight: "20px",
    display: "flex",
    transition: "height 0.3s ease",
    marginTop: "calc(var(--space-a)/1 )",
  };

  const renderArguments = () => {
    if (!Arguments || Object.keys(Arguments).length === 0) return null;

    return (
      <>
        {Object.entries(Arguments).map(([key, value]) => (
          <div
            key={key}
            style={{
              ...LineStyle,
              marginTop: "",
              gap: "5px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p
              className="font-type-menu reading-height Color-Grey1"
              style={{ ...keyStyle }}
            >
              {key}:
            </p>
            <p
              className="font-type-txt reading-height Color-Grey1 mb-a"
              // style={firstValueStayle}
            >
              {typeof value === "object" && value !== null
                ? JSON.stringify(value, null, 2)
                : value}
            </p>
          </div>
        ))}
      </>
    );
  };

  const height_key_value = "18px";
  return (
    <div
      className={`PreviewBox PreviewBox-twice-size ${
        is_popup ? "PreviewBox-of-pop-up" : ""
      }`}
    >
      <div className="PreviewBox_HeadLine">
        <p className="font-type-menu mb-c">{HeadLine}</p>
      </div>
      <div className=" " style={{ height: "100%", overflowX: "hidden" }}>
        {renderArguments()}

        {/* <div className='display-flex flex-direction-column pop-up-basic-data pop-up-basic-data-keys mr-b' style={{  gap: "6px"  }}>
                                  <p className='font-type-menu Color-White' style={{height: height_key_value}}>Hunt ID</p>
                              </div>
      
                              <div className='display-flex flex-direction-column pop-up-basic-data pop-up-basic-data-values' style={{ gap: "6px" }}>
                                  <p className='font-type-txt Color-White' style={{height: height_key_value}}>{renderArguments()}</p>
                              </div> */}
      </div>
    </div>
  );
}

function PreviewBox_type6_list_box({
  HeadLine,
  is_popup,
  enable_hover,
  list_array_column2,
  list_array_column1,
  list_array,

  is_tags,
}) {
  const [display_data, set_display_data] = useState(false);

  const handle_click = () => {
    console.log("click on PreviewBox_type6_list_box");
  };

  useEffect(() => {
    // console.log(HeadLine,"list_array",list_array, list_array.length === 0 ,  );
    // set_display_data(true);
    // console.log(HeadLine,"Array.isArray(bar_numbers) ",Array.isArray(bar_numbers) );
    // console.log(HeadLine,"bar_numbers.length) ",bar_numbers.length === 1 );
    // console.log(HeadLine,"bar_numbers[0] === NA",bar_numbers[0] === "NA"  );
    // console.log(HeadLine,"Array.isArray(bar_headlines)",Array.isArray(bar_headlines)  );
    // console.log(HeadLine," bar_headlines.length === 1", bar_headlines.length === 1  );
    // console.log(HeadLine,"bar_headlines[0] === NA",bar_headlines[0] === "NA" );
    // console.log(HeadLine," bar_numbers", bar_numbers);

    if (
      Array.isArray(list_array) &&
      list_array.length === 0

      // Array.isArray(bar_headlines) &&

      //  &&
      // Array.isArray(bar_headlines) &&
      // bar_headlines.length === 1 &&
      // bar_headlines[0] === "NA"
    ) {
      console.log(HeadLine, "111111111111111111");
      set_display_data(true);
    } else if (
      Array.isArray(list_array) &&
      list_array.length === 1 &&
      list_array[0] === "NA"
      //  &&
      // Array.isArray(bar_headlines) &&
      // bar_headlines.length === 1 &&
      // bar_headlines[0] === "NA"
    ) {
      console.log(HeadLine, "22222222222222222");
      set_display_data(false);
    } else if (
      list_array.length > 1 &&
      list_array.every((item) => item === "NA")
    ) {
      set_display_data(false);
      console.log(HeadLine, "its more then 1 everybody id NA ", list_array);
      console.log(HeadLine, "33333333333333333");
    } else {
      set_display_data(true);
      console.log(HeadLine, "4444444444444444444");
    }
  }, [list_array]);

  console.log(HeadLine, "list_array", list_array);
  console.log(HeadLine, "list_array.length", list_array.length);

  return (
    <div
      className={`PreviewBox ${is_popup ? "PreviewBox-of-pop-up" : ""} ${
        enable_hover ? "PreviewBox_for_type_count" : ""
      }`}
      style={{ overflow: "hidden" }}
      onClick={handle_click}
    >
      <div className="PreviewBox_HeadLine ">
        <p className="font-type-menu">{HeadLine}</p>
      </div>
      {list_array.length != 0 && display_data && (
        <div
          className="table-container"
          style={{
            height: "calc(100% - 20px)",
            overflowY: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              //  borderCollapse: 'collapse'
            }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "var(--color-Grey5)",
                zIndex: 1,
              }}
            >
              <tr style={{ textAlign: "left", height: "30px" }}>
                <th className="font-type-menu Color-Grey1" style={{}}>
                  {list_array_column1?.previewName}
                </th>
                <th
                  className="font-type-menu Color-Grey1"
                  style={{ textAlign: "right", paddingRight: "5px" }}
                >
                  {list_array_column2?.previewName}
                </th>
              </tr>
            </thead>
            <tbody
              style={{
                overflowY: "auto",
                //  maxHeight: 'calc(100% - 40px)'
              }}
            >
              {list_array?.map((item, index) => (
                <tr key={index}>
                  {is_tags ? (
                    <td
                      className="font-type-txt  font-type-txt   Color-Blue-Glow tagit_type1"
                      style={{}}
                    >
                      {item[list_array_column1?.key]}
                    </td>
                  ) : (
                    <td className="font-type-txt Color-Grey1 " style={{}}>
                      {item[list_array_column1?.key]}
                    </td>
                  )}
                  <td
                    className="font-type-txt Color-White "
                    style={{ textAlign: "right", paddingRight: "5px" }}
                  >
                    {item[list_array_column2?.key]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* {HeadLine} */}

      {!display_data && (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p className="font-type-h2 Color-Grey2" style={{}}>
            NA
          </p>

          {list_array.length === 0 && display_data && (
            <p
              className="font-type-h4  Color-Grey2"
              style={
                {
                  // textAlign:"center"
                  // color: isHovered ? "#00DBFF" : (txt_color || color),
                  // transition: "color 0.15s ease-in-out",
                }
              }
            >
              No Records
            </p>
          )}
        </div>
      )}

      {list_array.length === 0 && display_data && (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            className="font-type-h4  Color-Grey2"
            style={
              {
                // textAlign:"center"
                // color: isHovered ? "#00DBFF" : (txt_color || color),
                // transition: "color 0.15s ease-in-out",
              }
            }
          >
            No Records
          </p>
        </div>
      )}
    </div>
  );
}

function PreviewBox_type7_wide_bar({
  HeadLine,
  is_popup,
  enable_hover,
  list_array_column2,
  list_array_column1,
  list_array,
}) {
  const [display_data, set_display_data] = useState(false);

  useEffect(() => {
    if (Array.isArray(list_array) && list_array.length === 0) {
      console.log(HeadLine, "111111111111111111");
      set_display_data(true);
    } else if (
      Array.isArray(list_array) &&
      list_array.length === 1 &&
      list_array[0] === "NA"
    ) {
      console.log(HeadLine, "22222222222222222");
      set_display_data(false);
    } else if (
      list_array.length > 1 &&
      list_array.every((item) => item === "NA")
    ) {
      set_display_data(false);
      console.log(HeadLine, "its more then 1 everybody id NA ", list_array);
      console.log(HeadLine, "33333333333333333");
    } else {
      set_display_data(true);
      console.log(HeadLine, "4444444444444444444");
    }
  }, [list_array]);

  const handle_click = () => {
    console.log("click on PreviewBox_type6_list_box");
  };

  // Find the maximum value in the right column
  const maxRightValue = Math.max(
    ...list_array.map((item) => item[list_array_column2?.key])
  );

  return (
    <div
      className={`PreviewBox ${is_popup ? "PreviewBox-of-pop-up" : ""} ${
        enable_hover ? "PreviewBox_for_type_count" : ""
      }`}
      style={{ overflow: "hidden" }}
      onClick={handle_click}
    >
      <div className="PreviewBox_HeadLine">
        <p className="font-type-menu">{HeadLine}</p>
      </div>

      <div
        className="table-container"
        style={{
          height: "calc(100% - 20px)",

          overflowY: "auto",
          paddingRight: "var(--space-a)",
        }}
      >
        <table style={{ width: "100%" }}>
          <thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "var(--color-Grey5)",
              zIndex: 1,
            }}
          >
            <tr style={{ textAlign: "left", height: "30px" }}>
              <th
                className="font-type-menu Color-Grey1"
                style={{ paddingRight: "var(--space-b)" }}
              >
                {list_array_column1?.previewName}
              </th>
              <th
                className="font-type-menu Color-Grey1"
                style={{ textAlign: "left", paddingRight: "var(--space-a)" }}
              >
                {list_array_column2?.previewName}
              </th>
            </tr>
          </thead>
          <tbody style={{ overflowY: "auto" }}>
            {list_array?.map((item, index) => {
              const rightValue = item[list_array_column2?.key];
              const barWidth = (rightValue / maxRightValue) * 100;

              return (
                <tr key={index}>
                  <td
                    className="font-type-txt Color-Grey1"
                    style={{
                      width: "auto",
                      paddingRight: "var(--space-b)",
                      textWrap: "nowrap",
                    }}
                  >
                    {item[list_array_column1?.key]}
                  </td>
                  <td
                    className="font-type-txt Color-Grey1"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      paddingRight: "var(--space-a)",
                    }}
                  >
                    <div
                      className="font-type-txt Color-Blue-Glow like_tagit_for_wide_bar "
                      style={{ width: `${barWidth}%`, textAlign: "left" }}
                    >
                      {/* {item[list_array_column1?.key]}  */}
                      {/* Color-Blue-Glow tagit_type1 */}

                      {rightValue}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PreviewBox_type8_time({
  HeadLine,
  BigNumber,
  SmallNumber,
  StatusColor,
  date,
  is_popup,
  txt_color,
  display_this,
  set_display_this,
  display_this_value,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [is_Filtering, set_is_Filtering] = useState(false);

  const handle_click = () => {
    if (display_this === display_this_value) {
      set_display_this("prime_data");
    } else {
      set_display_this(display_this_value);
    }
  };

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleLeave = () => {
    setIsHovered(false);
  };

  const [showColon, setShowColon] = useState(true);

  const [timeString, setTimeString] = useState(BigNumber);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowColon((prevShowColon) => !prevShowColon);
    }, 500); // Interval duration in milliseconds

    return () => clearInterval(interval); // Cleanup function to clear interval
  }, []);

  // Update timeString whenever showColon changes
  // useEffect(() => {
  //   setTimeString(BigNumber.replace(':', showColon ? ':' : ''));
  // }, [showColon, BigNumber]);

  const StatusColorClass =
    StatusColor.toLowerCase() === "critical"
      ? "alert-bg-color-critical"
      : StatusColor.toLowerCase() === "high"
      ? "alert-bg-color-high"
      : StatusColor.toLowerCase() === "medium"
      ? "alert-bg-color-medium"
      : StatusColor.toLowerCase() === "low"
      ? "alert-bg-color-low"
      : StatusColor.toLowerCase() === "all-good"
      ? "alert-bg-color-no-alert"
      : StatusColor === "red"
      ? "Bg-Red"
      : StatusColor === "blue"
      ? "Bg-Blue-Glow"
      : StatusColor === "yellow"
      ? "Bg-Yellow"
      : StatusColor === "green"
      ? "alert-bg-color-no-alert"
      : StatusColor == ""
      ? "alert-bg-color-none"
      : StatusColor == undefined
      ? "alert-bg-color-none"
      : "alert-bg-color-none";

  return (
    <div
      className={`PreviewBox PreviewBox_for_type_count ${
        is_Filtering ? "PreviewBox_Filtering" : ""
      }  ${is_popup ? "PreviewBox-of-pop-up" : ""}`}
      onClick={handle_click}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <div className="PreviewBox_HeadLine">
        <p className="font-type-menu">{HeadLine}</p>

        <div
          className={`${StatusColorClass}  light-bulb-type1`}
          style={{ backgroundColor: isHovered ? "#00DBFF" : txt_color || "" }}
        />
      </div>
      <div>
        <div
          className="PreviewBox_BigNumber   PreviewBox_BigDate  font-type-h1 Color-White"
          style={{
            display: "flex",
            justifyContent: "center",
            color: isHovered ? "#00DBFF" : txt_color || "",
          }}
        >
          {BigNumber?.slice(0, 2)}{" "}
          <p
            className="  "
            style={{
              color: isHovered ? "#00DBFF" : txt_color || "",
              width: "14px",
            }}
          >
            {showColon ? ":" : "  "}
          </p>
          {BigNumber?.slice(3, 5)}{" "}
        </div>
        <div
          className="PreviewBox_SmallNumber   font-type-txt Color-White"
          style={{ color: isHovered ? "#00DBFF" : txt_color || "" }}
        >
          {SmallNumber}
        </div>
      </div>
      <div
        className="PreviewBox_ButtomLine"
        style={{ visibility: date === "NA" && "hidden" }}
      >
        <IconLastRun />
        <div className="font-type-very-sml-txt ">{date}</div>
      </div>{" "}
      {/*dont delete */}
    </div>
  );
}

function PreviewBox_Not_active_tools({
  show_only_this_tools,
  set_show_only_this_tools,
  dont_show_this_tools2,
  set_dont_show_this_tools2,
}) {
  function ToggleSwitch({ Info, onToggle }) {
    const [isChecked, setIsChecked] = useState(false);

    const handleChange = () => {
      setIsChecked(!isChecked);
      onToggle(Info); // Call the onToggle function passed from the parent, if needed
    };

    return (
      <label className="switch">
        <input
          disabled={isChecked}
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
        />
        <span className="slider round"></span>
      </label>
    );
  }

  const handleToggle = (Info) => {
    // setIsChecked(true);
    setTimeout(() => {
      // to show the box again
      const newArry = [...show_only_this_tools, Info?.tool_id];
      set_show_only_this_tools(newArry);

      // to dlete from not show list
      const indexNumber = dont_show_this_tools2.findIndex(
        (x) => x.tool_id === Info?.tool_id
      );

      const newArry2 = dont_show_this_tools2;
      // const index = array.indexOf(5);
      if (indexNumber > -1) {
        newArry2.splice(indexNumber, 1);
      }
      set_dont_show_this_tools2(newArry2);

      //  setIsChecked(false);
    }, 250);
  };

  return (
    <>
      <div
        className="PreviewBox PreviewBox-of-tools"
        style={{
          //  flexShrink:5,
          flexGrow: 1,
          width: "248px",
          //  maxWidth:"210px",
          //  minWidth:"210px",
        }}
      >
        <div
          style={{
            paddingTop: "var(--space-d)",
            paddingBottom: "var(--space-d)",
            paddingLeft: "var(--space-c)",
            paddingRight: "var(--space-c)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",

            height: "100%",
          }}
        >
          <div className=" ">
            <p
              className="  text-center    font-type-h4 Color-White mb-d"
              style={{ maxwidth: "350px" }}
            >
              UnActive
            </p>
            {/* <p className='text-center   font-type-txt Color-White  mb-a'    style={{maxwidth:"250px"}}>Return to Tools Dashboard</p> */}
            <div
              style={{
                height: "170px",
                overflowY: "auto",
              }}
            >
              {dont_show_this_tools2?.map((Info, index) => {
                return (
                  <>
                    <div
                      className=" "
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                        marginTop: "var(--space-b)",
                      }}
                    >
                      <ToggleSwitch Info={Info} onToggle={handleToggle} />

                      <p
                        className="text-center   font-type-txt Color-White  ml-b"
                        style={{}}
                      >
                        {Info?.headline}
                      </p>
                    </div>
                  </>
                );
              })}
            </div>
          </div>

          <div>
            <button className="btn-type2">
              <p className="font-type-menu ">Turn on all</p>{" "}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function PreviewBox_type_module({
  Info,
  HeadLine,
  description,
  logoAddress_1,
  logoAddress_2,
  readMoreText,
  buttonTitle,
  iconAddress,
  toolURL,
  tool_id,
  all_Tools,
  backEndURL,
  width,
}) {
  const { set_all_Tools, front_IP, front_URL } = useContext(GeneralContext);

  const [logoAddress_1_ForSrc, set_logoAddress_1_ForSrc] = useState("");
  const [logoAddress_2_ForSrc, set_logoAddress_2_ForSrc] = useState("");

  // const IconAddressForSrc = require( `${iconAddress}`);

  const [IconAddressForSrc, set_IconAddressForSrc] = useState("");
  const [popUp_show, set_popUp_show] = useState(false);
  const [last_response, set_last_response] = useState(0);
  const [disabled, set_disabled] = useState(false);
  const [StatusColorClass, set_StatusColorClass] = useState("Bg-Grey2");

  const handleReadMore = () => {
    set_popUp_show(true);
  };

  async function ShowInUi(Info) {
    try {
      // set_disable_ShowInUi_btn(true);
      const res = await axios.put(`${backEndURL}/tools/show-in-ui`, {
        params: {
          module_id: tool_id,
          set_ShowInUi_to: !Info?.ShowInUi,
        },
      });
      if (res.data) {
        // set_disable_ShowInUi_btn(false);
        const index = all_Tools.findIndex((tool) => tool.tool_id === tool_id);
        if (index !== -1) {
          // Create a new copy of the all_Tools array
          const updatedTools = [...all_Tools];
          // Update the specific tool
          updatedTools[index] = {
            ...updatedTools[index],
            tool_id: tool_id,
            ShowInUi: !Info?.ShowInUi,
          };
          // Set the state with the updated array
          set_all_Tools(updatedTools);
        }
      }
    } catch (err) {
      // set_disable_ShowInUi_btn(false);
      console.log(err);
    }
  }

  async function enable_disable_module(Info) {
    console.log("enable_disable_module", !Info?.isActive);

    try {
      set_disabled(true);
      const res = await axios.put(`${backEndURL}/tools/enable-disable-module`, {
        params: {
          module_id: tool_id,
          set_enable_disable_to: !Info?.isActive,
        },
      });

      if (res.data) {
        const index = all_Tools.findIndex((tool) => tool.tool_id === tool_id);
        if (index !== -1) {
          // Create a new copy of the all_Tools array
          const updatedTools = [...all_Tools];
          // Update the specific tool
          updatedTools[index] = {
            ...updatedTools[index],
            tool_id: tool_id,
            isActive: !Info?.isActive,
          };
          // Set the state with the updated array
          set_all_Tools(updatedTools);
          set_disabled(false);
        }
      }
    } catch (err) {
      set_disabled(false);
      console.log(err);
    }
  }

  useEffect(() => {
    if (
      logoAddress_1 !== "" &&
      logoAddress_1 !== null &&
      logoAddress_1 !== undefined
    ) {
      const Src = require(`${logoAddress_1}`);
      set_logoAddress_1_ForSrc(Src);
    }
    if (
      logoAddress_2 !== "" &&
      logoAddress_2 !== null &&
      logoAddress_2 !== undefined
    ) {
      const Src = require(`${logoAddress_2}`);
      set_logoAddress_2_ForSrc(Src);
    }
    if (
      iconAddress !== "" &&
      iconAddress !== null &&
      iconAddress !== undefined
    ) {
      const Src = require(`${iconAddress}`);
      set_IconAddressForSrc(Src);
    }
  }, []);

  return (
    <>
      <PopUp_For_Read_More
        HeadLine={HeadLine}
        readMoreText={readMoreText}
        logoAddress_1_ForSrc={logoAddress_1_ForSrc}
        toolURL={toolURL}
        buttonTitle={buttonTitle}
        set_popUp_show={set_popUp_show}
        popUp_show={popUp_show}
        IconAddressForSrc={IconAddressForSrc}
      />
      {/* ////////////////////////////////////////////////////////////////////////////////////////// */}
      <div
        className="PreviewBox PreviewBox-of-tools  "
        style={{
          flexGrow: 1,
          width: width,
        }}
      >
        <div className="PreviewBox_HeadLine">
          {Info?.toolType === "module" ? (
            <label className="switch">
              <input
                type="checkbox"
                checked={Info?.isActive}
                disabled={disabled}
                onClick={() => enable_disable_module(Info)}
                //  onChange={console.log(Info) }
              />{" "}
              <span className="slider round"></span>
            </label>
          ) : (
            <div></div>
          )}

          {Info.BoxType === "Tools_a" && (
            <>
              {/* ///////////// 1 or 2 logos /////////////// */}

              {logoAddress_2_ForSrc !== "" ? (
                <div className="display-flex     mr-a ml-a" style={{}}>
                  <img
                    src={logoAddress_1_ForSrc}
                    alt="logo"
                    className="responsive-logos-type_a"
                  />
                  <p className="font-type-very-sml-txt   Color-Grey1 mr-a ml-a">
                    &
                  </p>
                  <img
                    src={logoAddress_2_ForSrc}
                    alt="logo"
                    className="responsive-logos-type_a"
                  />
                </div>
              ) : (
                <div
                  className="display-flex "
                  style={{
                    marginRight: Info?.toolType === "module" ? "14px" : "-12px",
                  }}
                >
                  <p className="font-type-very-sml-txt   Color-Grey1 mr-a">
                    By:
                  </p>
                  <img
                    src={logoAddress_1_ForSrc}
                    alt="logo"
                    maxwidth="140"
                    height="20"
                  />
                </div>
              )}
            </>
          )}

          <div className={`${StatusColorClass}  light-bulb-type1`} />
        </div>
        <div className="display-flex justify-content-center align-items-center flex-direction-column">
          {Info.BoxType === "Tools_a" ? (
            <>
              <img
                src={IconAddressForSrc}
                alt="Icon"
                width="70"
                height="70"
                className="mb-a"
              />
              <p
                className="text-center     font-type-h4 Color-White mb-a"
                style={{ maxwidth: "350px" }}
              >
                {HeadLine}
              </p>
              <p
                className="text-center   font-type-txt Color-White  mb-a "
                style={{ maxwidth: "250px" }}
              >
                {description}
              </p>
            </>
          ) : (
            <>
              <div className="display-flex justify-content-center align-items-center flex-direction-column">
                <p
                  className="text-center     font-type-h4 Color-White  "
                  style={{ maxwidth: "350px" }}
                >
                  {HeadLine}
                </p>
                <p
                  className="text-center   font-type-txt Color-White  mb-a cutLongParagraph"
                  style={{ maxwidth: "250px" }}
                >
                  {description}
                </p>

                {logoAddress_2_ForSrc !== "" ? (
                  <div className="display-flex mb-b" style={{}}>
                    {/* <p  className="font-type-very-sml-txt   Color-Grey1 mr-a" >By:</p> */}
                    <img
                      src={logoAddress_1_ForSrc}
                      alt="logo"
                      className="responsive-logos-type_b"
                    />
                    <p className="font-type-very-sml-txt   Color-Grey1 mr-a ml-a">
                      &
                    </p>
                    <img
                      src={logoAddress_2_ForSrc}
                      alt="logo"
                      className="responsive-logos-type_b"
                    />
                  </div>
                ) : (
                  <div
                    className="display-flex mb-b"
                    style={{ marginRight: "5px" }}
                  >
                    <p className="font-type-very-sml-txt   Color-Grey1 mr-a">
                      By:
                    </p>
                    <img
                      src={logoAddress_1_ForSrc}
                      alt="logo"
                      maxwidth="140px"
                      height="30"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* IcoLink IcoModule */}

          <button className="btn-type3 mb-c" onClick={() => handleReadMore()}>
            <p className=" font-type-txt">Read More</p>
            <IconReadMore className="icon-type1 " />{" "}
          </button>

          {tool_id != "2001005" && (
            <button
              className="btn-type2"
              onClick={() =>
                handle_Main_Btn(
                  tool_id,
                  toolURL,
                  backEndURL,
                  front_IP,
                  front_URL
                )
              }
              style={{
                paddingRight:
                  Info?.toolType !== undefined &&
                  Info?.toolType !== "" &&
                  Info?.toolType !== null
                    ? "calc(var(--space-d) - 5px)"
                    : undefined,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <p className="font-type-menu">{buttonTitle}</p>

                {/* { Info?.toolType === "link" && <IcoLink     style={{height:"var(--space-c)" ,width:"var(--space-c)" ,marginLeft:"3px"}}/>} */}

                {Info?.toolType === "link" && (
                  <IcoLink
                    style={{
                      height: "var(--space-c)",
                      width: "var(--space-c)",
                      marginLeft: "4px",
                    }}
                  />
                )}
                {Info?.toolType === "module" && (
                  <IcoModule
                    style={{
                      height: "var(--space-c)",
                      width: "var(--space-c)",
                      marginLeft: "3px",
                    }}
                  />
                )}
              </div>
            </button>
          )}
        </div>
        <div className="PreviewBox_ButtomLine">
          <IconLastRun />
          <div
            className="font-type-very-sml-txt Color-Grey1"
            style={{ marginRight: "auto" }}
          >
            {last_response == 0
              ? format_date
              : format_date_type_a(last_response)}{" "}
          </div>
          <button
            className="btn-type4"
            tool_id={Info?.tool_id}
            onClick={() => ShowInUi(Info)}
          >
            <p className=" font-type-txt"></p>
            <IcoKey className="icon-type1" />
          </button>
        </div>{" "}
        {/*dont delete */}
      </div>
    </>
  );
}

function PreviewBox_respo_chart({
  colors,
  HeadLine,
  bar_numbers,
  bar_headlines,
  bar_title_legend,
  is_popup,
  enable_hover,
  display_this,
  set_display_this,
  display_this_value,
  box_height,
  read_more,
  read_more_icon,
  description_max_length,
  display_type,
  display_y_axis,
  date,
  allow_wide,
  description_show,
  allow_wide_min_wide,
}) {
  const [display_data, set_display_data] = useState(false);
  const [has_data, set_has_data] = useState(false);
  const [combined_Array, set_combined_Array] = useState([]);

  const [popUp_readMore_show, set_popUp_readMore_show] = useState(false);
  const handle_click = () => {
    if (set_display_this === undefined) {
      return;
    }
    if (display_this === display_this_value) {
      set_display_this("prime_data");
    } else {
      set_display_this(display_this_value);
    }
  };

  const handleReadMore = () => {
    console.log("handleReadMore");
    set_popUp_readMore_show(true);
  };

  const BasicColors = bar_numbers.map((item, index, array) => {
    const alpha = (index + 1) / array.length; // Calculate alpha based on the item's position
    return `rgba(0, 219, 255, ${alpha})`; // Return red with calculated transparency
  });

  const AlertColors = [
    getComputedStyle(document.documentElement).getPropertyValue(
      "--alert-color-critical"
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      "--alert-color-high"
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      "--alert-color-medium"
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      "--alert-color-low"
    ),
  ];

  const dont_display_color = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--color-Grey2");
  const space_c = getComputedStyle(document.documentElement).getPropertyValue(
    "--space-c"
  );

  // const bar_numbers_zero = [1]

  useEffect(() => {
    let sum = 0;

    for (let i = 0; i < bar_numbers.length; i++) {
      // console.log(bar_numbers[i]);
      sum += bar_numbers[i];
    }

    if (sum === 0) {
      set_has_data(false);
    } else {
      set_has_data(true);
    }
  }, [bar_numbers]);

  useEffect(() => {
    if (
      Array.isArray(bar_numbers) &&
      bar_numbers.length === 1 &&
      bar_numbers[0] === "NA"
      //  &&
      // Array.isArray(bar_headlines) &&
      // bar_headlines.length === 1 &&
      // bar_headlines[0] === "NA"
    ) {
      set_display_data(false);
    } else if (
      bar_numbers.length > 1 &&
      bar_numbers.every((item) => item === "NA")
    ) {
      set_display_data(false);
      console.log(HeadLine, "its more then 1 everybody id NA ", bar_numbers);
    } else {
      set_display_data(true);
    }
  }, [bar_numbers, bar_headlines]);

  useEffect(() => {
    if (
      !bar_numbers ||
      !bar_headlines ||
      bar_numbers.length == 0 ||
      bar_headlines.length == 0
    ) {
      return;
    }
    const combined = bar_headlines.map((headline, index) => ({
      name: headline,
      number: bar_numbers[index],
    }));
    set_combined_Array(combined);
  }, [bar_numbers, bar_headlines]);

  const doughnut_data = {
    // labels: ['Yes', 'No'],
    labels: bar_headlines,
    // labels:   all_Resource_Types.map(item => item.resource_type_name),
    datasets: [
      {
        label: bar_title_legend,
        // data: bar_numbers,
        // data: bar_numbers_zero,
        data: display_data === false ? [1] : has_data ? bar_numbers : [1],
        backgroundColor: (() => {
          if (display_data === false || has_data === false) {
            return dont_display_color;
          } else if (colors === "Basic") {
            return BasicColors;
          } else if (colors === "Alert") {
            return AlertColors;
          } else {
            return BasicColors; // default case
          }
        })(),
        borderWidth: 0,
        // style={{opacity:   (index +1) / all_Resource_Types.length   }} />
      },
    ],
  };

  const doughnut_options = {
    cutout: 25,
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },

    responsive: true,
    // maintainAspectRatio: false,
  };

  const bar_width = 55;

  const bar_data = {
    // labels: ['Yes', 'No'],
    labels:
      display_data === false
        ? ["", "", "", "", ""]
        : has_data
        ? bar_headlines
        : ["", "", "", "", ""],
    // labels:   all_Resource_Types.map(item => item.resource_type_name),
    datasets: [
      {
        label: bar_title_legend,
        // data:   bar_numbers,
        data:
          display_data === false
            ? [1, 2, 3, 4, 2]
            : has_data
            ? bar_numbers
            : [1, 2, 3, 4, 2],

        backgroundColor: (() => {
          if (display_data === false || has_data === false) {
            return dont_display_color;
          } else if (colors === "Basic") {
            return BasicColors;
          } else if (colors === "Alert") {
            return AlertColors;
          } else {
            return BasicColors; // default case
          }
        })(),

        // data: display_data === false ? [1] : (has_data ? bar_numbers : [1]),
        // backgroundColor: (() => {
        //   if (display_data === false || has_data === false) {
        //     return dont_display_color;
        //   } else if (colors === "Basic") {
        //     return BasicColors;
        //   } else if (colors === "Alert") {
        //     return AlertColors;
        //   } else {
        //     return BasicColors; // default case
        //   }
        // })(),

        borderWidth: 0,
        borderRadius: 100,
        barPercentage: 1.0,
        categoryPercentage: 1,
        maxBarThickness: bar_width, // Set maximum bar thickness here
      },
    ],
  };
  const minWidth = bar_data.labels.length * bar_width; // 55 is the maxBarThickness
  const bar_options = {
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },

    scales: {
      x: {
        display: false,

        grid: {
          display: false,
          categoryPercentage: 1.0, // Adjust the space between categories/bars
          barPercentage: 1.0, // Ensure bars are 10% of the category width
        },
      },
      y: {
        display: display_y_axis,
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "#E5E5E5",
          precision: 0, // Display only full numbers (integers)
        },
      },
    },

    responsive: true,
    maintainAspectRatio: false,
  };

  const midHight = box_height / 2.6;

  return (
    <>
      <PopUp_For_Read_More
        HeadLine={HeadLine}
        readMoreText={read_more}
        logoAddress_1_ForSrc={""}
        toolURL={""}
        buttonTitle={"Close"}
        set_popUp_show={set_popUp_readMore_show}
        popUp_show={popUp_readMore_show}
        IconAddressForSrc={read_more_icon}
      />

      <div
        className={`PreviewBox_respo ${
          is_popup ? "PreviewBox-of-pop-up" : ""
        } ${enable_hover ? "PreviewBox_for_type_count" : ""}`}
        style={{
          height: box_height,
          maxHeight: box_height,
          minWidth: allow_wide_min_wide && allow_wide_min_wide,
        }}
        onClick={handle_click}
      >
        <div className="PreviewBox_respo_top">
          <p className="font-type-menu Color-White">{HeadLine}</p>

          {description_show && (
            <>
              <p className="font-type-txt Color-Grey1 mt-a">
                {" "}
                {read_more.length > description_max_length
                  ? `${read_more.substring(0, description_max_length)}..`
                  : read_more}
              </p>
              <button
                className="btn-type3 mt-b"
                style={{ height: "12px", padding: 0 }}
                onClick={() => handleReadMore("vovo")}
              >
                <p className=" font-type-txt">Read More</p>
                <IconReadMore
                  className="icon-type1 "
                  style={{ height: "22px" }}
                />{" "}
              </button>
            </>
          )}
        </div>

        <div
          className={`PreviewBox_respo_middle   ${
            allow_wide && "PreviewBox_respo_middle_wide"
          }`}
          style={{
            maxHeight: `calc(${box_height} / 1.4)`,
            boxSizing: "border-box",
            overflow: "hidden",

            // backgroundColor:"green",
            // flexDirection:"column"
          }}
          // allow_wide
        >
          <div
            className=""
            style={{
              marginBottom: "auto",
              marginTop: "auto",
              margin: "auto",
              width: "90%",
              height: midHight,
              boxSizing: "border-box",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor:"pink"
            }}
          >
            {display_type === "pie" && (
              <Doughnut
                data={doughnut_data}
                options={doughnut_options}
                style={{
                  width: "auto",
                  height: "auto",
                  maxHeight: `calc(${box_height} - 76px`,
                }}
              ></Doughnut>
            )}
            {
              display_type === "bar" && (
                <div
                  className=""
                  style={{ width: `${minWidth}px`, height: box_height / 2.6 }}
                >
                  <Bar data={bar_data} options={bar_options} />
                </div>
              )

              // <Bar data={bar_data} options={bar_options}  style={{ width: "100%", height: "100%" }}></Bar>
            }
            {/* <Bar data={data} options={options} style={{ width: "100%", height: "100%" }} /> */}
          </div>

          <div
            className="display-flex justify-content-center"
            style={{
              width: "100%",
              gap: "2px",
              backgroundColor: "",
              height: "auto",
              maxHeight: "auto",
              overflowX: "hidden",
              overflowY: "auto",
              alignItems: allow_wide ? "center" : "flex-start",

              // backgroundColor:"blue"
              //  alignItems:`{  ${allow_wide ? "flex-start"  : "flex-end"}`
            }}
          >
            {display_data && (
              <>
                <div
                  className="display-flex flex-direction-column justify-content-center"
                  style={{
                    gap: "2px",
                    backgroundColor: "",
                    width: "auto",
                    overflow: "hidden",
                  }}
                >
                  {Array.isArray(bar_headlines) &&
                    bar_headlines?.map((Info, index) => {
                      return (
                        <div
                          className="display-flex"
                          style={{
                            marginRight: "",
                            backgroundColor: "",
                            width: "100%",
                          }}
                          key={index}
                        >
                          {colors === "Basic" && (
                            <div
                              className={`Bg-Blue-Glow light-bulb-type1 mr-a`}
                              style={{
                                opacity: (index + 1) / bar_headlines.length,
                                width: "12px",
                                minWidth: "12px",
                              }}
                            />
                          )}
                          {colors === "Alert" && (
                            <div
                              className={`Bg-Blue-Glow light-bulb-type1 mr-a`}
                              style={{
                                backgroundColor: AlertColors[index],
                                width: "12px",
                                minWidth: "12px",
                              }}
                            />
                          )}
                          <p
                            className="font-type-txt Color-White"
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "auto",
                            }}
                          >
                            {Info}
                          </p>
                        </div>
                      );
                    })}
                </div>

                <div
                  className="display-flex flex-direction-column"
                  style={{
                    gap: "2px",
                    width: "auto",
                    //  alignItems:`{  ${allow_wide ? "flex-start"  : "flex-end"}`
                  }}
                >
                  {Array.isArray(bar_numbers) &&
                    bar_numbers?.map((Info, index) => {
                      return (
                        <div
                          className="display-flex"
                          key={index}
                          style={{ marginLeft: "auto" }}
                        >
                          <p
                            className="font-type-txt Color-White mr-a ml-c"
                            style={{}}
                          >
                            {" "}
                            {Info}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </>
            )}

            {!display_data && (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p className="font-type-h4 Color-Grey2">No Records</p>
              </div>
            )}
          </div>
        </div>

        {/* <div className='PreviewBox_respo_buttom'>
        <p className="font-type-txt Color-Grey1">Real time</p>
      </div> */}

        <div
          className="PreviewBox_ButtomLine mt-b"
          style={{ visibility: date === "NA" && "hidden" }}
        >
          {date != "NA" && (
            <>
              <IconLastRun />
              <div className="font-type-very-sml-txt  Color-Grey1">{date}</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function PreviewBox_respo_widebar_type7({
  HeadLine,
  is_popup,
  enable_hover,
  display_this,
  set_display_this,
  display_this_value,
  box_height,
  description_short,
  read_more,
  read_more_icon,
  description_max_length,
  list_array_column2,
  list_array_column1,
  list_array,
  date,
}) {
  const maxRightValue = Math.max(
    ...list_array.map((item) => item[list_array_column2?.key])
  );

  const [popUp_readMore_show, set_popUp_readMore_show] = useState(false);

  useEffect(() => {
    if (list_array != undefined && list_array.length === 0) {
      console.log("No Records");
    }
  }, [list_array]);

  const handle_click = () => {
    if (set_display_this === undefined) {
      return;
    }
    if (display_this === display_this_value) {
      set_display_this("prime_data");
    } else {
      set_display_this(display_this_value);
    }
  };

  const handleReadMore = () => {
    console.log("handleReadMore");
    set_popUp_readMore_show(true);
  };

  return (
    <>
      <PopUp_For_Read_More
        HeadLine={HeadLine}
        readMoreText={read_more}
        logoAddress_1_ForSrc={""}
        toolURL={""}
        buttonTitle={"Close"}
        set_popUp_show={set_popUp_readMore_show}
        popUp_show={popUp_readMore_show}
        IconAddressForSrc={read_more_icon}
      />

      <div
        className={`PreviewBox_respo ${
          is_popup ? "PreviewBox-of-pop-up" : ""
        } ${enable_hover ? "PreviewBox_for_type_count" : ""}`}
        style={{ height: box_height, maxHeight: box_height }}
        onClick={handle_click}
      >
        <div className="PreviewBox_respo_top">
          <p className="font-type-menu Color-White">{HeadLine}</p>
          <p className="font-type-txt Color-Grey1 mt-a ">
            {" "}
            {read_more.length > description_max_length
              ? `${read_more.substring(0, description_max_length)}..`
              : read_more}
          </p>

          <button
            className="btn-type3 mt-b "
            style={{ height: "12px", padding: 0 }}
            onClick={() => handleReadMore("vovo")}
          >
            <p className=" font-type-txt">Read More</p>
            <IconReadMore
              className="icon-type1 "
              style={{ height: "22px" }}
            />{" "}
          </button>
        </div>

        <div
          className="PreviewBox_respo_middle mt-c"
          style={{ overflowY: "auto", flexDirection: "column" }}
        >
          <div className="" style={{}}>
            <div
              className="table-container"
              style={{
                boxSizing: "border-box",
                height: "100%",
                flexDirection: "column",
              }}
            >
              {list_array != undefined &&
                list_array.length > 0 &&
                list_array != "NA" && (
                  <>
                    <table
                      style={{ width: "100%", paddingRight: "var(--space-a)" }}
                    >
                      <thead
                        style={{
                          position: "sticky",
                          top: 0,
                          backgroundColor: "var(--color-Grey5)",
                          zIndex: 1,
                        }}
                      >
                        <tr style={{ textAlign: "left", height: "30px" }}>
                          <th
                            className="font-type-menu Color-Grey1"
                            style={{ paddingRight: "var(--space-b)" }}
                          >
                            {list_array_column1?.previewName}
                          </th>
                          <th
                            className="font-type-menu Color-Grey1"
                            style={{
                              textAlign: "left",
                              paddingRight: "var(--space-a)",
                            }}
                          >
                            {list_array_column2?.previewName}
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ overflowY: "auto" }}>
                        {list_array?.map((item, index) => {
                          const rightValue = item[list_array_column2?.key];
                          const barWidth = (rightValue / maxRightValue) * 100;

                          return (
                            <tr key={index} style={{ height: "28px" }}>
                              <td
                                className="font-type-txt Color-Grey1"
                                style={{
                                  width: "auto",
                                  paddingRight: "var(--space-b)",
                                  textWrap: "nowrap",
                                }}
                              >
                                {item[list_array_column1?.key]}
                              </td>
                              <td
                                className="font-type-txt Color-Grey1"
                                style={{
                                  width: "100%",
                                  textAlign: "left",
                                  paddingRight: "var(--space-a)",
                                }}
                              >
                                <div
                                  className="font-type-txt Color-Blue-Glow like_tagit_for_wide_bar "
                                  style={{
                                    width: `${barWidth}%`,
                                    textAlign: "left",
                                    padding: rightValue === 0 && 0,
                                  }}
                                >
                                  {/* {item[list_array_column1?.key]}  */}
                                  {/* Color-Blue-Glow tagit_type1 */}

                                  {rightValue}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                )}

              {list_array != undefined && list_array.length === 0 && (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <p className="font-type-h4 Color-Grey2">No Records</p>
                  </div>{" "}
                </>
              )}

              {list_array === undefined ||
                (list_array === "NA" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <p className="font-type-h3 Color-Grey2">NA</p>
                    </div>{" "}
                  </>
                ))}
            </div>
          </div>
        </div>

        {/* <div className='PreviewBox_respo_buttom'>
          <p className="font-type-txt Color-Grey1">Real time</p>
        </div> */}

        <div
          className="PreviewBox_ButtomLine mt-b"
          style={{ visibility: date === "NA" && "hidden" }}
        >
          <IconLastRun />
          <div className="font-type-very-sml-txt  Color-Grey1">{date}</div>
        </div>
      </div>
    </>
  );
}

function PreviewBox_respo_list_type6({
  HeadLine,
  is_popup,
  enable_hover,
  display_this,
  set_display_this,
  display_this_value,
  is_tags,
  box_height,
  date,
  read_more,
  read_more_icon,
  description_max_length,
  list_array_column2,
  list_array_column1,
  list_array,
  click_on_field,
  read_more_view,
  box_width,
  removeBtn,
  removeBtnFunc,
  clearBtnFunc,
}) {
  const [popUp_readMore_show, set_popUp_readMore_show] = useState(false);

  console.log("NA", list_array);

  const handle_click = () => {
    if (set_display_this === undefined) {
      return;
    }
    if (display_this === display_this_value) {
      set_display_this("prime_data");
    } else {
      set_display_this(display_this_value);
    }
  };

  const handleReadMore = () => {
    console.log("handleReadMore");
    set_popUp_readMore_show(true);
  };

  return (
    <>
      <PopUp_For_Read_More
        HeadLine={HeadLine}
        readMoreText={read_more}
        logoAddress_1_ForSrc={""}
        toolURL={""}
        buttonTitle={"Close"}
        set_popUp_show={set_popUp_readMore_show}
        popUp_show={popUp_readMore_show}
        IconAddressForSrc={read_more_icon}
      />

      <div
        className={`PreviewBox_respo ${
          is_popup ? "PreviewBox-of-pop-up" : ""
        } ${enable_hover ? "PreviewBox_for_type_count" : ""}`}
        style={{ height: box_height, maxHeight: box_height }}
        onClick={handle_click}
      >
        <div className="PreviewBox_respo_top">
          <p
            className="font-type-menu Color-White"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {HeadLine}
          </p>

          {read_more_view && (
            <>
              <p className="font-type-txt Color-Grey1 mt-a">
                {" "}
                {read_more.length > description_max_length
                  ? `${read_more.substring(0, description_max_length)}${
                      description_max_length != 0 ? ".." : ""
                    }`
                  : read_more}
              </p>
              <button
                className="btn-type3 mt-b"
                style={{ height: "12px", padding: 0 }}
                onClick={() => handleReadMore("vovo")}
              >
                <p className=" font-type-txt">Read More</p>
                <IconReadMore
                  className="icon-type1 "
                  style={{ height: "22px" }}
                />{" "}
              </button>
            </>
          )}
        </div>

        <div
          className="PreviewBox_respo_middle mt-c"
          style={{ overflowY: "auto", flexDirection: "column" }}
        >
          <div className="" style={{}}>
            <div
              className="table-container"
              style={{
                boxSizing: "border-box",
                height: "100%",
                flexDirection: "column",
              }}
            >
              {list_array != undefined &&
                list_array.length > 0 &&
                list_array != "NA" && (
                  <>
                    <div
                      className="table-container"
                      style={{
                        height: "calc(100% - 20px)",
                        //  overflowY: 'auto'
                      }}
                    >
                      <table
                        style={{
                          width: "100%",

                          //  borderCollapse: 'collapse'
                        }}
                      >
                        <thead
                          style={{
                            position: "sticky",
                            top: 0,
                            backgroundColor: is_popup
                              ? "var(--color-Grey4)"
                              : "var(--color-Grey5)",
                            zIndex: 1,
                          }}
                        >
                          <tr style={{ textAlign: "left", height: "28px" }}>
                            <th
                              className="font-type-menu Color-Grey1"
                              style={{}}
                            >
                              {list_array_column1?.previewName}
                            </th>
                            <th
                              className="font-type-menu Color-Grey1"
                              style={{
                                textAlign: "right",
                                paddingRight: "5px",
                              }}
                            >
                              {list_array_column2?.previewName}
                            </th>
                          </tr>
                        </thead>

                        <tbody style={{}}>
                          {list_array != "NA" &&
                            list_array != undefined &&
                            list_array.length > 0 &&
                            list_array?.map((item, index) => (
                              <tr
                                key={index}
                                style={{ height: is_tags ? "30px" : "24px" }}
                                className={`  ${
                                  click_on_field && "clickable_list"
                                }    `}
                              >
                                {is_tags ? (
                                  <td
                                    className="font-type-txt  font-type-txt   Color-Blue-Glow tagit_type1"
                                    style={{}}
                                  >
                                    {item[list_array_column1?.key]}
                                  </td>
                                ) : (
                                  <td
                                    className={`font-type-txt Color-Grey1`}
                                    style={{
                                      whiteSpace: "normal",
                                      wordWrap: "break-word",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {item[list_array_column1?.key]}
                                  </td>
                                )}
                                <td
                                  className="font-type-txt Color-White "
                                  style={{
                                    textAlign: "right",
                                    paddingRight: "5px",
                                  }}
                                >
                                  {/* {item[list_array_column2?.key]} */}

                                  {getNestedValue(
                                    item,
                                    list_array_column2?.key
                                  )}
                                </td>{" "}
                                {removeBtn && (
                                  <td
                                    className="font-type-txt Color-White "
                                    style={{
                                      textAlign: "right",
                                      width: 29,
                                    }}
                                  >
                                    <IconMinus
                                      onClick={() =>
                                        removeBtnFunc(item.rawKey ?? "")
                                      }
                                      className="icon-type1"
                                    />
                                  </td>
                                )}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

              {list_array != undefined && list_array.length === 0 && (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <p className="font-type-h4 Color-Grey2 mb-c">No Records</p>
                  </div>{" "}
                </>
              )}

              {list_array === undefined && (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <p className="font-type-h2 Color-Grey2 mb-c">NA</p>
                  </div>{" "}
                </>
              )}

              {list_array == "NA" && (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <p className="font-type-h2 Color-Grey2 mb-c">NA</p>
                  </div>{" "}
                </>
              )}
            </div>
          </div>
        </div>

        {/* <div className='PreviewBox_respo_buttom'>
            <p className="font-type-txt Color-Grey1">Real time</p>
          </div> */}
        <div
          className="PreviewBox_ButtomLine mt-b"
          style={{
            visibility: date === "NA" && "hidden",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          {" "}
          <div
            className="PreviewBox_ButtomLine mt-b"
            style={{ visibility: date === "NA" && "hidden" }}
          >
            <IconLastRun />
            <div className="font-type-very-sml-txt  Color-Grey1">{date}</div>
          </div>
          <div className="display-flex mt-c" style={{}}>
            {removeBtn && (
              <button
                className="btn-type2   '"
                style={{ marginLeft: "auto" }}
                onClick={clearBtnFunc}
              >
                <p className="font-type-menu ">Clear ban list</p>{" "}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function PreviewBox_respo_list_type6_test({
  HeadLine,
  is_popup,
  enable_hover,
  display_this,
  set_display_this,
  display_this_value,
  is_tags,
  box_height,
  date,
  read_more,
  read_more_icon,
  description_max_length,
  list_array_column2,
  list_array_column1,
  list_array,
  click_on_field,
  read_more_view,
}) {
  const [popUp_readMore_show, set_popUp_readMore_show] = useState(false);

  console.log("list_array:", list_array);

  const handle_click = () => {
    if (set_display_this === undefined) return;
    set_display_this(
      display_this === display_this_value ? "prime_data" : display_this_value
    );
  };

  const handleReadMore = () => {
    console.log("handleReadMore");
    set_popUp_readMore_show(true);
  };

  return (
    <>
      <PopUp_For_Read_More
        HeadLine={HeadLine}
        readMoreText={read_more}
        logoAddress_1_ForSrc={""}
        toolURL={""}
        buttonTitle={"Close"}
        set_popUp_show={set_popUp_readMore_show}
        popUp_show={popUp_readMore_show}
        IconAddressForSrc={read_more_icon}
      />

      <div
        className={`PreviewBox_respo ${
          is_popup ? "PreviewBox-of-pop-up" : ""
        } ${enable_hover ? "PreviewBox_for_type_count" : ""}`}
        style={{ height: box_height, maxHeight: box_height }}
        onClick={handle_click}
      >
        <div className="PreviewBox_respo_top">
          <p
            className="font-type-menu Color-White"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {HeadLine}
          </p>

          {read_more_view && (
            <>
              <p className="font-type-txt Color-Grey1 mt-a">
                {read_more.length > description_max_length
                  ? `${read_more.substring(0, description_max_length)}..`
                  : read_more}
              </p>
              <button
                className="btn-type3 mt-b"
                style={{ height: "12px", padding: 0 }}
                onClick={handleReadMore}
              >
                <p className="font-type-txt">Read More</p>
                <IconReadMore
                  className="icon-type1"
                  style={{ height: "22px" }}
                />
              </button>
            </>
          )}
        </div>

        <div
          className="PreviewBox_respo_middle mt-c"
          style={{ overflowY: "auto", flexDirection: "column" }}
        >
          <div
            className="table-container"
            style={{
              boxSizing: "border-box",
              height: "100%",
              flexDirection: "column",
            }}
          >
            {list_array && list_array.length > 0 && list_array !== "NA" ? (
              <div
                className="table-container"
                style={{ height: "calc(100% - 20px)" }}
              >
                <table style={{ width: "100%" }}>
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: is_popup
                        ? "var(--color-Grey4)"
                        : "var(--color-Grey5)",
                      zIndex: 1,
                    }}
                  >
                    <tr style={{ textAlign: "left", height: "28px" }}>
                      <th className="font-type-menu Color-Grey1">
                        {list_array_column1?.previewName}
                      </th>
                      <th
                        className="font-type-menu Color-Grey1"
                        style={{ textAlign: "right", paddingRight: "5px" }}
                      >
                        {list_array_column2?.previewName}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {list_array.map((item, index) => (
                      <tr
                        key={index}
                        style={{ height: is_tags ? "30px" : "24px" }}
                        className={`${click_on_field && "clickable_list"}`}
                      >
                        <td
                          className={`font-type-txt ${
                            is_tags
                              ? "Color-Blue-Glow tagit_type1"
                              : "Color-Grey1"
                          }`}
                        >
                          {item[list_array_column1?.key]}
                        </td>
                        <td
                          className="font-type-txt Color-White"
                          style={{ textAlign: "right", paddingRight: "5px" }}
                        >
                          {getNestedValue(item, list_array_column2?.key)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <p className="font-type-h2 Color-Grey2 mb-c">
                  {list_array === "NA" ? "NA" : "No Records"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          className="PreviewBox_ButtomLine mt-b"
          style={{ visibility: date === "NA" ? "hidden" : "visible" }}
        >
          <IconLastRun />
          <div className="font-type-very-sml-txt Color-Grey1">{date}</div>
        </div>
      </div>
    </>
  );
}

function PreviewBox_respo_type1_number_no_filters({
  HeadLine,
  BigNumber,
  SmallNumber,
  StatusColor,
  date,
  SmallNumberTxt,
  is_popup,

  txt_color,
  display_this,
  set_display_this,
  display_this_value,

  box_height,
  description_max_length,
  read_more,
}) {
  const dont_display_color = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--color-Grey2");
  const [isHovered, setIsHovered] = useState(false);
  const [is_Filtering, set_is_Filtering] = useState(false);
  const [popUp_readMore_show, set_popUp_readMore_show] = useState(false);

  console.log(HeadLine, BigNumber);

  const handle_click = () => {
    if (display_this === display_this_value) {
      set_display_this("prime_data");
    } else {
      set_display_this(display_this_value);
    }
  };

  const handleReadMore = () => {
    console.log("handleReadMore");
    set_popUp_readMore_show(true);
  };

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleLeave = () => {
    setIsHovered(false);
  };

  const StatusColorClass =
    StatusColor.toLowerCase() === "critical"
      ? "alert-bg-color-critical"
      : StatusColor.toLowerCase() === "high"
      ? "alert-bg-color-high"
      : StatusColor.toLowerCase() === "medium"
      ? "alert-bg-color-medium"
      : StatusColor.toLowerCase() === "low"
      ? "alert-bg-color-low"
      : StatusColor.toLowerCase() === "all-good"
      ? "alert-bg-color-no-alert"
      : StatusColor === "red"
      ? "Bg-Red"
      : StatusColor === "blue"
      ? "Bg-Blue-Glow"
      : StatusColor === "green"
      ? "alert-bg-color-no-alert"
      : StatusColor == ""
      ? "alert-bg-color-none"
      : StatusColor == undefined
      ? "alert-bg-color-none"
      : "alert-bg-color-none";

  return (
    // <div className={`PreviewBox_respo ${is_popup ? "PreviewBox-of-pop-up" : ""} ${enable_hover ? "PreviewBox_for_type_count" : ""}  ${is_Filtering   && 'PreviewBox_Filtering' } `} style={{ height: box_height }}

    <>
      <PopUp_For_Read_More
        HeadLine={HeadLine}
        readMoreText={read_more}
        logoAddress_1_ForSrc={""}
        toolURL={""}
        buttonTitle={"Close"}
        set_popUp_show={set_popUp_readMore_show}
        popUp_show={popUp_readMore_show}
      />

      <div
        className={`PreviewBox_respo PreviewBox_for_type_count ${
          is_Filtering ? "PreviewBox_Filtering" : ""
        }  ${is_popup ? "PreviewBox-of-pop-up" : ""}`}
        onClick={handle_click}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        style={{ height: box_height, maxHeight: box_height }}
      >
        <div className="PreviewBox_respo_top">
          {/* <p className="font-type-menu Color-White">{HeadLine}</p> */}

          <div className="PreviewBox_HeadLine">
            <p className="font-type-menu">{HeadLine}</p>

            <div
              className={`${StatusColorClass}  light-bulb-type1`}
              style={{
                backgroundColor: isHovered ? "#00DBFF" : txt_color || "",
              }}
            />
          </div>

          <p className="font-type-txt Color-Grey1 mt-a">
            {" "}
            {read_more.length > description_max_length
              ? `${read_more.substring(0, description_max_length)}..`
              : read_more}
          </p>

          <button
            className="btn-type3 mt-b"
            style={{ height: "12px", padding: 0 }}
            onClick={() => handleReadMore("vovo")}
          >
            <p className=" font-type-txt">Read More</p>
            <IconReadMore
              className="icon-type1 "
              style={{ height: "22px" }}
            />{" "}
          </button>
        </div>

        <div>
          <div className="PreviewBox_BigNumber    Color-White ">
            <Counter
              target={BigNumber}
              isHovered={isHovered}
              txt_color={txt_color}
            />
          </div>
          <div
            className="PreviewBox_SmallNumber   font-type-txt Color-White mb-b"
            style={{
              color: isHovered
                ? "#00DBFF"
                : BigNumber === "NA"
                ? dont_display_color
                : txt_color || "",
            }}
          >
            {SmallNumberTxt}
            {SmallNumber && ": "}
            {SmallNumber}
          </div>
        </div>

        <div
          className="PreviewBox_ButtomLine "
          style={{ visibility: date === "NA" && "hidden" }}
        >
          <IconLastRun />
          <div className="font-type-very-sml-txt  Color-Grey1">{date}</div>
        </div>
      </div>
    </>
  );
}

export {
  PreviewBox_respo_chart,
  PreviewBox_respo_widebar_type7,
  PreviewBox_respo_list_type6,
  PreviewBox_respo_type1_number_no_filters,
  PreviewBox_type0_static,
  PreviewBox_type1_number,
  PreviewBox_type3_bar,
  PreviewBox_type5_hunt_data_tabla,
  PreviewBox_Not_active_tools,
  PreviewBox_type2_pie,
  PreviewBox_type4_legend2,
  PreviewBox_type_module,
  PreviewBox_type1_number_no_filters,
  PreviewBox_type6_list_box,
  PreviewBox_type7_wide_bar,
  PreviewBox_type8_time,
  PreviewBox_type9_arguments,
};
