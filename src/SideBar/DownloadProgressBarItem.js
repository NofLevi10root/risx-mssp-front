import { useContext } from "react";
import GeneralContext from "../Context";
// import "./SideBar.css";

function DownloadProgressBarItem({
  item,
  itemKey,
  DownloadProgressBar,
  setDownloadProgressBar,
  upload = false,
}) {
  console.log(item, "DownloadProgressBarItem");

  // const { DownloadProgressBar, setDownloadProgressBar } =
  //   useContext(GeneralContext);

  const DeleteDownLoadBar = async () => {
    try {
      if (upload) {
      } else {
        console.log(itemKey, "delete this item");

        const tmp = { ...DownloadProgressBar };
        console.log(tmp);

        delete tmp[itemKey];
        setDownloadProgressBar(tmp);
      }
    } catch (error) {
      console.log("error in DeleteDownLoadBar ", error);
    }
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "90%",
          }}
        >
          <div
            className="mb-a mt-b"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <p
              className="font-type-very-sml-txt  Color-Grey1   mr-b"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {" "}
              {item.fileName}
            </p>
            <p className="font-type-very-sml-txt  Color-Grey1 ">
              {item.progress}%
            </p>
          </div>

          <div
            // the empty bar
            className="Bg-Grey2"
            style={{
              width: "100%",
            }}
          >
            <div
              style={{
                width: `${
                  typeof item.progress === "string" ? 70 : item.progress
                }%`,
                backgroundColor: "var(--color-DB-Blue-Glow)",
                // height: "calc(var(--space-a)  +  var(--space-b) ) ",
                height: "var(--space-a)",
                display: "flex",
                alignItems: "center",
                borderRadius: "var(--elemtns-round-corner-medium)  ",
              }}
            >
              {/* <p  className="font-type-very-sml-txt Color-Grey5 ml-a"style={{ height:'auto',  }} >{item.progress}/100</p> */}
            </div>
          </div>
        </div>

        <div
          style={{ width: "10%", marginLeft: 5 }}
          onClick={DeleteDownLoadBar}
        >
          <p style={{ fontSize: 26, color: "#fffffff" }}>x</p>
        </div>
      </div>
    </>
  );
}
export default DownloadProgressBarItem;
