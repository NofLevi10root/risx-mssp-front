import React, { useState, useEffect, useContext, useRef } from "react";

import axios from "axios";
import "./../Settings/Settings.css";
import "./custom-json-view.css";
import GeneralContext from "../../Context.js";
import { Search_comp, Search_comp_for_logs } from "../Features/Search_comp.jsx";
// import JsonView from '@uiw/react-json-view';
// import {PopUp_All_Good ,PopUp_Are_You_Sure} from '../PopUp_Smart'
import { ReactComponent as IconReverse } from "../icons/ico-reverse.svg";

function Settings_section_logs({
  show_SideBar,
  set_show_SideBar,
  usethis,
  fileName,
  headline,
  subline,
}) {
  const { backEndURL, fetchConfig } = useContext(GeneralContext);
  const [log_data, set_log_data] = useState("loading..");
  const [preview_data, set_preview_data] = useState("loading..");
  const [OpenLogSelection, setOpenLogSelection] = useState(false);
  const [ChosenTagLog, setChosenTagLog] = useState("All");

  const maxHeight = "800px";
  const lineHeight = "160%";

  // console.log("log_data" , log_data);

  const [WrapOrHScroll, setWrapOrHScroll] = useState(true);
  const [LogRefresh, setLogRefresh] = useState(false);
  const [LogRefreshCounter, setLogRefreshCounter] = useState(0);
  const logRef = useRef();
  //  const [loadig, set_loading] = useState(false);

  useEffect(() => {
    if (show_SideBar === false) {
      set_show_SideBar(true);
    }
  }, []);

  const fetchLog = async (logName, set_log_data) => {
    try {
      set_log_data("loading..");
      const res = await axios.get(`${backEndURL}/logs/get-log`, {
        params: { logName: logName, fileName: fileName },
      });

      if (res) {
        if (res?.data?.status === 200 || res?.data?.content != undefined) {
          // console.log(res?.data?.content);
          set_log_data(res?.data?.content);
          // set_preview_data(res?.data?.content);
        } else {
          set_log_data(`Failed To fetchLog ${logName}. As It does not exist`);
          set_preview_data(
            `Failed To fetchLog ${logName}. As It does not exist`
          );
        }
      }
    } catch (err) {
      console.log(err);

      set_log_data(`Error fetchLog ${logName}. message: ${err}`);
      set_preview_data(`Error fetchLog ${logName}. message: ${err}`);
    }
  };

  useEffect(() => {
    // fetchLog("log_mssp_backend",set_log_data);

    if (backEndURL) {
      fetchLog(usethis, set_log_data);
    }
    // fetchLog("log_python_main",set_log_data);
  }, [backEndURL]);

  const LogRefreshRec = async () => {
    console.log(LogRefresh, "LogRefreshLogRefresh1", LogRefreshCounter);

    if (!LogRefresh) {
      return;
    }
    await fetchLog(usethis, set_log_data);
    console.log(LogRefresh, "LogRefreshLogRefresh222222", logRef);
    logRef.current.scrollTop = 1111111111111111111111;
    setTimeout(() => {
      setLogRefreshCounter((prev) => prev + 1);
    }, 8000);
  };
  useEffect(() => {
    if (LogRefresh && LogRefreshCounter != 0) {
      LogRefreshRec();
    } else {
      if (LogRefreshCounter == 0) {
        setLogRefreshCounter(1);
      }
      console.log(
        "ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo"
      );
    }
  }, [LogRefreshCounter, LogRefresh]);

  const DownloadLog = async () => {
    try {
      const nameArr = fileName.split(".");
      nameArr.pop();
      const NameFile =
        nameArr?.join(".") +
        "_" +
        new Date()
          .toLocaleString("en-GB")
          .replace("/", "-")
          .replace(", ", "--") +
        ".log";
      console.log("DownLoad File Start ", NameFile, nameArr, fileName);
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(log_data);
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", NameFile);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.log("Error in Downloading Log File: " + fileName, error);
    }
  };

  const DeleteLog = async () => {
    try {
      console.log("fileName fileName fileName ", fileName);
      const res = await axios.post(`${backEndURL}/logs/DeleteLog`, {
        logName: usethis,
        fileName: fileName,
      });
      console.log(";ksadadnhfojh", res.data);
      if (res.data) {
        set_log_data("Deleted");
        set_preview_data("Deleted");
      } else {
      }
    } catch (error) {
      console.log("Error in Deleting Log File: " + fileName, error);
    }
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          {/* <p className="font-type-h4 Color-White mb-a">{headline}</p> */}
          <p
            className="font-type-h4 Color-White  "
            style={{
              width: "100%",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              marginRight: "20px",
            }}
          >
            {headline}
          </p>
          {headline != "Prompt" && (
            <p className="font-type-txt Color-Grey1 mb-b">{fileName}</p>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {headline != "" && (
            <>
              {" "}
              <p style={{ paddingLeft: 25, marginRight: 10 }}>Auto Refresh: </p>
              <label
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("flip");
                  setLogRefresh(!LogRefresh);
                }}
                className="switch"
              >
                <input
                  type="checkbox"
                  checked={LogRefresh}
                  // onChange={}
                  // defaultChecked={Math.random() < 0.7}
                />
                <span className="slider round"></span>
              </label>
            </>
          )}
          <p style={{ paddingLeft: 25, marginRight: 10 }}>Line Wrap: </p>
          <label
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("flip");
              setWrapOrHScroll(!WrapOrHScroll);
            }}
            className="switch"
          >
            <input
              type="checkbox"
              checked={WrapOrHScroll}
              // onChange={}
              // defaultChecked={Math.random() < 0.7}
            />
            <span className="slider round"></span>
          </label>
          <div
            className="log-download"
            onClick={DownloadLog}
            style={{
              marginLeft: 25,
              marginRight: 25,
              fontSize: 13,
            }}
          >
            Download
          </div>{" "}
          <div
            className="log-delete"
            onClick={DeleteLog}
            style={{
              marginRight: 15,
              fontSize: 13,
            }}
          >
            Delete
          </div>{" "}
          <div className="SubMenu-unit log-dropdown">
            <button
              className={`SubMenu-btn 
                "SubMenu-btn-active-and-clickable"
                       `}
              onClick={() => {
                setOpenLogSelection(!OpenLogSelection);
              }}
            >
              <p style={{ padding: 5, width: 40 }} className="font-type-menu">
                {ChosenTagLog}
              </p>
              <div className="SubMenu-gap" />
            </button>

            {OpenLogSelection && (
              <div className="SubMenu-submenu">
                {["All", "Info", "Error", "Warn"]
                  .filter((x) => x != ChosenTagLog)
                  .map((item, index) => (
                    <div
                      className="SubMenu-submenu-item"
                      onClick={() => {
                        setChosenTagLog(item);
                        setOpenLogSelection(false);
                      }}
                    >
                      {" "}
                      <p className="font-type-menu">{item}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <Search_comp_for_logs
            set_log_data={set_log_data}
            log_data_full={log_data}
            set_preview_data={set_preview_data}
            preview_data={preview_data}
            ChosenTagLog={ChosenTagLog}
            refresh={LogRefresh}
            refLog={logRef}
          />
        </div>
      </div>
      <div
        ref={logRef}
        className={`${
          WrapOrHScroll ? "log-section-scrollXNo" : "log-section-scrollXYes"
        }`}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-c)",
          maxHeight: "68vh",
          height: "auto",
          overflowY: "auto",
        }}
      >
        <table
          className="setting_table  "
          style={{ width: "100%", tableLayout: "fixed" }}
        >
          <tbody className="tbody_setting">
            <tr>
              <td
                className="  "
                style={{
                  height: "auto",
                  maxHeight: maxHeight,
                  // overflowY: "auto",
                  // overflowX: "auto",
                  whiteSpace: "pre",
                  width: "100%",
                }}
              >
                <pre
                  className={`font-type-txt Color-White log-text ${
                    WrapOrHScroll ? "text-wrap-logs" : ""
                  }`}
                  style={{
                    lineHeight: lineHeight,
                    margin: 0,
                  }}
                >
                  {preview_data}
                </pre>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Settings_section_logs;
