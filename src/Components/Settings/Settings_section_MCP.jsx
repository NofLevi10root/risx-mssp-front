import React, { useState, useEffect, useContext } from "react";

import axios from "axios";
import "./Settings.css";
import "./custom-json-view.css";
import GeneralContext from "../../Context.js";
import { ReactComponent as DownloadIconButton } from "../icons/ico-menu-download.svg";

import { PopUp_All_Good, PopUp_Are_You_Sure } from "../PopUp_Smart";
import {
  check_and_active_interval_of_python,
  kill_interval_of_python,
} from "../Features/ProcessFunctions.js";

function Settings_section_MCP({}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [ShowGuide1_2, setShowGuide1_2] = useState(false);

  const {
    backEndURL,
    set_all_Tools,
    all_Tools,
    DownloadProgressBar,
    setDownloadProgressBar,
    setDownloadList,
  } = useContext(GeneralContext);

  const [PopUp_Are_You_Sure__show, set_PopUp_Are_You_Sure__show] =
    useState(false);
  const [PopUp_Are_You_Sure__txt, set_PopUp_Are_You_Sure__txt] = useState({
    HeadLine: "Are You Sure?",
    paragraph: "The record will be deleted from the system",
    buttonTrue: "True",
    buttonFalse: "False",
  });

  async function download_Json(mbSize = 3) {
    const ResponsePath = "modules/Velociraptor/dependencies/api.config.yaml";
    console.log(
      "Hello MYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
    );

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
                setDownloadProgressBar(DownloadProgressBar);
                setDownloadList(Math.random());
              }
            } catch (error) {
              console.log("Error In Download", error);
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
      link.setAttribute("download", "api_client.yaml"); // Specify the file name here
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      console.log("File downloaded successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  const SetupGuide = () => (
    <div
      className="setup-guide"
      style={{
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#2a2a2a",
        borderRadius: "8px",
      }}
    >
      <h3 className="font-type-h4 Color-White mb-c">
        Velociraptor MCP Integration Setup Guide
      </h3>

      <div style={{ marginBottom: "20px" }}>
        <h4 className="font-type-menu Color-White">Setup Instructions</h4>

        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            backgroundColor: "#0d4f3c",
            borderRadius: "4px",
            border: "1px solid #28a745",
          }}
        >
          <p
            className="font-type-txt Color-White"
            style={{ fontWeight: "bold", color: "#28a745" }}
          >
            📝 Note: Steps 1 and 2 can be skipped if you download the API using
            the "Download Api" button above
          </p>
        </div>
        <button
          className="btn-type3 "
          style={{ marginBottom: "15px" }}
          onClick={() => setShowGuide1_2(!ShowGuide1_2)}
        >
          <p className="font-type-menu">
            {ShowGuide1_2 ? "Hide Steps 1 and 2" : "Show Steps 1 and 2"}
          </p>
        </button>
        {ShowGuide1_2 && (
          <>
            <div style={{ marginBottom: "15px" }}>
              <p
                className="font-type-txt Color-Grey1"
                style={{ fontWeight: "bold" }}
              >
                1. Create an API user in Velociraptor GUI, give it administrator
                & API roles
              </p>
              <p
                className="font-type-txt Color-Grey1"
                style={{ fontSize: "16px", fontStyle: "italic" }}
              >
                (Skip if using Download Api button)
              </p>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <p
                className="font-type-txt Color-Grey1"
                style={{ fontWeight: "bold" }}
              >
                2. Create velociraptor api.yaml
              </p>
              <p
                className="font-type-txt Color-Grey1"
                style={{ fontSize: "16px", fontStyle: "italic" }}
              >
                (Skip if using Download Api button)
              </p>
              <div
                style={{
                  backgroundColor: "#1a1a1a",
                  padding: "10px",
                  borderRadius: "4px",
                  marginTop: "5px",
                }}
              >
                <code
                  className="font-type-txt Color-Grey1"
                  style={{ fontSize: "16px" }}
                >
                  .\velociraptor-v0.74.2-windows-amd64.exe --config
                  server.config.yaml config api_client --name api --role
                  administrator,api api_client.yaml
                </code>
              </div>
            </div>
          </>
        )}

        <div style={{ marginBottom: "15px" }}>
          <p
            className="font-type-txt Color-White"
            style={{ fontWeight: "bold" }}
          >
            3. Clone repo
          </p>
          <div
            style={{
              backgroundColor: "#1a1a1a",
              padding: "10px",
              borderRadius: "4px",
              marginTop: "5px",
            }}
          >
            <code
              className="font-type-txt Color-Grey1"
              style={{ fontSize: "16px" }}
            >
              git clone https://github.com/mgreen27/mcp-velociraptor.git
            </code>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <p
            className="font-type-txt Color-White"
            style={{ fontWeight: "bold" }}
          >
            4. Modify test_api.py to appropriate location
          </p>
          <p className="font-type-txt Color-Grey1" style={{ fontSize: "16px" }}>
            Use the api_client.yaml file downloaded from the button above
          </p>
          <div
            style={{
              backgroundColor: "#1a1a1a",
              padding: "10px",
              borderRadius: "4px",
              marginTop: "5px",
            }}
          >
            <code
              className="font-type-txt Color-Grey1"
              style={{ fontSize: "16px" }}
            >
              config =
              yaml.safe_load(open("c:\\path\\to\\folder\\mcp-velociraptor\\api_client.yaml"))
            </code>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <p
            className="font-type-txt Color-White"
            style={{ fontWeight: "bold" }}
          >
            5. Test API, if everything is ok you should get back server
            information
          </p>
          <div
            style={{
              backgroundColor: "#1a1a1a",
              padding: "10px",
              borderRadius: "4px",
              marginTop: "5px",
            }}
          >
            <code
              className="font-type-txt Color-Grey1"
              style={{ fontSize: "16px" }}
            >
              python c:\path\to\folder\mcp-velociraptor\test_api.py
            </code>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <p
            className="font-type-txt Color-White"
            style={{ fontWeight: "bold" }}
          >
            6. Modify mcp_velociraptor_bridge.py to correct API config
          </p>
          <p className="font-type-txt Color-Grey1" style={{ fontSize: "16px" }}>
            Use the api_client.yaml file downloaded from the button above
          </p>
          <div
            style={{
              backgroundColor: "#1a1a1a",
              padding: "10px",
              borderRadius: "4px",
              marginTop: "5px",
            }}
          >
            <code
              className="font-type-txt Color-Grey1"
              style={{ fontSize: "16px" }}
            >
              api_client_config =
              "c:/path/to/folder/mcp-velociraptor/api_client.yaml"
            </code>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4 className="font-type-menu Color-White">With Claude Desktop</h4>

        <div style={{ marginBottom: "15px" }}>
          <p
            className="font-type-txt Color-White"
            style={{ fontWeight: "bold" }}
          >
            1. Edit
            "C:\Users\user\AppData\Roaming\Claude\claude_desktop_config.json"
            the file might not exist so either create it or enter file-{">"}settings-{">"}Developer and Claude will create it 
          </p>
          <div
            style={{
              backgroundColor: "#1a1a1a",
              padding: "10px",
              borderRadius: "4px",
              marginTop: "5px",
            }}
          >
            <pre
              className="font-type-txt Color-Grey1"
              style={{ fontSize: "16px", margin: 0 }}
            >
              {`{
    "mcpServers": {
      "velociraptor": {
        "command": "Path to python or just python/python3 if it is in your path",
        "args": [
          "c:\\\\path\\\\to\\\\file\\\\mcp-velociraptor\\\\mcp_velociraptor_bridge.py"
        ]
      }
    }
}`}
            </pre>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <p
            className="font-type-txt Color-White"
            style={{ fontWeight: "bold" }}
          >
            2. Start Claude Desktop
          </p>
          <p className="font-type-txt Color-Grey1">
            The Velociraptor MCP server should now be available in Claude
            Desktop.
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-type-menu Color-White">
          Web Interface Integration
        </h4>
        <p className="font-type-txt Color-Grey1">
          The "Download Api" button above provides a pre-configured
          api_client.yaml file, eliminating the need for manual API user
          creation and configuration generation. Simply download the file and
          use it in steps 4 and 6 above.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div>
        <p className="font-type-h4 Color-White mb-c">MCP Settings</p>
        <table className="setting_table" style={{ lineHeight: "100%" }}>
          <tbody className="tbody_setting">
            <tr>
              <td className="setting_descriptions">
                <button className="btn-type3">
                  {/* <DownloadIconButton className="icon-type1" /> */}

                  <p className="font-type-menu" onClick={download_Json}>
                    Download Api
                  </p>
                </button>
              </td>
              <td className="" style={{}}>
                <p className="font-type-txt Color-Grey1">
                  Download the velociraptor api client api
                </p>
              </td>
            </tr>
            <tr>
              <td className="setting_descriptions">
                <button
                  className="btn-type3"
                  onClick={() => setShowGuide(!showGuide)}
                >
                  <p className="font-type-menu">
                    {showGuide ? "Hide Setup Guide" : "Show Setup Guide"}
                  </p>
                </button>
              </td>
              <td className="" style={{}}>
                <p className="font-type-txt Color-Grey1">
                  View complete setup instructions for MCP integration
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        {showGuide && <SetupGuide />}
      </div>
    </>
  );
}

export default Settings_section_MCP;
