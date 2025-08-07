import React, { useState, useEffect } from "react";
import { ReactComponent as IconSearch } from "../icons/ico-search.svg";
import { ReactComponent as IconTrash } from "../icons/ico-trash.svg";
import "./Search_comp.css";

const Search_comp = ({
  items_for_search,
  set_items_for_search,
  filter_string,
  set_filter_string,
}) => {
  const [all_items, set_all_items] = useState([]);

  useEffect(() => {
    if (!items_for_search) return;

    // Check if items_for_search is an array or a string
    if (Array.isArray(items_for_search)) {
      if (items_for_search.length > all_items.length) {
        set_all_items(items_for_search);
      }
    } else if (typeof items_for_search === "string") {
      // Handle the case where items_for_search is a single string
      set_all_items([items_for_search]);
    }
  }, [items_for_search]);

  useEffect(() => {
    if (!filter_string) {
      set_items_for_search(all_items);
      return;
    }

    const filterLower = filter_string.toLowerCase();

    const filteredItems = all_items.filter((item) => {
      if (typeof item === "string") {
        // If the item is a string, check if it includes the filter string
        return item.toLowerCase().includes(filterLower);
      }

      // If the item is an object, check its properties
      for (const key in item) {
        if (
          key === "description_long" ||
          key === "iconAddress" ||
          key === "logoAddress_1" ||
          key === "logoAddress_2" ||
          key === "toolURL" ||
          key === "LastRun" ||
          key === "ServicePackage" ||
          key === "ShowInUi" ||
          key === "Status" ||
          key === "isActive" ||
          key === "threshold_time" ||
          key === "useResourceType"
        ) {
          continue;
        }

        if (Object.prototype.hasOwnProperty.call(item, key)) {
          const value = item[key];
          if (
            typeof value === "string" &&
            value.toLowerCase().includes(filterLower)
          ) {
            return true; // If the filter_string is found in any property, return true to include the item in the filtered list
          }
          if (typeof value === "object") {
            for (const TObj in value) {
              if (Array.isArray(value[TObj])) {
                return value[TObj]?.some((xArrTem) =>
                  xArrTem?.toLowerCase()?.includes(filterLower)
                );
              }
            }
          }
        }
      }
      return false; // If no property contains the filter_string, exclude the item from the filtered list
    });

    set_items_for_search(filteredItems);
  }, [filter_string, all_items, set_items_for_search]);

  const handleClearFilter = () => {
    set_filter_string("");
    // Clear the input field value
    const inputField = document.querySelector(".search_filter");
    if (inputField) {
      inputField.value = "";
    }
  };

  return (
    <div
      className="resource-group-Right-Action_btns "
      style={{ position: "relative" }}
    >
      <input
        className="input-type1 search_filter "
        placeholder="Search"
        onChange={(e) => set_filter_string(e.target.value)}
      />
      <div
        className="search_filter-btns"
        style={{
          position: "absolute",
          right: "2px",
          display: "flex",
          alignItems: "center",
          height: "auto",
        }}
      >
        {document?.querySelector(".search_filter")?.value === "" ? (
          <IconSearch className="icon-type1 icon-type1-smaller" />
        ) : (
          <button
            className="btn-type1 btn-type1-smaller"
            onClick={handleClearFilter}
          >
            <IconTrash className="icon-type1 icon-type1-smaller" />
          </button>
        )}
      </div>
    </div>
  );
};

const Search_comp_for_logs = ({
  log_data_full,
  set_log_data,
  set_preview_data,
  preview_data,
  ChosenTagLog,
  refresh,
  refLog,
}) => {
  const [filter_string, set_filter_string] = useState("");
  const [log_data_FilterTag, set_log_data_FilterTag] = useState("");
  const [RefreshHappened, setRefreshHappened] = useState(false);

  useEffect(() => {
    // console.log(log_data_FilterTag, "log_data_FilterTag log_data_FilterTag");

    if (!filter_string) {
      if (log_data_FilterTag.length == 0) {
        set_preview_data("No Results For this Filter..");
      } else {
        set_preview_data(log_data_FilterTag);
      }
    } else {
      const filterLogLinesString = filterLogLines(
        log_data_FilterTag,
        filter_string
      );
      if (filterLogLinesString) {
        set_preview_data(filterLogLinesString);
      } else {
        set_preview_data("No Results For this Filter..");
      }
    }
    if (refresh) {
      setRefreshHappened(!RefreshHappened);
      // refLog.current.scrollTop = 1111111111111111111111;
    }
  }, [filter_string, log_data_FilterTag]);

  useEffect(() => {
    if (ChosenTagLog === "All") {
      set_log_data_FilterTag(log_data_full);
    } else {
      const filterLogLinesString = filterLogLines(
        log_data_full,
        `- ${ChosenTagLog.toUpperCase()} -`
      );
      if (filterLogLinesString == log_data_FilterTag) {
        console.log("trueeeeeeeeeeeeeeeeeeee", true);
        if (log_data_FilterTag.length == 0) {
          set_preview_data("No Results For this Filter..");
        } else {
          set_preview_data(filterLogLinesString);
        }
      }
      set_log_data_FilterTag(filterLogLinesString);
    }
  }, [ChosenTagLog, log_data_full]);

  useEffect(() => {
    if (refresh) {
      refLog.current.scrollTop = 11111111111111111111111111111111111;
    }
  }, [RefreshHappened]);

  function filterLogLines(log_data, filter_string) {
    // Split the log text into lines
    // const lines = log_data.split("\n");

    const lines = log_data
      .split(/(?=\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z - [A-Z]+)/)
      .filter((line) => line.trim() !== "")
      .map((line) => line.trim());
    // Filter lines that contain the substring (case-insensitive)
    const filteredLines = lines.filter((line) =>
      line.toLowerCase().includes(filter_string.toLowerCase())
    );

    return filteredLines.join("\n").trim();
  }

  // const filteredLog = filterLogLines(log_data_full, "Number");
  // console.log("filteredLog", filteredLog);

  const handleClearFilter = () => {
    set_filter_string("");
    // Clear the input field value
    // const inputField = document.querySelector('.search_filter');
    // if (inputField) {
    //   console.log(" inputField " , inputField );

    //   console.log(" inputField.value " , inputField.value );

    //   inputField.value = '';
    // }
  };

  return (
    <div
      className="resource-group-Right-Action_btns "
      style={{ position: "relative" }}
    >
      <input
        className="input-type1 search_filter "
        placeholder="Search"
        onChange={(e) => set_filter_string(e.target.value)}
        value={filter_string}
      />
      <div
        className="search_filter-btns"
        style={{
          position: "absolute",
          right: "2px",
          display: "flex",
          alignItems: "center",
          height: "auto",
        }}
      >
        {!filter_string ? (
          <IconSearch className="icon-type1 icon-type1-smaller" />
        ) : (
          <button
            className="btn-type1 btn-type1-smaller"
            onClick={() => handleClearFilter()}
          >
            <IconTrash className="icon-type1 icon-type1-smaller" />
          </button>
        )}
      </div>
    </div>
  );
};

export { Search_comp, Search_comp_for_logs };
