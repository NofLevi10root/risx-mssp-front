import React, { useEffect, useState, useContext } from "react";
import GeneralContext from "../Context.js";
import "./PopUp.css"; // import CSS file for modal styling
import {
  PreviewBox_respo_chart,
  PreviewBox_type3_bar,
  PreviewBox_type2_pie,
  PreviewBox_type5_hunt_data_tabla,
  PreviewBox_type1_number_no_filters,
  PreviewBox_type9_arguments,
} from "./PreviewBoxes.js";
import { ReactComponent as CloseButton } from "../Components/icons/ico-Close_type1.svg";
import { ReactComponent as DownloadIconButton } from "../Components/icons/ico-menu-download.svg";
import { format_date_type_c, format_date_type_a } from "./Features/DateFormat";
import axios from "axios";

async function download_Json(
  ResponsePath,
  backEndURL,
  DownloadProgressBar,
  setDownloadProgressBar,
  setDownloadList,
  mbSize, set_PopUp_Error__show, set_PopUp_Error__txt
) {
  try {
    console.log("downloadJson(file)", ResponsePath);
    const fileName2 = ResponsePath?.split("/")?.pop();
    // Make the GET request to download the JSON file
    const response = await axios.get(
      `${backEndURL}/results/download-json-file`,
      {
        params: { ResponsePath: ResponsePath },
        responseType: "blob", // Specify responseType as 'blob' for binary data
        onDownloadProgress: (prog) => {
          const value = Math.round(
            (prog.loaded / (prog.total || mbSize * 1048576)) * 100
          );
          try {
            if (!DownloadProgressBar[fileName2]) {
              // console.log("empty");
              // const copy = DownloadList.map((x) => x);
              // copy.push(fileName);
              // console.log(
              //   "DownloadListDownloadListDownloadListDownloadListDownloadListDownloadListDownloadListDownloadListDownloadList",
              //   DownloadList
              // );
              // setDownloadList(copy);
              if (value < 100) {
                DownloadProgressBar[fileName2] = {
                  progress: value,
                  fileName: fileName2,
                };
              }
            }
            if (value > 101) {
              DownloadProgressBar[fileName2] = {
                progress: "In Progress",
                fileName: fileName2,
              };
              // console.log(value);

              setDownloadProgressBar(DownloadProgressBar);
              setDownloadList(Math.random());
            }

            if (
              (DownloadProgressBar[fileName2]?.progress + 5 < value ||
                (value >= 100 &&
                  DownloadProgressBar[fileName2]?.progress != 100)) &&
              DownloadProgressBar[fileName2]?.progress !== undefined
            ) {
              console.log("Download Prog", value, DownloadProgressBar);
              DownloadProgressBar[fileName2] = {
                progress: value,
                fileName: fileName2,
              };
              // console.log(value);

              setDownloadProgressBar(DownloadProgressBar);
              setDownloadList(Math.random());
            }
          } catch (error) {
            console.log("Error In Download", error);
            set_PopUp_Error__show(true)
            set_PopUp_Error__txt({
              HeadLine: "Error In Download",
              paragraph: "Check For Error In Log",
              buttonTitle: "Close",
            })
          }
        },
      }
    );
    console.log("response", response);
    // Create a Blob object from the binary data received
    const blob = new Blob([response.data], { type: "application/json" });

    // Create a temporary URL for the Blob data
    const url = window.URL.createObjectURL(blob);

    // Create a link element and click it to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName2); // Specify the file name here
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    console.log("File downloaded successfully");
  } catch (error) {
    console.error("Error downloading file:", error);
    set_PopUp_Error__show(true)
    set_PopUp_Error__txt({
      HeadLine: "Error In Download",
      paragraph: "Check For Error In Log",
      buttonTitle: "Close",
    })
  }
}

const handle_download_Json_File = (
  file,
  backEndURL,
  DownloadProgressBar,
  setDownloadProgressBar,
  setDownloadList, set_PopUp_Error__show, set_PopUp_Error__txt
) => {
  if (file?.fileSize === "Too big") {
    console.log("Too big  going to download from server", file);
    const ResponsePath = file?.ResponsePath;
    download_Json(
      ResponsePath,
      backEndURL,
      DownloadProgressBar,
      setDownloadProgressBar,
      setDownloadList,
      file.mbSize, set_PopUp_Error__show, set_PopUp_Error__txt
    );
  } else {
    // download the preview file
    try {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(file));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "data.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      set_PopUp_Error__show(true)
      set_PopUp_Error__txt({
        HeadLine: "Error In Download",
        paragraph: "Check For Error In Log",
        buttonTitle: "Close",
      })
    }

  }
};

const cellColor = (value) => {
  if (typeof value === "string") {
    const lowerValue = value.toLowerCase();
    if (lowerValue === "critical") return "var(--alert-color-critical)";
    else if (lowerValue === "high") return "var(--alert-color-high)";
    else if (lowerValue === "medium") return "var(--alert-color-medium)";
    else if (lowerValue === "low") return "var(--alert-color-low)";
    else if (lowerValue === "info") return "var(--alert-color-no-alert)";
    else return "var(--color-Grey1)"; // Default color
  }
  return "var(--color-Grey1)"; // Default color
};

const LIMIT_MAX_CELL_WIDTH = "220px";

export const PopUp_For_velociraptor_response = (props) => {
  const {
    HeadLine,
    popUp_show,
    set_popUp_show,
    set_PopUp_All_Good__show,
    set_PopUp_All_Good__txt,
    toolURL,
    buttonTitle,
    IconAddressForSrc,
    json_file_info,
    json_file_data, set_PopUp_Error__show, set_PopUp_Error__txt
  } = props;
  const {
    all_artifacts,
    backEndURL,
    DownloadProgressBar,
    setDownloadProgressBar,
    setDownloadList,
    DownloadList,
  } = useContext(GeneralContext);
  const [artifact_logo, set_artifact_logo] = useState("");
  const [aggregate_macro_data, set_aggregate_macro_data] = useState({});
  const [display_data_type, set_display_data_type] = useState("prime_data");
  const [expandedColumn, setExpandedColumn] = useState(null);

  const [headers, set_headers] = useState([]);
  const [isWidthLimited, setIsWidthLimited] = useState(true); // State to toggle width
  // Get the keys from the first object (assuming all objects have the same keys)

  useEffect(() => {
    if (!json_file_info || json_file_info?.table.length === 0) return;
    const allHeaders = Object.keys(json_file_info?.table[0]);

    const filterd = allHeaders.filter(
      (header) => !["FlowId", "ClientId", "_OrgId"].includes(header)
    );
    console.log("filterd", filterd);

    set_headers(filterd);
  }, [json_file_info]);

  const handleHeaderClick = () => {
    setIsWidthLimited(!isWidthLimited); // Toggle the width limit
  };

  const handleColumnClick = (key) => {
    setExpandedColumn(expandedColumn === key ? null : key);
  };

  const handle_click_download = (file, backEndURL) => {
    console.log("handle_click_download", file);
    set_PopUp_All_Good__show(true);
    set_PopUp_All_Good__txt({
      HeadLine: "Download Start",
      paragraph:
        "This download can take a few minutes. The file will appear in your download folder once the process is complete.",
      buttonTitle: "Close",
    });
    if (file?.fileSize === "Too big") {
      console.log("handle_click_download  - Too big ");
      handle_download_Json_File(
        file,
        backEndURL,
        DownloadProgressBar,
        setDownloadProgressBar,
        setDownloadList, set_PopUp_Error__show, set_PopUp_Error__txt
      );

      set_popUp_show(false);
    } else {
      handle_download_Json_File(
        file,
        backEndURL,
        DownloadProgressBar,
        setDownloadProgressBar,
        setDownloadList, set_PopUp_Error__show, set_PopUp_Error__txt
      );
    }
  };

  useEffect(() => {
    if (
      json_file_data === undefined ||
      json_file_data === "" ||
      json_file_data === null
    ) {
      return;
    }
    if (
      all_artifacts === undefined ||
      all_artifacts === "" ||
      all_artifacts === null
    ) {
      return;
    }
    if (json_file_data.length == 0 || all_artifacts.length == 0) {
      return;
    }
    console.log(all_artifacts);

    if (
      json_file_data?.SubModulesCollection != "" &&
      typeof json_file_data?.SubModulesCollection === "string"
    ) {
      const pathTOPic = all_artifacts?.filter(
        (word) => word?.Toolname === json_file_data?.SubModulesCollection
      );
      if (
        pathTOPic === undefined ||
        pathTOPic === "" ||
        pathTOPic.length === 0
      ) {
        console.log("artifact id problem");
        return;
      }
      const logoAddress_1 = pathTOPic[0]?.logoAddress_1;
      const bbb = require(`${logoAddress_1}`);
      set_artifact_logo(bbb);
    } else {
      const pathTOPic = all_artifacts?.filter(
        (word) => word?.Toolname === json_file_data?.SubModuleName
      );
      if (
        pathTOPic === undefined ||
        pathTOPic === "" ||
        pathTOPic.length === 0
      ) {
        console.log("artifact id problem");
        return;
      }
      const logoAddress_1 = pathTOPic[0]?.logoAddress_1;
      const bbb = require(`${logoAddress_1}`);
      set_artifact_logo(bbb);
    }
  }, [json_file_data]);

  useEffect(() => {
    set_popUp_show(popUp_show);
  }, [popUp_show]);

  function handleClickOutside(e) {
    if (e.target.className === "PopUp-background") {
      set_popUp_show(false);
    }
  }

  function handleClose() {
    set_popUp_show(false);
  }

  const [cell_width, set_cell_width] = useState(() => {
    if (json_file_info?.table[0]) {
      const totalKeys = Object.keys(json_file_info.table[0]).length;
      const width1 = 190 / totalKeys;

      if (width1 > 30) {
        return `30vh`;
      } else {
        return `${width1}vh`;
      }
    } else {
      return "100px"; // Default width if json_file_info?.table[0] is undefined or has no keys
    }
  });

  useEffect(() => {
    const SubModuleName = json_file_data?.SubModuleName;
    const ResponsePath = json_file_data?.ResponsePath;
    if (SubModuleName === undefined) {
      return;
    }
    if (ResponsePath === undefined) {
      return;
    }
    switch (SubModuleName) {
      case "HardeningKitty":
        get_aggregate_macro_data(SubModuleName, ResponsePath);
        break;

      default:
        console.log("dont have macro Aggregate to this artifact");
    }
  }, [popUp_show, json_file_data]);

  async function get_aggregate_macro_data(SubModuleName, ResponsePath) {
    // console.log("get_aggregate_macro_data", SubModuleName, ResponsePath);
    if (SubModuleName === undefined) {
      console.log("SubModuleName undefined");
      return;
    }
    if (ResponsePath === undefined) {
      console.log("ResponsePath undefined");
      return;
    }
    try {
      const res = await axios.get(
        `${backEndURL}/results/velociraptor-aggregate-macro`,
        {
          params: {
            SubModuleName: SubModuleName,
            ResponseFile: ResponsePath,
          },
        }
      );

      if (res) {
        console.log("get_aggregate_macro_data res", res);
      }

      if (res.data.success === false) {
        console.log("aggregate_macro_data_from false", res.data);
      }

      if (res.data.success === true) {
        set_aggregate_macro_data(res?.data?.data);
        console.log("aggregate_macro_data_from  true", res.data.data);
      }
    } catch (err) {
      console.log("----------", err);
      console.log(err.response?.data?.message || "An error occurred");
    }
  }

  // console.log(json_file_info?.table );
  // console.log(json_file_info?.SubModuleName);
  // console.log("json_file_info props" ,props );
  // console.log("json_file_data 1111111111111" , json_file_data);
  // console.log("aggregate_macro_data" , aggregate_macro_data["List of computers with High"]);

  const pop_up_Width =
    json_file_info?.fileSize === "Too big"
      ? "auto"
      : json_file_data?.SubModuleName === "HardeningKitty"
        ? "90%"
        : "80%";
  console.log(
    json_file_info,
    "json_file_datajson_file_datajson_file_datajson_file_datajson_file_datajson_file_datajson_file_datajson_file_datajson_file_data"
  );

  return (
    <>
      {popUp_show && (
        <div className={`PopUp-background`} onClick={handleClickOutside}>
          <div
            className={`PopUp-content`}
            style={{
              // width: json_file_info?.fileSize == "Too big" ? "auto" : "80%",
              width: pop_up_Width,
            }}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            <div className="velociraptor_response_all_top mb-c">
              <div className="velociraptor_response_top_texts  "> </div>

              <div className="pop-up-top-boxes-macro PreviewBox-of-pop-up-all">
                {Object.keys(aggregate_macro_data).length != 0 ? (
                  <>
                    <PreviewBox_type5_hunt_data_tabla
                      HeadLine="Response Data"
                      artifact_or_module={"Artifact"}
                      is_popup={true}
                      display_y_axis={false}
                      Artifact={json_file_data?.SubModuleName}
                      HuntID={json_file_info?.huntid}
                      Status={json_file_info?.status}
                      BaseLine={
                        json_file_data?.Arguments?.ArtifactParameters?.Baseline
                      }
                      StartDate={
                        json_file_data?.StartDate
                          ? format_date_type_c(json_file_data?.StartDate)
                          : "NA"
                      }
                      Error={
                        json_file_data?.Error === "" ? (
                          <>None</>
                        ) : (
                          <>{json_file_data?.Error}</>
                        )
                      }
                    />

                    <PreviewBox_type9_arguments
                      HeadLine="Arguments"
                      Arguments={json_file_data?.Arguments}
                      is_popup={true}
                    />

                    <PreviewBox_type2_pie
                      HeadLine={`Tests (${aggregate_macro_data?.Failed_Test_Number_of_tests[1]})`}
                      bar_numbers={[
                        aggregate_macro_data?.Failed_Test_Number_of_tests[0],
                        aggregate_macro_data?.Failed_Test_Number_of_tests[1] -
                        aggregate_macro_data?.Failed_Test_Number_of_tests[0],
                      ]}
                      bar_headlines={["Failed", "Pass"]}
                      // bar_title_legend = {["Tests"]}
                      is_popup={true}
                      enable_hover={true}
                      display_this={display_data_type}
                      set_display_this={set_display_data_type}
                      display_this_value={"prime_data"}
                      colors={"Basic"} // Basic , Alert
                    />

                    <PreviewBox_type3_bar
                      HeadLine="Vulnerabilities"
                      bar_numbers={
                        aggregate_macro_data?.severity_Counts
                          ? aggregate_macro_data?.severity_Counts
                          : [0, 0, 0, 0]
                      }
                      bar_headlines={
                        aggregate_macro_data?.severity_Order
                          ? aggregate_macro_data?.severity_Order
                          : ["Critical", "High", "Medium", "Low"]
                      }
                      bar_title_legend={"Vulnerabilities"}
                      is_popup={true}
                      display_y_axis={false}
                      colors={"Alert"}
                      enable_hover={true}
                      display_this={display_data_type}
                      set_display_this={set_display_data_type}
                      display_this_value={"prime_data"}
                    />

                    <PreviewBox_type1_number_no_filters
                      HeadLine="Severity High"
                      resource_type_id={null}
                      BigNumber={
                        aggregate_macro_data?.["Count of High"] !== undefined
                          ? aggregate_macro_data["Count of High"]
                          : "NA"
                      }
                      SmallNumberTxt={"TestResult Failed"}
                      // SmallNumber={`${aggregate_macro_data?.Failed_Test_Number_of_tests[1]}`}
                      // SmallNumber={ aggregate_macro_data?.severity_Counts  &&  aggregate_macro_data?.severity_Counts.length > 0 &&  aggregate_macro_data?.severity_Counts.reduce((a, b) => a + b, 0) || "NA"     }
                      StatusColor="High"
                      date={"NA"}
                      // filter_Resource={display_data_type }
                      // set_filter_Resource={set_display_data_type}
                      is_popup={true}
                      // txt_color={"var(--color-Orange-Red)"}
                      txt_color={""}
                      display_this={display_data_type}
                      set_display_this={set_display_data_type}
                      display_this_value={"High"}
                    />

                    <PreviewBox_type1_number_no_filters
                      HeadLine="Severity Critical"
                      resource_type_id={null}
                      BigNumber={
                        aggregate_macro_data?.["Count of Critical"] !==
                          undefined
                          ? aggregate_macro_data["Count of Critical"]
                          : "NA"
                      }
                      SmallNumberTxt={"TestResult Failed"}
                      // SmallNumber={`${aggregate_macro_data?.Failed_Test_Number_of_tests[1]}`}
                      // SmallNumber={ aggregate_macro_data?.severity_Counts  &&  aggregate_macro_data?.severity_Counts.length > 0 &&  aggregate_macro_data?.severity_Counts.reduce((a, b) => a + b, 0) || "NA"     }
                      StatusColor="Critical"
                      date={"NA"}
                      // filter_Resource={display_data_type }
                      // set_filter_Resource={set_display_data_type}
                      is_popup={true}
                      // txt_color={"var(--color-Red)"}
                      txt_color={""}
                      display_this={display_data_type}
                      set_display_this={set_display_data_type}
                      display_this_value={"Critical"}
                    />
                  </>
                ) : (
                  <>
                    <PreviewBox_type5_hunt_data_tabla
                      HeadLine="Hunt Data"
                      artifact_or_module={"Artifact"}
                      is_popup={true}
                      StartDate={
                        json_file_data?.StartDate
                          ? format_date_type_c(json_file_data?.StartDate)
                          : "NA"
                      }
                      display_y_axis={false}
                      Artifact={json_file_data?.SubModuleName}
                      HuntID={json_file_info?.huntid}
                      Status={json_file_info?.status}
                      BaseLine={
                        json_file_data?.Arguments?.ArtifactParameters?.Baseline
                      }
                      Error={
                        json_file_data?.Error === "" ? (
                          <>None</>
                        ) : (
                          <>{json_file_data?.Error}</>
                        )
                      }
                    />

                    {json_file_info?.fileSize === "Too big" && (
                      <div
                        className="  "
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexDirection: "column",
                        }}
                      >
                        <div>
                          {json_file_data?.ModuleName != "Yara AI" ? (
                            <p className="  font-type-txt   Color-Grey1  ">
                              Data file is too big.
                              {json_file_info?.mbSize && (
                                <> ({Math.round(json_file_info?.mbSize)}Mb)</>
                              )}
                              <br />
                              You can download it as a JSON file.
                            </p>
                          ) : (
                            <p className="  font-type-txt   Color-Grey1  ">
                              The Dashboard Is a Work In Progress
                              <br />
                              You can download it as a JSON file.
                            </p>
                          )}
                          <button
                            className="btn-type3   mt-a"
                            style={{ marginRight: "auto", marginLeft: "-5px" }}
                          >
                            <p
                              className="font-type-menu  "
                              onClick={() =>
                                handle_click_download(
                                  json_file_info,
                                  backEndURL
                                )
                              }
                            >
                              Download JSON
                            </p>
                            <DownloadIconButton className="icon-type1 " />{" "}
                          </button>
                        </div>

                        <div
                          className=""
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          {artifact_logo === "" ? null : (
                            <>
                              <p className="font-type-very-sml-txt   Color-Grey1 mr-a">
                                By:
                              </p>{" "}
                              <img
                                src={artifact_logo}
                                alt="logo"
                                maxwidth="140px"
                                height="30"
                              />
                            </>
                          )}
                          <button
                            className="btn-type2 "
                            style={{ marginLeft: "auto" }}
                            onClick={handleClose}
                          >
                            <p className="font-type-menu ">{buttonTitle}</p>{" "}
                          </button>
                        </div>
                      </div>
                    )}

                    {json_file_info?.fileSize != "Too big" && (
                      <>
                        {json_file_data?.Arguments && (
                          <>
                            <PreviewBox_type9_arguments
                              HeadLine="Arguments"
                              Arguments={json_file_data?.Arguments}
                              is_popup={true}
                            />
                          </>
                        )}

                        <PreviewBox_type1_number_no_filters
                          HeadLine="Object Find"
                          resource_type_id={null}
                          BigNumber={
                            json_file_info?.table?.length === undefined
                              ? 0
                              : json_file_info?.table?.length
                          }
                          SmallNumberTxt={""}
                          SmallNumber={``}
                          StatusColor=""
                          date={"NA"}
                          is_popup={true}
                          txt_color={""}
                          display_this={display_data_type}
                          set_display_this={set_display_data_type}
                          display_this_value={"prime_data"}
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <div
              style={{
                height: "auto",
                maxHeight: "300px",
                overflowY: "auto",
                margin: 0,
                padding: 0,
              }}
            >
              {json_file_data?.artifact_id === "1000105" ? (
                <>
                  <div className="table_smart">
                    <div
                      className="parent-container"
                      onClick={() => set_cell_width("500px")}
                    >
                      <p
                        className="table_smart_col font-type-menu Color-White"
                        style={{ width: cell_width }}
                      >
                        ClientId
                      </p>
                    </div>

                    {/* <div
                      className="parent-container"
                      onClick={() => set_cell_width("500px")}
                    >
                      <p
                        className="table_smart_col font-type-menu Color-White"
                        style={{ width: cell_width }}
                      >
                        FlowId
                      </p>
                    </div> */}

                    <div
                      className="parent-container"
                      onClick={() => set_cell_width("500px")}
                    >
                      <p
                        className="table_smart_col font-type-menu Color-White"
                        style={{ width: cell_width }}
                      >
                        Fqdn
                      </p>
                    </div>
                  </div>

                  <div className="table_smart">
                    <div className="parent-container">
                      <p
                        className="table_smart_col font-type-txt  Color-Grey1"
                        style={{ width: cell_width }}
                      >
                        {json_file_info?.table[0]?.ClientId}
                      </p>
                    </div>
                    {/* <div className="parent-container">
                      <p
                        className="table_smart_col font-type-txt  Color-Grey1"
                        style={{ width: cell_width }}
                      >
                        {json_file_info?.table[0]?.FlowId}
                      </p>
                    </div> */}
                    <div className="parent-container">
                      <p
                        className="table_smart_col font-type-txt  Color-Grey1"
                        style={{ width: cell_width }}
                      >
                        {json_file_info?.table[0]?.Fqdn}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {aggregate_macro_data &&
                    aggregate_macro_data["List of computers with High"] &&
                    display_data_type === "High" && (
                      <>
                        <div
                          className="mb-b"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <div
                            className={`Bg-Orange-Red  light-bulb-type1 mr-a `}
                          />
                          <p className="font-type-menu Color-White">
                            List of computers with High (
                            {
                              aggregate_macro_data[
                                "List of computers with High"
                              ]?.length
                            }
                            )
                          </p>
                        </div>
                        {aggregate_macro_data[
                          "List of computers with High"
                        ]?.map((item, index) => (
                          <>
                            <div key={index} className="List_of_computers_line">
                              <p className="font-type-txt  Color-Grey1">
                                {item}
                              </p>
                            </div>
                          </>
                        ))}
                        {aggregate_macro_data["List of computers with High"]
                          ?.length === 0 && (
                            <p className="font-type-txt  Color-Grey1">
                              No High record
                            </p>
                          )}
                      </>
                    )}

                  {aggregate_macro_data &&
                    aggregate_macro_data["List of computers with Critical"] &&
                    display_data_type === "Critical" && (
                      <>
                        <div
                          className="mb-b"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <div className={`Bg-Red  light-bulb-type1 mr-a `} />
                          <p className="font-type-menu Color-White">
                            List of computers with Critical (
                            {
                              aggregate_macro_data[
                                "List of computers with Critical"
                              ]?.length
                            }
                            )
                          </p>
                        </div>
                        {aggregate_macro_data[
                          "List of computers with Critical"
                        ]?.map((item, index) => (
                          <>
                            <div key={index} className="List_of_computers_line">
                              <p className="font-type-txt  Color-Grey1">
                                {item}
                              </p>
                            </div>
                          </>
                        ))}
                        {aggregate_macro_data["List of computers with Critical"]
                          ?.length === 0 && (
                            <p className="font-type-txt  Color-Grey1">
                              No Critical record
                            </p>
                          )}
                      </>
                    )}

                  {/* //// the big list */}
                  {display_data_type === "prime_data" && (
                    <>
                      {/* <table border="1">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {json_file_info?.table.map((item, index) => (
          <tr key={index}>
            {headers.map((header) => {
              const value = item[header];
              const renderValue = typeof value === 'object' ? JSON.stringify(value) : value;

              const cellColor = (() => {
                if (typeof value === 'string') {
                  const lowerValue = value.toLowerCase();
                  if (lowerValue === 'critical') return 'var(--color-Red)';
                  if (lowerValue === 'high') return 'var(--color-Orange-Red)';
                }
                return 'var(--color-Grey1)'; // Default color
              })();

              return (
                <td key={header}>
                  <span
                    className="cell-content font-type-txt"
                    style={{ color: cellColor }}
                  >
                    {renderValue}
                  </span>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table> */}

                      {json_file_info?.table?.length !== 0 && (
                        <table border="1" style={{}} className="table_smart2">
                          <thead>
                            <tr>
                              {headers.map((header) => (
                                <th
                                  key={header}
                                  onClick={handleHeaderClick}
                                  className="  font-type-menu Color-White"
                                  style={{
                                    cursor: "pointer",
                                    textAlign: "left",
                                  }}
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {json_file_info?.table.map((item, index) => (
                              <tr key={index}>
                                {headers.map((header) => {
                                  const value = item[header];
                                  const renderValue =
                                    typeof value === "object"
                                      ? JSON.stringify(value)
                                      : value;

                                  const cellColor = (() => {
                                    if (typeof value === "string") {
                                      const lowerValue = value.toLowerCase();
                                      if (lowerValue === "critical")
                                        return "var(--alert-color-critical)";
                                      if (lowerValue === "high")
                                        return "var(--alert-color-high)";
                                      if (lowerValue === "medium")
                                        return "var(--alert-color-medium)";
                                      if (lowerValue === "low")
                                        return "var(--alert-color-low)";
                                      if (lowerValue === "failed")
                                        return "var(--color-Orange-Red)";
                                      if (lowerValue === "passed")
                                        return "var(--alert-color-no-alert)";
                                    }
                                    return "var(--color-Grey1)"; // Default color
                                  })();

                                  return (
                                    <td
                                      key={header}
                                      style={{
                                        maxWidth: isWidthLimited
                                          ? LIMIT_MAX_CELL_WIDTH
                                          : "none", // Apply width limit conditionally
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        backgroundColor: "",
                                      }}
                                    >
                                      <span
                                        className="cell-content font-type-txt"
                                        style={{
                                          color:
                                            header === "Severity"
                                              ? cellColor
                                              : "var(--color-Grey1)",
                                        }}
                                      >
                                        {renderValue}
                                      </span>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {/* {json_file_info?.table?.length !== 0 ? (
                        <>


 

                          <div className="table_smart">
                            {Object.keys(json_file_info?.table[0])
                             .filter(key => key !== 'FlowId' && key !== 'ClientId' && key !== '_OrgId' )  
                            .map((key) => (
                                <div
                                  className="parent-container"
                                  onClick={() => set_cell_width("500px")}
                                  key={key}
                                  style={{ 
                                    width:
                                    key === 'Name' ? '500px' :
                                    key === 'Title' ? '300px' :
                                    key === 'Details' ? '4500px' :
                                    
                                    key === 'ID' ? '70px' :
                                    key === 'TestResult' ? '70px' :
                                    key === 'VTEntries' ? '70px' :
                                    key === 'IsLolbin' ? '70px' :
                                    key === 'IsBuiltinBinary' ? '70px' :
                                    key === 'Severity' ? '70px' :     
                                    key === 'EID' ? '70px' :     
                                    key === 'Level' ? '70px' :    
                                    key === 'RecordID' ? '70px' :    
                                    
                                           cell_width
                                  }}
                                >
                                  <p className="table_smart_col font-type-menu Color-White">
                                    {key}
                                  </p>
                                </div>
                              )
                            )}
                          </div>

                          {json_file_info?.table.map((item, index) => (
                            <div key={index} className="table_smart">
                              {Object.keys(item)
                               .filter(key => key !== 'FlowId' && key !== 'ClientId' && key !== '_OrgId' )  
                              .map((key, idx) => {
                                const value = item[key];
                                return (
                                  <div
                                    className="parent-container"
                                    key={idx}
                                    style={{ 
                                      width:
                                      key === 'Name' ? '500px' :
                                      key === 'Title' ? '300px' :
                                      key === 'Details' ? '4500px' :
                                      
                                      key === 'ID' ? '70px' :
                                      key === 'TestResult' ? '70px' :
                                      key === 'VTEntries' ? '70px' :
                                      key === 'IsLolbin' ? '70px' :
                                      key === 'IsBuiltinBinary' ? '70px' :
                                      key === 'Severity' ? '70px' :     
                                      key === 'EID' ? '70px' :     
                                      key === 'Level' ? '70px' :    
                                      key === 'RecordID' ? '70px' :    

                                             cell_width
                                    }}
                                  >
                                    <div className="table_smart_col">
 

                                      {typeof value != "object" && (
                                        <span
                                          className="cell-content font-type-txt  "
                                          style={{
                                            color: (() => {
                                              if (typeof value === "string") {
                                                const lowerValue =
                                                  value.toLowerCase();
                                                if (lowerValue === "critical")
                                                  return "var(--color-Red)";
                                                if (lowerValue === "high")
                                                  return "var(--color-Orange-Red)";
                                              }
                                              return "var(--color-Grey1)"; // Default color
                                            })(),
                                          }}
                                        >
                                          {typeof value === "object"
                                            ? JSON.stringify(value)
                                            : value}
                                        </span>
                                      )}

                                    /}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ))}


                        </>
                      ) : null} */}
                    </>
                  )}
                </>
              )}
            </div>

            {json_file_info?.fileSize != "Too big" && (
              <div className="display-flex  mt-a" style={{}}>
                {artifact_logo === "" ? null : (
                  <>
                    <p className="font-type-very-sml-txt   Color-Grey1 mr-a">
                      By:s
                    </p>{" "}
                    <img
                      src={artifact_logo}
                      alt="logo"
                      maxwidth="140px"
                      height="30"
                    />
                  </>
                )}{" "}
                <div />
                <div
                  className="mt-c"
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    gap: "10px",
                    marginLeft: "auto",
                  }}
                >
                  <button
                    className="btn-type3"
                    onClick={() =>
                      handle_click_download(json_file_info, backEndURL)
                    }
                  >
                    <p className="font-type-menu ">Download Data</p>
                    <DownloadIconButton className="icon-type1 " />{" "}
                  </button>
                  <button className="btn-type2   " onClick={handleClose}>
                    <p className="font-type-menu ">{buttonTitle}</p>{" "}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export const PopUp_For__Nuclei__response = (props) => {
  const {
    popUp_show,
    set_popUp_show,
    buttonTitle,
    json_file_info,
    json_file_data,
    set_PopUp_All_Good__show,
    set_PopUp_All_Good__txt, set_PopUp_Error__show, set_PopUp_Error__txt
  } = props;
  const {
    all_Tools,
    backEndURL,
    DownloadProgressBar,
    setDownloadProgressBar,
    setDownloadList,
  } = useContext(GeneralContext);
  const [module_logo, set_module_logo] = useState("");
  const [display_data_type, set_display_data_type] = useState("prime_data");
  const [severityNames, setSeverityNames] = useState([
    "Critical",
    "High",
    "Medium",
    "Low",
  ]);
  const [severityCount, setSeverityCount] = useState([0, 0, 0, 0]);
  console.log("json_file_info", json_file_info);
  console.log("json_file_data", json_file_data);

  const handle_click_download = (file, backEndURL) => {
    console.log("handle_click_download");
    set_PopUp_All_Good__show(true);
    set_PopUp_All_Good__txt({
      HeadLine: "Download Start",
      paragraph:
        "This download can take a few minutes. The file will appear in your download folder once the process is complete.",
      buttonTitle: "Close",
    });
    if (file?.fileSize === "Too big") {
      console.log("handle_click_download  - Too big ");
      handle_download_Json_File(
        file,
        backEndURL,
        DownloadProgressBar,
        setDownloadProgressBar,
        setDownloadList, set_PopUp_Error__show, set_PopUp_Error__txt
      );

      set_popUp_show(false);
    } else {
      handle_download_Json_File(file,
        backEndURL,
        DownloadProgressBar,
        setDownloadProgressBar,
        setDownloadList, set_PopUp_Error__show, set_PopUp_Error__txt);
    }
  };

  useEffect(() => {
    // Return early if json_file_info is not a non-empty array
    if (!Array.isArray(json_file_info) || json_file_info.length === 0) {
      return;
    }

    // Initialize counts for each severity level
    const severityCounts = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    };

    // Loop through the array and update severityCounts
    json_file_info.forEach((item) => {
      if (item && item?.info?.severity) {
        const severity = item?.info?.severity.toLowerCase(); // Normalize to lower case
        if (severity === "critical") {
          severityCounts.Critical++;
        } else if (severity === "high") {
          severityCounts.High++;
        } else if (severity === "medium") {
          severityCounts.Medium++;
        } else if (severity === "low") {
          severityCounts.Low++;
        }
      }
    });

    // Convert severityCounts to arrays for state
    const counts = severityNames.map((name) => severityCounts[name]);

    // Update state with the new severity names and counts
    setSeverityCount(counts);
  }, [json_file_info]);

  console.log("severityNames", severityNames);
  console.log("severityCount", severityCount);

  useEffect(() => {
    if (
      json_file_data === undefined ||
      json_file_data === "" ||
      json_file_data === null
    ) {
      return;
    }
    if (all_Tools === undefined || all_Tools === "" || all_Tools === null) {
      return;
    }
    if (json_file_data.length == 0 || all_Tools.length == 0) {
      return;
    }

    const Nuclei_tool_info = all_Tools?.filter(
      (word) => word?.tool_id === "2001005"
    );
    const logoAddress_1 = Nuclei_tool_info[0]?.logoAddress_1;
    if (logoAddress_1 === undefined) {
      return;
    }
    const bbb = require(`${logoAddress_1}`);
    set_module_logo(bbb);
  }, [json_file_data]);

  useEffect(() => {
    set_popUp_show(popUp_show);
  }, [popUp_show]);

  function handleClickOutside(e) {
    if (e.target.className === "PopUp-background") {
      set_popUp_show(false);
    }
  }

  function handleClose() {
    set_popUp_show(false);
  }

  console.log("PopUp_For__Nuclei__response_tmp  333");

  return (
    <>
      {popUp_show && (
        <div className={`PopUp-background`} onClick={handleClickOutside}>
          <div
            className={`PopUp-content`}
            style={{
              width: json_file_info?.fileSize == "Too big" ? "auto" : "70%",
            }}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            {/* <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-c)', width: '100%' }}> */}
            <div className="velociraptor_response_all_top mb-d">
              <div
                className="  mb-c"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-c)",
                  width: "100%",
                }}
              >
                <PreviewBox_type5_hunt_data_tabla
                  HeadLine="Hunt Data"
                  is_popup={true}
                  artifact_or_module={"Module"}
                  display_y_axis={false}
                  Artifact={json_file_data?.ModuleName}
                  StartDate={
                    json_file_data?.StartDate
                      ? format_date_type_c(json_file_data?.StartDate)
                      : "NA"
                  }
                  HuntID={
                    json_file_info?.UniqueID ? json_file_info?.UniqueID : "NA"
                  }
                  Status={json_file_data?.Status}
                  Error={
                    json_file_data?.Error === "" ? (
                      <>None</>
                    ) : (
                      <>{json_file_data?.Error}</>
                    )
                  }
                />

                {json_file_data?.Arguments && (
                  <>
                    <PreviewBox_type9_arguments
                      HeadLine="Arguments"
                      Arguments={json_file_data?.Arguments}
                      is_popup={true}
                    />
                  </>
                )}

                {/* const [severityNames, setSeverityNames] = useState([]);
const [severityCount, setSeverityCount] = useState([]); */}

                {/* <PreviewBox_type3_bar
                      HeadLine="Vulnerabilities"
                      bar_numbers={
                        severityCount ? severityCount
                      
                          : [0, 0, 0, 0]
                      }
                      bar_headlines={
                        severityNames
                          ? severityNames
                          : ["Critical", "High", "Medium", "Low"]
                      }
                      bar_title_legend={"Vulnerabilities"}
                      is_popup={true}
                      display_y_axis={false}
                      colors={"Alert"}
                      enable_hover={true}
                      display_this={display_data_type}
                      set_display_this={set_display_data_type}
                      display_this_value={"prime_data"}
                    /> */}

                {json_file_info && json_file_info.fileSize != "Too big" && (
                  <PreviewBox_respo_chart
                    display_type={"pie"} // pie , bar
                    allow_wide={true}
                    allow_wide_min_wide={"480px"}
                    display_y_axis={false} // for the bar
                    HeadLine={`Severity`}
                    read_more_icon={""}
                    description_show={false}
                    description_short={
                      "Centralized hub for integrating client data and insights seamlessly..."
                    }
                    description_max_length={12}
                    read_more={
                      "Report aggregates data on all clients that have established connections to the network, regardless of their status or activity level. This comprehensive view includes information on the total number of clients, connection patterns, and any associated metadata. Understanding this distribution helps in assessing the network’s overall exposure and usage trends. It also aids in identifying any unexpected spikes in connections or unusual client behavior, which could signal potential security issues. By analyzing this data, administrators can ensure proper client management and enhance their network’s security posture."
                    }
                    bar_numbers={severityCount ? severityCount : [0, 0, 0, 0]}
                    bar_headlines={
                      severityNames
                        ? severityNames
                        : ["Critical", "High", "Medium", "Low"]
                    }
                    enable_hover={false}
                    display_this_value={"prime_data"}
                    is_popup={true}
                    colors={"Alert"} // Basic , Alert
                    date={"NA"} // "NA"
                    box_height={"240px"}
                  />
                )}

                <PreviewBox_type1_number_no_filters
                  HeadLine="Object Find"
                  resource_type_id={null}
                  BigNumber={json_file_info?.length}
                  SmallNumberTxt={""}
                  SmallNumber={``}
                  StatusColor=""
                  date={"NA"}
                  is_popup={true}
                  txt_color={""}
                  display_this={display_data_type}
                  set_display_this={set_display_data_type}
                  display_this_value={"prime_data"}
                />
              </div>

              {/* <div style={{ marginLeft: "var(--space-c)" }}>








            





              </div> */}

              <div></div>
            </div>

            <div className="response_table_all_lists">
              {Array.isArray(json_file_info) &&
                json_file_info?.map((Info, index) => {
                  return (
                    <div key={index}>
                      <table className="response_table">
                        <p
                          className=" font-type-txt   Color-Blue-Glow  tagit_type1   mb-b"
                          style={{ width: "fit-content" }}
                        >
                          Object No {index + 1}
                        </p>
                        {/* <p className='  font-type-menu   Color-White mb-b'>Object No {index+1}</p>    */}
                        <tr>
                          <th className="response_table_short_row">
                            <p className="  font-type-menu   Color-Grey1">
                              Host
                            </p>
                          </th>
                          <th className="response_table_long_row">
                            <p className=" font-type-txt  Color-Grey1">
                              {Info?.host}
                            </p>
                          </th>
                        </tr>
                        <tr>
                          <th className="response_table_short_row">
                            <p className="  font-type-menu   Color-Grey1">
                              Severity
                            </p>
                          </th>
                          <th className="response_table_long_row">
                            <p
                              className=" font-type-txt  Color-Grey1"
                              style={{ color: cellColor(Info?.info?.severity) }}
                            >
                              {/* {cellColor(Info?.info?.severity)} */}
                              {Info?.info?.severity}
                            </p>
                          </th>
                        </tr>
                        <tr>
                          <th className="response_table_short_row">
                            <p className="  font-type-menu   Color-Grey1">
                              Type
                            </p>
                          </th>
                          <th className="response_table_long_row">
                            <p className=" font-type-txt  Color-Grey1">
                              {Info?.type}
                            </p>
                          </th>
                        </tr>
                        <tr>
                          <th className="response_table_short_row">
                            <p className="  font-type-menu   Color-Grey1">
                              matcher-status
                            </p>
                          </th>
                          <th className="response_table_long_row">
                            <p className=" font-type-txt  Color-Grey1">
                              {Info
                                ? Info["matcher-status"]
                                  ? "True"
                                  : "False"
                                : "not defined"}
                            </p>
                          </th>
                        </tr>
                        <tr>
                          <th className="response_table_short_row">
                            <p className="  font-type-menu   Color-Grey1">
                              template-id
                            </p>
                          </th>
                          <th className="response_table_long_row">
                            <p className=" font-type-txt  Color-Grey1">
                              {Info ? Info["template-id"] : "not defined"}
                            </p>
                          </th>
                        </tr>
                        <tr>
                          <th className="response_table_short_row">
                            <p className="  font-type-menu   Color-Grey1">
                              severity
                            </p>
                          </th>
                          <th className="response_table_long_row">
                            <p className=" font-type-txt  Color-Grey1">
                              {Info?.info?.severity}
                            </p>
                          </th>
                        </tr>
                        <tr>
                          <th className="response_table_short_row">
                            <p className="  font-type-menu   Color-Grey1">
                              name
                            </p>
                          </th>
                          <th className="response_table_long_row">
                            <p className=" font-type-txt  Color-Grey1">
                              {Info?.info?.name}
                            </p>
                          </th>
                        </tr>
                      </table>
                    </div>
                  );
                })}
            </div>

            <div className="display-flex mt-c" style={{}}>
              <p className="font-type-very-sml-txt   Color-Grey1 mr-a">By:</p>
              <img
                src={module_logo}
                alt="logo"
                maxwidth="140px"
                height="30"
                style={{ marginRight: "auto" }}
              />

              <div />

              <div
                style={{ display: "flex", justifyContent: "end", gap: "10px" }}
              >
                <button className="btn-type3">
                  <p
                    className="font-type-menu "
                    onClick={() =>
                      handle_click_download(json_file_info, backEndURL)
                    }
                  >
                    Download JSON
                  </p>
                  <DownloadIconButton className="icon-type1 " />{" "}
                </button>

                {/* <button className="btn-type2    " onClick={()=>handle_download_Json_File(json_file_info)} ><p className='font-type-menu'>Download JSON</p>  </button>  */}
                <button className="btn-type2   " onClick={handleClose}>
                  <p className="font-type-menu ">{buttonTitle}</p>{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PopUp_For_Shodan_response = (props) => {
  const {
    popUp_show,
    set_popUp_show,
    set_PopUp_All_Good__show,
    set_PopUp_All_Good__txt,
    buttonTitle,
    json_file_info,
    set_json_file_info,
    json_file_data, set_PopUp_Error__show, set_PopUp_Error__txt
  } = props;
  const {
    all_Tools,
    backEndURL,
    DownloadProgressBar,
    setDownloadProgressBar,
    setDownloadList,
  } = useContext(GeneralContext);

  const [module_logo, set_module_logo] = useState("");
  const [aggregate_macro_data, set_aggregate_macro_data] = useState({});
  const [display_this_domain, set_display_this_domain] = useState("prime_data");
  const [display_this_data, set_display_this_data] = useState({});
  const [all_matches, set_all_matches] = useState(0);
  const [sort_by, set_sort_by] = useState("Domain");
  const [firstTimeData, setfirstTimeData] = useState(true); // usewith useeffect to now the first load and to sort

  console.log("----------------- json_file_info", json_file_info);
  console.log("-------------------  json_file_data", json_file_data);

  const handle_click_display_data = (Domain) => {
    if (!Domain || Domain === "") {
      set_display_this_domain({});
      console.log("no domain value");
      return;
    }
    if (display_this_domain === Domain) {
      set_display_this_domain("prime_data");
      return;
    } else {
      // set_display_this_data(json_file_info)
      set_display_this_domain(Domain);
      const [filter] = json_file_info.filter(
        (data) => data.Domain.asset_string === Domain
      );
      set_display_this_data(filter);
    }
  };

  const handle_close_list = () => {
    console.log("handle_close_list");
    set_display_this_domain("prime_data");
    set_display_this_data({});
  };

  const handle_click_download = (file, backEndURL) => {
    console.log("handle_click_download", file);
    set_PopUp_All_Good__show(true);
    set_PopUp_All_Good__txt({
      HeadLine: "Download Start",
      paragraph:
        "This download can take a few minutes. The file will appear in your download folder once the process is complete.",
      buttonTitle: "Close",
    });
    if (file?.fileSize === "Too big") {
      console.log("handle_click_download  - Too big ");
      handle_download_Json_File(
        file,
        backEndURL,
        DownloadProgressBar,
        setDownloadProgressBar,
        setDownloadList, set_PopUp_Error__show, set_PopUp_Error__txt
      );

      set_popUp_show(false);
    } else {
      handle_download_Json_File(
        file,
        backEndURL,
        DownloadProgressBar,
        setDownloadProgressBar,
        setDownloadList, set_PopUp_Error__show, set_PopUp_Error__txt
      );
    }
  };

  ///// combine all maches
  useEffect(() => {
    if (!json_file_info) {
      return;
    }
    let totalMatches = 0;
    for (let i = 0; i < json_file_info.length; i++) {
      const response = json_file_info[i]?.Response;
      const matches =
        response === "" ||
          response === undefined ||
          response?.total === undefined
          ? 0
          : response.total;

      totalMatches += matches;
    }
    console.log("totalMatches", totalMatches);

    set_all_matches(totalMatches);
  }, [json_file_info]);

  /// logo preview
  useEffect(() => {
    if (
      json_file_data === undefined ||
      json_file_data === "" ||
      json_file_data === null
    ) {
      return;
    }
    if (all_Tools === undefined || all_Tools === "" || all_Tools === null) {
      return;
    }
    if (json_file_data.length == 0 || all_Tools.length == 0) {
      return;
    }

    const [tool_info] = all_Tools?.filter(
      (word) => word?.Tool_name === json_file_data?.ModuleName
    );

    const logoAddress_1 = tool_info?.logoAddress_1;
    if (logoAddress_1 === undefined) {
      return;
    }
    const bbb = require(`${logoAddress_1}`);
    set_module_logo(bbb);
  }, [json_file_data]);

  useEffect(() => {
    set_popUp_show(popUp_show);
  }, [popUp_show]);

  function handleClickOutside(e) {
    if (e.target.className === "PopUp-background") {
      set_popUp_show(false);
    }
  }

  function handleClose() {
    set_popUp_show(false);
  }

  const do_sort = (column) => {
    // json_file_info,
    // set_json_file_info,
    console.log("sort this column: ", column);

    if (!column) {
      console.log("Can't sort ", column);
      return;
    }

    if (column === sort_by) {
      console.log("It's already sorted like this, reversing the order");
      const sorted = [...json_file_info].sort((a, b) => {
        if (b[column] < a[column]) return -1;
        if (b[column] > a[column]) return 1;
        return 0;
      });
      console.log("Sorted descending:", sorted);
      set_json_file_info(sorted);
      set_sort_by(""); // Reset sort_by to allow toggling between asc and desc
    } else {
      set_sort_by(column);
      const sorted = [...json_file_info].sort((a, b) => {
        if (a[column] < b[column]) return -1;
        if (a[column] > b[column]) return 1;
        return 0;
      });
      console.log("Sorted ascending:", sorted);
      set_json_file_info(sorted);
    }
  };

  // for first load  =>  sorting the list
  useEffect(() => {
    if (json_file_info?.length >= 2 && firstTimeData) {
      do_sort("Domain");
      setfirstTimeData(false);
    }
  }, [json_file_info]);

  return (
    <>
      {popUp_show && (
        <div className={`PopUp-background`} onClick={handleClickOutside}>
          <div
            className={`PopUp-content`}
            style={{
              width: json_file_info?.fileSize == "Too big" ? "auto" : "80%",
            }}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            <div className="velociraptor_response_all_top ">
              <div className="velociraptor_response_top_texts  "> </div>

              <div className="pop-up-top-boxes-macro PreviewBox-of-pop-up-all">
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--space-c)",
                    width: "100%",
                  }}
                >
                  <PreviewBox_type5_hunt_data_tabla
                    HeadLine="Hunt Data"
                    artifact_or_module={"Module"}
                    is_popup={true}
                    StartDate={
                      json_file_data?.StartDate
                        ? format_date_type_c(json_file_data?.StartDate)
                        : "NA"
                    }
                    Artifact={json_file_data?.ModuleName}
                    HuntID={json_file_info?.huntid || "NA"}
                    Status={json_file_data?.Status || "NA"}
                    Error={
                      json_file_data?.Error === "" ? (
                        <>None</>
                      ) : (
                        <>{json_file_data?.Error}</>
                      )
                    }
                  />

                  {json_file_data?.Arguments && (
                    <>
                      <PreviewBox_type9_arguments
                        HeadLine="Arguments"
                        Arguments={json_file_data?.Arguments}
                        is_popup={true}
                      />
                    </>
                  )}

                  {json_file_info && json_file_info.fileSize != "Too big" && (
                    <PreviewBox_respo_chart
                      display_type={"pie"} // pie , bar
                      allow_wide={true}
                      allow_wide_min_wide={"480px"}
                      display_y_axis={false} // for the bar
                      HeadLine={`Domains found`}
                      read_more_icon={""}
                      description_show={false}
                      description_short={
                        "Centralized hub for integrating client data and insights seamlessly..."
                      }
                      description_max_length={12}
                      read_more={
                        "Report aggregates data on all clients that have established connections to the network, regardless of their status or activity level. This comprehensive view includes information on the total number of clients, connection patterns, and any associated metadata. Understanding this distribution helps in assessing the network’s overall exposure and usage trends. It also aids in identifying any unexpected spikes in connections or unusual client behavior, which could signal potential security issues. By analyzing this data, administrators can ensure proper client management and enhance their network’s security posture."
                      }
                      bar_numbers={
                        json_file_info?.map((aaaa) =>
                          aaaa?.Response === ""
                            ? 0
                            : aaaa?.Response?.matches?.length
                        ) ?? [0, 0, 0, 0]
                      }
                      bar_headlines={
                        json_file_info?.map(
                          (aaaa) => aaaa?.Domain?.asset_string
                        ) || []
                      }
                      enable_hover={false}
                      display_this_value={"prime_data"}
                      is_popup={true}
                      colors={"Basic"} // Basic , Alert
                      date={"NA"} // "NA"
                      box_height={"240px"}
                    />
                  )}
                  {json_file_info?.fileSize != "Too big" && (
                    <PreviewBox_type1_number_no_filters
                      HeadLine="Tested"
                      resource_type_id={null}
                      BigNumber={
                        json_file_info?.length ? json_file_info?.length : "NA"
                      }
                      SmallNumberTxt={"Domains"}
                      SmallNumber={``}
                      StatusColor="blue"
                      date={"NA"}
                      is_popup={true}
                      txt_color={""}
                      display_this={display_this_domain}
                      set_display_this={set_display_this_domain}
                      display_this_value={"High"}
                    />
                  )}
                  {json_file_info?.fileSize != "Too big" && (
                    <PreviewBox_type1_number_no_filters
                      HeadLine="Matches"
                      resource_type_id={null}
                      BigNumber={all_matches ?? "NA"}
                      SmallNumberTxt={"From all Domains"}
                      SmallNumber={``}
                      StatusColor="blue"
                      date={"NA"}
                      is_popup={true}
                      txt_color={""}
                      display_this={display_this_domain}
                      set_display_this={set_display_this_domain}
                      display_this_value={"High"}
                    />
                  )}
                </div>

                <div style={{ width: "100%" }}>
                  <div style={{}}>
                    {display_this_domain != "prime_data" && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        className="mb-b"
                      >
                        <p
                          className="resource-group-list-item   font-type-h4  Color-White ml-b  "
                          style={{ width: "60%", minWidth: "60%" }}
                        >
                          {display_this_domain}
                        </p>
                        <div
                          className="display-flex justify-content-end  "
                          style={{ marginRight: " " }}
                        >
                          <button
                            className="PopUp-Close-btn"
                            onClick={handle_close_list}
                          >
                            <CloseButton className="PopUp-Close-btn-img" />{" "}
                          </button>
                        </div>
                      </div>
                    )}

                    {display_this_domain === "prime_data" &&
                      json_file_info?.fileSize != "Too big" && (
                        <div className="resource-group-list-keyNames mb-a  ">
                          <div className="resource-group-list-item list-item-big  ml-b ">
                            <p
                              className="font-type-menu  make-underline Color-White"
                              onClick={() => do_sort("Domain")}
                            >
                              Domain
                            </p>
                          </div>
                          <div
                            className="resource-group-list-item list-item-small"
                            style={{ marginRight: "26px", textAlign: "right" }}
                          >
                            <p className="font-type-menu  make-underline Color-White mr-b">
                              Matches
                            </p>
                          </div>
                        </div>
                      )}

                    {display_this_data?.Response?.matches?.length > 0 && (
                      <div className="resource-group-list-keyNames mb-a  ">
                        <div className="resource-group-list-item list-item-big  ml-b ">
                          <p className="font-type-menu  make-underline Color-White">
                            ISP
                          </p>
                        </div>
                        <div className="resource-group-list-item list-item-small">
                          <p className="font-type-menu make-underline  Color-White ">
                            Org
                          </p>
                        </div>
                        <div className="resource-group-list-item list-item-big">
                          <p className="font-type-menu  make-underline   Color-White ml-a">
                            Tags
                          </p>
                        </div>
                        <div className="resource-group-list-item list-item-small">
                          <p className="font-type-menu  make-underline Color-White ">
                            IP Str
                          </p>
                        </div>
                        <div className="resource-group-list-item list-item-small">
                          <p className="font-type-menu  make-underline Color-White ">
                            Product
                          </p>
                        </div>
                        <div className="resource-group-list-item list-item-small">
                          <p className="font-type-menu  make-underline Color-White ">
                            Asn
                          </p>
                        </div>
                        <div className="resource-group-list-item list-item-small">
                          <p className="font-type-menu  make-underline Color-White ">
                            Transport
                          </p>
                        </div>
                        <div className="resource-group-list-item list-item-small">
                          <p className="font-type-menu  make-underline Color-White ">
                            Country
                          </p>
                        </div>
                        <div
                          className="resource-group-list-item list-item-small"
                          style={{ marginRight: "26px", textAlign: "right" }}
                        >
                          <p className="font-type-menu  make-underline Color-White ">
                            Timestamp
                          </p>
                        </div>
                      </div>
                    )}

                    {display_this_data?.Response?.matches?.length === 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100px",
                        }}
                      >
                        <p
                          className="   font-type-txt  Color-Grey1 mr-b "
                          style={{}}
                        >
                          No matches found for this domain
                        </p>
                      </div>
                    )}

                    {display_this_data?.Response === "" && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100px",
                        }}
                      >
                        <p
                          className="   font-type-txt  Color-Grey1 mr-b "
                          style={{}}
                        >
                          No matches found for this domain
                        </p>
                      </div>
                    )}
                    <div
                      className=""
                      style={{
                        height: "auto",
                        maxHeight: "300px",
                        overflowY: "scroll",
                      }}
                    >
                      {Array.isArray(json_file_info) &&
                        json_file_info?.map((Site, index) => {
                          return (
                            <div
                              className="resource-group-list-box   "
                              style={{ height: "auto", overflowY: "hidden" }}
                            >
                              {display_this_domain === "prime_data" && (
                                <div
                                  className=" resource-group-list-line   mr-b  mt-a mb-a"
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "auto",
                                  }}
                                  onClick={() =>
                                    handle_click_display_data(
                                      Site?.Domain?.asset_string
                                    )
                                  }
                                >
                                  <p
                                    className="resource-group-list-item   font-type-txt  Color-Grey1 ml-b "
                                    style={{ width: "60%", minWidth: "60%" }}
                                  >
                                    {Site?.Domain?.asset_string}
                                  </p>
                                  <p
                                    className=" resource-group-list-item  font-type-txt  Color-Grey1 pl-a "
                                    style={{
                                      width: "35%",
                                      minWidth: "35%",
                                      textAlign: "right",
                                    }}
                                  >
                                    {Site?.Response === ""
                                      ? "0"
                                      : Site?.Response?.matches?.length}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}

                      {display_this_data &&
                        display_this_data?.Response?.matches?.map(
                          (Info, index) => {
                            return (
                              <div
                                className="resource-group-list-line resource-group-list-line-not-hoverd"
                                style={{ backgroundColor: "", height: "" }}
                                key={index}
                              >
                                <p className="resource-group-list-item  resource-group-list-item-not-hoverd  font-type-txt  Color-Grey1  list-item-big  ml-b">
                                  {Info?.isp}
                                </p>
                                <p className="resource-group-list-item  resource-group-list-item-not-hoverd  font-type-txt  Color-Grey1  list-item-small">
                                  {Info?.org}
                                </p>
                                <div
                                  className=" resource-group-list-item resource-group-list-item-not-hoverd  font-type-txt  Color-Grey1  list-item-big "
                                  style={{ display: "flex" }}
                                >
                                  {Info?.tags &&
                                    Info?.tags.length > 0 &&
                                    Info?.tags?.map((tag, index) => (
                                      <p
                                        className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1"
                                        key={index}
                                      >
                                        {tag}
                                      </p>
                                    ))}
                                </div>
                                <p className="resource-group-list-item resource-group-list-item-not-hoverd    font-type-txt  Color-Grey1  list-item-small">
                                  {Info?.ip_str}
                                </p>
                                <p className="resource-group-list-item  resource-group-list-item-not-hoverd   font-type-txt  Color-Grey1  list-item-small">
                                  {Info?.product}
                                </p>
                                <p className="resource-group-list-item   resource-group-list-item-not-hoverd  font-type-txt  Color-Grey1  list-item-small">
                                  {Info?.asn}
                                </p>
                                <p className="resource-group-list-item   resource-group-list-item-not-hoverd  font-type-txt  Color-Grey1  list-item-small">
                                  {Info?.transport}
                                </p>
                                <p className="resource-group-list-item   resource-group-list-item-not-hoverd  font-type-txt  Color-Grey1  list-item-small">
                                  {Info?.location?.country_name}
                                </p>
                                <p
                                  className="resource-group-list-item resource-group-list-item-not-hoverd font-type-txt  Color-Grey1  list-item-small "
                                  style={{ textAlign: "right" }}
                                >
                                  {Info?.timestamp &&
                                    format_date_type_a(Info?.timestamp)}
                                </p>
                              </div>
                            );
                          }
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {json_file_info?.fileSize === "Too big" && (
              <div
                className="mt-c "
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                <div>
                  <p className="  font-type-txt   Color-Grey1  ">
                    Data file is too big.
                    {json_file_info?.mbSize && (
                      <> ({Math.round(json_file_info?.mbSize)}Mb)</>
                    )}
                    <br />
                    You can download it as a JSON file.
                  </p>
                  <button
                    className="btn-type3   mt-a"
                    style={{ marginRight: "auto", marginLeft: "-5px" }}
                  >
                    <p
                      className="font-type-menu  "
                      onClick={() =>
                        handle_click_download(json_file_info, backEndURL)
                      }
                    >
                      Download JSON
                    </p>
                    <DownloadIconButton className="icon-type1 " />{" "}
                  </button>
                </div>

                <div
                  className=""
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {module_logo === "" ? null : (
                    <>
                      <p className="font-type-very-sml-txt   Color-Grey1 mr-a">
                        By:
                      </p>{" "}
                      <img
                        src={module_logo}
                        alt="logo"
                        maxwidth="140px"
                        height="30"
                      />
                    </>
                  )}
                  <button
                    className="btn-type2 "
                    style={{ marginLeft: "auto" }}
                    onClick={handleClose}
                  >
                    <p className="font-type-menu ">{buttonTitle}</p>{" "}
                  </button>
                </div>
              </div>
            )}
            {json_file_info?.fileSize != "Too big" && (
              <div className="display-flex  mt-a" style={{}}>
                {module_logo === "" ? null : (
                  <>
                    <p className="font-type-very-sml-txt   Color-Grey1 mr-a">
                      By:
                    </p>{" "}
                    <img
                      src={module_logo}
                      alt="logo"
                      maxwidth="140px"
                      height="30"
                    />
                  </>
                )}
                <div />
                <div
                  className="mt-c"
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    gap: "10px",
                    marginLeft: "auto",
                  }}
                >
                  <button
                    className="btn-type3"
                    onClick={() =>
                      handle_click_download(json_file_info, backEndURL)
                    }
                  >
                    <p className="font-type-menu ">Download Full Data</p>
                    <DownloadIconButton className="icon-type1 " />{" "}
                  </button>
                  <button className="btn-type2   " onClick={handleClose}>
                    <p className="font-type-menu ">{buttonTitle}</p>{" "}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export const PopUp_For_LeakCheck_response = (props) => {
  const {
    popUp_show,
    set_popUp_show,
    set_PopUp_All_Good__show,
    set_PopUp_All_Good__txt,
    buttonTitle,
    json_file_info,
    set_json_file_info,
    json_file_data, set_PopUp_Error__show, set_PopUp_Error__txt
  } = props;
  const {
    all_Tools,
    backEndURL,
    DownloadProgressBar,
    setDownloadProgressBar,
    setDownloadList,
  } = useContext(GeneralContext);

  const [module_logo, set_module_logo] = useState("");
  const [aggregate_macro_data, set_aggregate_macro_data] = useState({});
  const [display_this_domain, set_display_this_domain] = useState("prime_data");
  const [display_this_data, set_display_this_data] = useState({});
  const [all_matches, set_all_matches] = useState(0);
  const [sort_by, set_sort_by] = useState("Domain");
  const [firstTimeData, setfirstTimeData] = useState(true); // usewith useeffect to now the first load and to sort
  const [isWidthLimited, setIsWidthLimited] = useState(true); // State to toggle width

  console.log("----------------- json_file_info", json_file_info);
  console.log("-------------------  json_file_data", json_file_data);
  const handleHeaderClick = () => {
    setIsWidthLimited(!isWidthLimited); // Toggle the width limit
  };

  const handle_click_display_leck_data = (Domain) => {
    console.log("handle_click_display_data", Domain);

    if (!Domain || Domain === "") {
      set_display_this_domain({});
      console.log("no domain value");
      return;
    }
    if (display_this_domain === Domain) {
      set_display_this_domain("prime_data");
      return;
    } else {
      // set_display_this_data(json_file_info)
      set_display_this_domain(Domain);
      const [filter] = json_file_info.filter(
        (data) => data.Name?.asset_string === Domain
      );

      console.log("filter", filter);

      set_display_this_data(filter);
    }
  };

  const handle_close_list = () => {
    console.log("handle_close_list");
    set_display_this_domain("prime_data");
    set_display_this_data({});
  };

  const handle_click_download = (file, backEndURL) => {
    console.log("handle_click_download", file);
    set_PopUp_All_Good__show(true);
    set_PopUp_All_Good__txt({
      HeadLine: "Download Start",
      paragraph:
        "This download can take a few minutes. The file will appear in your download folder once the process is complete.",
      buttonTitle: "Close",
    });
    if (file?.fileSize === "Too big") {
      console.log("handle_click_download  - Too big ");
      handle_download_Json_File(
        file,
        backEndURL,
        DownloadProgressBar,
        setDownloadProgressBar,
        setDownloadList, set_PopUp_Error__show, set_PopUp_Error__txt
      );

      set_popUp_show(false);
    } else {
      handle_download_Json_File(
        file,
        backEndURL,
        DownloadProgressBar,
        setDownloadProgressBar,
        setDownloadList, set_PopUp_Error__show, set_PopUp_Error__txt
      );
    }
  };

  ///// combine all maches
  useEffect(() => {
    if (!json_file_info) {
      return;
    }
    let totalMatches = 0;
    for (let i = 0; i < json_file_info.length; i++) {
      const response = json_file_info[i]?.Response;
      const matches =
        response === "" || response === undefined
          ? 0
          : response?.found ?? response?.length;

      totalMatches += matches;
    }
    console.log("totalMatches", totalMatches);

    set_all_matches(totalMatches);
  }, [json_file_info]);

  /// logo preview
  useEffect(() => {
    if (
      json_file_data === undefined ||
      json_file_data === "" ||
      json_file_data === null
    ) {
      return;
    }
    if (all_Tools === undefined || all_Tools === "" || all_Tools === null) {
      return;
    }
    if (json_file_data.length == 0 || all_Tools.length == 0) {
      return;
    }

    const [tool_info] = all_Tools?.filter(
      (word) => word?.Tool_name === json_file_data?.ModuleName
    );

    const logoAddress_1 = tool_info?.logoAddress_1;
    if (logoAddress_1 === undefined) {
      return;
    }
    const bbb = require(`${logoAddress_1}`);
    set_module_logo(bbb);
  }, [json_file_data]);

  useEffect(() => {
    set_popUp_show(popUp_show);
  }, [popUp_show]);

  function handleClickOutside(e) {
    if (e.target.className === "PopUp-background") {
      set_popUp_show(false);
    }
  }

  function handleClose() {
    set_popUp_show(false);
  }

  const do_sort = (column) => {
    console.log("sort this column: ", column);

    if (!column) {
      console.log("Can't sort ", column);
      return;
    }

    // Utility function to get nested property
    const getNestedValue = (obj, path) => {
      return path.split(".").reduce((acc, part) => acc && acc[part], obj);
    };

    // Function to normalize values, treating empty strings and undefined as "0"
    const normalizeValue = (value) => {
      return value === "" || value === undefined ? "0" : value;
    };

    if (column === sort_by) {
      console.log("It's already sorted like this, reversing the order");
      const sorted = [...json_file_info].sort((a, b) => {
        const valA = normalizeValue(getNestedValue(a, column));
        const valB = normalizeValue(getNestedValue(b, column));

        if (valB < valA) return -1;
        if (valB > valA) return 1;
        return 0;
      });
      console.log("Sorted descending:", sorted);
      set_json_file_info(sorted);
      set_sort_by(""); // Reset sort_by to allow toggling between asc and desc
    } else {
      set_sort_by(column);
      const sorted = [...json_file_info].sort((a, b) => {
        const valA = normalizeValue(getNestedValue(a, column));
        const valB = normalizeValue(getNestedValue(b, column));

        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
      });
      console.log("Sorted ascending:", sorted);
      set_json_file_info(sorted);
    }
  };

  // for first load  =>  sorting the list
  useEffect(() => {
    if (json_file_info?.length >= 2 && firstTimeData) {
      do_sort("Domain");
      setfirstTimeData(false);
    }
  }, [json_file_info]);

  return (
    <>
      {popUp_show && (
        <div className={`PopUp-background`} onClick={handleClickOutside}>
          <div
            className={`PopUp-content`}
            style={{
              width: json_file_info?.fileSize == "Too big" ? "auto" : "80%",
            }}
          >
            <div
              className="display-flex justify-content-end  "
              style={{ marginRight: "-40px" }}
            >
              <button className="PopUp-Close-btn" onClick={handleClose}>
                <CloseButton className="PopUp-Close-btn-img" />{" "}
              </button>
            </div>

            <div className="velociraptor_response_all_top ">
              <div className="velociraptor_response_top_texts  "> </div>

              <div className="pop-up-top-boxes-macro PreviewBox-of-pop-up-all">
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--space-c)",
                    width: "100%",
                  }}
                >
                  <PreviewBox_type5_hunt_data_tabla
                    HeadLine="Hunt Data"
                    artifact_or_module={"Module"}
                    is_popup={true}
                    StartDate={
                      json_file_data?.StartDate
                        ? format_date_type_c(json_file_data?.StartDate)
                        : "NA"
                    }
                    Artifact={json_file_data?.ModuleName}
                    HuntID={json_file_info?.huntid || "NA"}
                    Status={json_file_data?.Status || "NA"}
                    Error={
                      json_file_data?.Error === "" ? (
                        <>None</>
                      ) : (
                        <>{json_file_data?.Error}</>
                      )
                    }
                  />

                  {json_file_data?.Arguments && (
                    <>
                      <PreviewBox_type9_arguments
                        HeadLine="Arguments"
                        Arguments={json_file_data?.Arguments}
                        is_popup={true}
                      />
                    </>
                  )}

                  {json_file_info && json_file_info.fileSize != "Too big" && (
                    <PreviewBox_respo_chart
                      display_type={"pie"} // pie , bar
                      allow_wide={true}
                      allow_wide_min_wide={"480px"}
                      display_y_axis={false} // for the bar
                      HeadLine={`Name found`}
                      read_more_icon={""}
                      description_show={false}
                      description_short={
                        "Centralized hub for integrating client data and insights seamlessly..."
                      }
                      description_max_length={12}
                      read_more={
                        "Report aggregates data on all clients that have established connections to the network, regardless of their status or activity level. This comprehensive view includes information on the total number of clients, connection patterns, and any associated metadata. Understanding this distribution helps in assessing the network’s overall exposure and usage trends. It also aids in identifying any unexpected spikes in connections or unusual client behavior, which could signal potential security issues. By analyzing this data, administrators can ensure proper client management and enhance their network’s security posture."
                      }
                      bar_numbers={
                        json_file_info?.map((aaaa) =>
                          aaaa?.Response?.found !== undefined &&
                            aaaa?.Response?.found !== null
                            ? aaaa?.Response?.found
                            : "NA"
                        ) || [0, 0, 0, 0]
                      }
                      bar_headlines={
                        json_file_info?.map(
                          (aaaa) => aaaa?.Name?.asset_string
                        ) || []
                      }
                      enable_hover={false}
                      display_this_value={"prime_data"}
                      is_popup={true}
                      colors={"Basic"} // Basic , Alert
                      date={"NA"} // "NA"
                      box_height={"240px"}
                    />
                  )}
                  {json_file_info?.fileSize != "Too big" && (
                    <PreviewBox_type1_number_no_filters
                      HeadLine="Tested"
                      resource_type_id={null}
                      BigNumber={
                        json_file_info?.length ? json_file_info?.length : "NA"
                      }
                      SmallNumberTxt={"Items"}
                      SmallNumber={``}
                      StatusColor="blue"
                      date={"NA"}
                      is_popup={true}
                      txt_color={""}
                      display_this={display_this_domain}
                      set_display_this={set_display_this_domain}
                      display_this_value={"High"}
                    />
                  )}
                  {json_file_info?.fileSize != "Too big" && (
                    <PreviewBox_type1_number_no_filters
                      HeadLine="Matches"
                      resource_type_id={null}
                      BigNumber={all_matches ? all_matches : "NA"}
                      SmallNumberTxt={"From all items"}
                      SmallNumber={``}
                      StatusColor="blue"
                      date={"NA"}
                      is_popup={true}
                      txt_color={""}
                      display_this={display_this_domain}
                      set_display_this={set_display_this_domain}
                      display_this_value={"High"}
                    />
                  )}

                  {/* too big file note */}
                  {/* {json_file_info?.fileSize === "Too big" && (
                        <div
                          className="mt-c "
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: "column",
                          
                          }}
                        >
                          <div >
                            <p className="  font-type-txt   Color-Grey1 mt-c ">
                              Data file is too big. <br />
                              You can download it as a JSON file.
                            </p>
                            <button
                              className="btn-type3 mb-d"
                              style={{ marginRight: "auto" }}
                            >
                              <p
                                className="font-type-menu  "
                                onClick={() =>
                                  handle_click_download(
                                    json_file_info,
                                    backEndURL
                                  )
                                }
                              >
                                Download JSON
                              </p>
                              <DownloadIconButton className="icon-type1 " />{" "}
                            </button>
                          </div>
                       
                          <div
                            className=""
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {module_logo === "" ? null : (
                              <>
                                <p className="font-type-very-sml-txt   Color-Grey1 mr-a">
                                  By:
                                </p>{" "}
                                <img
                                  src={module_logo}
                                  alt="logo"
                                  maxwidth="140px"
                                  height="30"
                                />
                              </>
                            )}
                            <button
                              className="btn-type2 "
                              style={{ marginLeft: "auto" }}
                              onClick={handleClose}
                            >
                              <p className="font-type-menu ">{buttonTitle}</p>{" "}
                            </button>
                          </div>
                        </div>
                      )} */}
                </div>

                <div style={{ width: "100%" }}>
                  <div style={{}}>
                    {display_this_domain != "prime_data" && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        className="mb-b"
                      >
                        <p
                          className="resource-group-list-item   font-type-h4  Color-White ml-b  "
                          style={{ width: "60%", minWidth: "60%" }}
                        >
                          {display_this_domain}
                        </p>
                        <div
                          className="display-flex justify-content-end  "
                          style={{ marginRight: " " }}
                        >
                          <button
                            className="PopUp-Close-btn"
                            onClick={handle_close_list}
                          >
                            <CloseButton className="PopUp-Close-btn-img" />{" "}
                          </button>
                        </div>
                      </div>
                    )}

                    {display_this_domain === "prime_data" &&
                      json_file_info?.fileSize != "Too big" && (
                        <div className="resource-group-list-keyNames mb-a  ">
                          <div
                            className="resource-group-list-item list-item-big ml-b"
                            onClick={() => do_sort("Name")}
                          >
                            <p className="font-type-menu  make-underline Color-White">
                              Name
                            </p>
                          </div>
                          <div
                            className="resource-group-list-item list-item-small"
                            onClick={() => do_sort("Response.found")}
                            style={{ marginRight: "26px", textAlign: "right" }}
                          >
                            <p className="font-type-menu  make-underline Color-White mr-b">
                              Matches
                            </p>
                          </div>
                        </div>
                      )}

                    {/* { display_this_data?.Response?.result?.length > 0  &&
<div className='resource-group-list-keyNames mb-a  '  >
<div className='resource-group-list-item list-item-big  ml-b '><p className='font-type-menu  make-underline Color-White'>Email</p></div>
<div className='resource-group-list-item list-item-small'><p className='font-type-menu make-underline  Color-White '>Username</p></div>
<div className='resource-group-list-item list-item-small'><p className='font-type-menu make-underline  Color-White '>Password</p></div>
<div className='resource-group-list-item list-item-big'><p className='font-type-menu  make-underline   Color-White ml-a'>Fields</p></div>
<div className='resource-group-list-item list-item-small'><p className='font-type-menu  make-underline Color-White '>Source Name</p></div>
<div className='resource-group-list-item list-item-small'><p className='font-type-menu  make-underline Color-White '>Country</p></div>
<div className='resource-group-list-item list-item-big'><p className='font-type-menu  make-underline   Color-White ml-a'>Tags</p></div>
<div className='resource-group-list-item list-item-small' style={{marginRight:"26px" ,textAlign:"right"}}><p className='font-type-menu  make-underline Color-White '>Breach</p></div>
</div>
} */}

                    {display_this_data?.Response?.found === 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100px",
                        }}
                      >
                        <p
                          className="   font-type-txt  Color-Grey1 mr-b "
                          style={{}}
                        >
                          No matches found for this item
                        </p>
                      </div>
                    )}

                    {display_this_data?.Response === "" &&
                      display_this_data?.Error && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100px",
                          }}
                        >
                          <p
                            className="font-type-txt Color-Grey1 mr-b"
                            style={{}}
                          >
                            Error: {display_this_data?.Error}
                          </p>
                        </div>
                      )}

                    <div
                      className=""
                      style={{
                        height: "auto",
                        maxHeight: "300px",
                        overflowY: "scroll",
                      }}
                    >
                      {Array.isArray(json_file_info) &&
                        json_file_info?.map((Site, index) => {
                          return (
                            <div
                              className="resource-group-list-box   "
                              style={{ height: "auto", overflowY: "hidden" }}
                            >
                              {display_this_domain === "prime_data" && (
                                <div
                                  className=" resource-group-list-line   mr-b  mt-a mb-a"
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "auto",
                                  }}
                                  onClick={() =>
                                    handle_click_display_leck_data(
                                      Site?.Name?.asset_string
                                    )
                                  }
                                >
                                  <p
                                    className="resource-group-list-item   font-type-txt  Color-Grey1 ml-b "
                                    style={{ width: "25%", minWidth: "25%" }}
                                  >
                                    {Site?.Name?.asset_string}
                                  </p>
                                  {Site?.Error && Site?.Error != "" && (
                                    <p
                                      className="resource-group-list-item   font-type-txt  Color-Grey1 ml-b "
                                      style={{ width: "50%", minWidth: "50%" }}
                                    >
                                      {Site?.Error}
                                    </p>
                                  )}

                                  <p
                                    className=" resource-group-list-item  font-type-txt  Color-Grey1 pl-a "
                                    style={{
                                      width: "15%",
                                      minWidth: "15%",
                                      textAlign: "right",
                                    }}
                                  >
                                    {Site?.Response?.found ||
                                      Site?.Response?.found === 0 ||
                                      Site?.Response?.length
                                      ? Site?.Response?.found ??
                                      Site?.Response.length
                                      : "NA"}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}

                      {/* {display_this_data && display_this_data?.Response?.result?.map((Info, index) => {
    return (
<div className='resource-group-list-line resource-group-list-line-not-hoverd'     style={{backgroundColor:"", height:""}}    key={index} >
<p className='resource-group-list-item  resource-group-list-item-not-hoverd  font-type-txt  Color-Grey1  list-item-big  ml-b'>{ Info?.email }</p> 
<p className='resource-group-list-item  resource-group-list-item-not-hoverd  font-type-txt  Color-Grey1  list-item-small'>{ Info?.username }</p>
<p className='resource-group-list-item  resource-group-list-item-not-hoverd  font-type-txt  Color-Grey1  list-item-small'>{ Info?.password }</p>
<div className=' resource-group-list-item resource-group-list-item-not-hoverd  font-type-txt  Color-Grey1  list-item-big ' style={{display:"flex"}}>{Info?.fields &&  Info?.fields.length > 0 &&    Info?.fields?.map((tag, index) => (  <p className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1" key={index}>{tag}</p> ))}</div>
<p className='resource-group-list-item resource-group-list-item-not-hoverd    font-type-txt  Color-Grey1  list-item-small'>{ Info?.source?.name }</p> 
<p className='resource-group-list-item   resource-group-list-item-not-hoverd  font-type-txt  Color-Grey1  list-item-small'>{ Info?.country }</p>
<div className=' resource-group-list-item resource-group-list-item-not-hoverd  font-type-txt  Color-Grey1  list-item-big ' style={{display:"flex"}}>{Info?.origin &&  Info?.origin.length > 0 &&    Info?.origin?.map((tag, index) => (  <p className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1" key={index}>{tag}</p> ))}</div>
<p className='resource-group-list-item  resource-group-list-item-not-hoverd   font-type-txt  Color-Grey1  list-item-small'  style={{ textAlign:"right"}}>{ Info?.source?.breach_date }</p> 
 </div>
    );
  })} */}
                    </div>

                    {display_this_data?.Response?.length > 0 && (
                      <div
                        style={{
                          maxHeight: "300px",
                          overflowY: "auto",
                          margin: 0,
                          padding: 0,
                          border: 0,
                        }}
                      >
                        <table
                          border="0"
                          className="table_smart2"
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            border: 0,
                          }}
                        >
                          <thead
                            style={{
                              position: "sticky",
                              top: -1,
                              backgroundColor: "var(--color-Grey5)",
                              zIndex: 1,
                              margin: "0",
                              height: "42px",
                              textAlign: "left",
                            }}
                          >
                            <tr
                            //  onClick={handleHeaderClick}
                            >
                              <th className="font-type-menu Color-White pl-b">
                                Email
                              </th>
                              <th className="font-type-menu Color-White">
                                Username
                              </th>
                              <th
                                className="font-type-menu Color-White"
                                onClick={() => do_sort("password")}
                              >
                                Password
                              </th>
                              <th className="font-type-menu Color-White pl-a">
                                Fields
                              </th>
                              <th className="font-type-menu Color-White">
                                Source Name
                              </th>
                              <th className="font-type-menu Color-White">
                                Country
                              </th>
                              <th className="font-type-menu Color-White">
                                Origin
                              </th>
                              <th
                                className="font-type-menu Color-White"
                                style={{ textAlign: "right" }}
                              >
                                Breach Date{" "}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {display_this_data?.Response?.map((Info, index) => (
                              <tr key={index}>
                                <td
                                  style={{
                                    maxWidth: isWidthLimited
                                      ? LIMIT_MAX_CELL_WIDTH
                                      : "none",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    paddingLeft: "var(--space-b)",
                                  }}
                                >
                                  {Info?.email}
                                </td>
                                <td
                                  style={{
                                    maxWidth: isWidthLimited
                                      ? LIMIT_MAX_CELL_WIDTH
                                      : "none",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {Info?.username}
                                </td>
                                <td
                                  style={{
                                    maxWidth: isWidthLimited
                                      ? LIMIT_MAX_CELL_WIDTH
                                      : "none",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {Info?.password}
                                </td>
                                <td>
                                  <div
                                    className="   font-type-txt  Color-Grey1   "
                                    style={{ display: "flex" }}
                                  >
                                    {Info?.fields &&
                                      Info?.fields.length > 0 &&
                                      Info?.fields?.map((tag, index) => (
                                        <p
                                          className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1"
                                          key={index}
                                        >
                                          {tag}
                                        </p>
                                      ))}
                                  </div>
                                </td>
                                <td
                                  style={{
                                    maxWidth: isWidthLimited
                                      ? LIMIT_MAX_CELL_WIDTH
                                      : "none",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {Info?.source?.name}
                                </td>
                                <td
                                  style={{
                                    maxWidth: isWidthLimited
                                      ? LIMIT_MAX_CELL_WIDTH
                                      : "none",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {Info?.country}
                                </td>
                                <td>
                                  {" "}
                                  <div
                                    className="   font-type-txt  Color-Grey1   "
                                    style={{ display: "flex" }}
                                  >
                                    {Info?.origin &&
                                      Info?.origin.length > 0 &&
                                      Info?.origin?.map((tag, index) => (
                                        <p
                                          className="ml-a  font-type-txt   Color-Blue-Glow tagit_type1"
                                          key={index}
                                        >
                                          {tag}
                                        </p>
                                      ))}
                                  </div>
                                </td>

                                <td
                                  style={{
                                    maxWidth: isWidthLimited
                                      ? LIMIT_MAX_CELL_WIDTH
                                      : "none",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    textAlign: "right",
                                  }}
                                >
                                  {Info?.source?.breach_date}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {json_file_info?.fileSize === "Too big" && (
              <div
                className="mt-c "
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                <div>
                  <p className="  font-type-txt   Color-Grey1  ">
                    Data file is too big.
                    {json_file_info?.mbSize && (
                      <> ({Math.round(json_file_info?.mbSize)}Mb)</>
                    )}
                    <br />
                    You can download it as a JSON file.
                  </p>
                  <button
                    className="btn-type3   mt-a"
                    style={{ marginRight: "auto", marginLeft: "-5px" }}
                  >
                    <p
                      className="font-type-menu  "
                      onClick={() =>
                        handle_click_download(json_file_info, backEndURL)
                      }
                    >
                      Download JSON
                    </p>
                    <DownloadIconButton className="icon-type1 " />{" "}
                  </button>
                </div>

                <div
                  className=""
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {module_logo === "" ? null : (
                    <>
                      <p className="font-type-very-sml-txt   Color-Grey1 mr-a">
                        By:
                      </p>{" "}
                      <img
                        src={module_logo}
                        alt="logo"
                        maxwidth="140px"
                        height="30"
                      />
                    </>
                  )}
                  <button
                    className="btn-type2 "
                    style={{ marginLeft: "auto" }}
                    onClick={handleClose}
                  >
                    <p className="font-type-menu ">{buttonTitle}</p>{" "}
                  </button>
                </div>
              </div>
            )}
            {json_file_info?.fileSize != "Too big" && (
              <div className="display-flex  mt-a" style={{}}>
                {module_logo === "" ? null : (
                  <>
                    <p className="font-type-very-sml-txt   Color-Grey1 mr-a">
                      By:
                    </p>{" "}
                    <img
                      src={module_logo}
                      alt="logo"
                      maxwidth="140px"
                      height="30"
                    />
                  </>
                )}
                <div />
                <div
                  className="mt-c"
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    gap: "10px",
                    marginLeft: "auto",
                  }}
                >
                  <button
                    className="btn-type3"
                    onClick={() =>
                      handle_click_download(json_file_info, backEndURL)
                    }
                  >
                    <p className="font-type-menu ">Download Full Data</p>
                    <DownloadIconButton className="icon-type1 " />{" "}
                  </button>
                  <button className="btn-type2   " onClick={handleClose}>
                    <p className="font-type-menu ">{buttonTitle}</p>{" "}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
