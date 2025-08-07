import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
// export const GeneralContext = createContext();
const GeneralContext = createContext();
export function ContextProvider({ children }) {
  const [backEndURL, set_backEndURL] = useState("");
  const [mssp_config_json, set_mssp_config_json] = useState({});
  const [front_IP, set_front_IP] = useState("");
  const [front_URL, set_front_URL] = useState("");

  const [moduleLinks, set_moduleLinks] = useState();
  const [dashboardLinks, set_dashboardLinks] = useState();
  const [expiryDate, set_expiryDate] = useState("");
  const [Assets_Preview_List, set_Assets_Preview_List] = useState(false);
  const [examInnterval_minutes, set_examInnterval_minutes] = useState(2);

  const [DownloadProgressBar, setDownloadProgressBar] = useState({});
  const [DownloadList, setDownloadList] = useState([]);
  const [UploadProgressBar, setUploadProgressBar] = useState({});
  const [UpdateSideBar, setUpdateSideBar] = useState({});

  console.log("backEndURL", backEndURL);
  const fetchConfig = async () => {
    try {
      const response = await fetch("/mssp_config.json");
      const config = await response.json();

      if (config.backendUrl !== undefined) {
        // console.log("config", config);

        set_mssp_config_json(config);
        set_examInnterval_minutes(config.examInnterval_minutes);
        set_moduleLinks(config.moduleLinks);
        set_dashboardLinks(config.dashboardLinks);
        set_expiryDate(config.expiryDate);
        set_backEndURL(config.backendUrl);

        get_all_resource_types();
      } else {
        console.error("Configuration is null.");
      }
    } catch (error) {
      console.error("Error fetching mssp_config.json:", error);
    }
  };
  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (!backEndURL) return;
    const fetchFromENV = async () => {
      try {
        const res = await axios.get(`${backEndURL}/config/from_env`);
        if (res) {
          set_front_IP(res.data?.FRONT_IP);
          set_front_URL(res.data?.FRONT_URL);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchFromENV();
  }, [backEndURL]);

  const [all_Resource_Types, set_all_Resource_Types] = useState([]);
  const [all_Tools, set_all_Tools] = useState([]);
  const [all_artifacts, set_all_artifacts] = useState([]);
  const [AllTags, setAllTags] = useState([]);

  const [items, set_items] = useState([]);
  const user_id = "mssp-00003d31f6w";
  const addToCart = (name, price) => {
    set_items((prevState) => [...prevState, { name, price }]);
  };

  const get_all_tools = async () => {
    if (moduleLinks === undefined) {
      return;
    }

    if (backEndURL == null || backEndURL == undefined || backEndURL == "") {
      return;
    }
    try {
      const res = await axios.get(`${backEndURL}/tools`);
      if (res) {
        const all_tools_no_links = res.data;
        // console.log("all_tools_no_links",all_tools_no_links);

        all_tools_no_links.forEach((tool) => {
          for (let index = 0; index < moduleLinks.length; index++) {
            if (
              tool?.tool_id == "2001019" &&
              moduleLinks[index]?.toolID == "2000000"
            ) {
              tool.toolURL = moduleLinks[index]?.toolURL;
            }
            if (moduleLinks[index]?.toolID === tool?.tool_id) {
              tool.toolURL = moduleLinks[index]?.toolURL;
            }
          }
        });

        console.log("set all moduleLinks", moduleLinks);

        set_all_Tools(all_tools_no_links);
        return all_tools_no_links;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const get_all_artifacts = async () => {
    try {
      console.log("backEndURL:::", backEndURL);
      // set_loader(true)
      const res = await axios.get(
        `${backEndURL}/tools/all-velociraptor_artifacts`
      );
      if (res) {
        // console.log("get_all_artifacts res.data:" , res.data);

        res?.data?.forEach((x) => {
          switch (x?.toolURL) {
            case "Threat Hunting":
              x.toolURL = moduleLinks?.filter(
                (yy) => yy?.toolName == "Threat Hunting Dashboard"
              )[0]?.toolURL;
              break;
            case "All Around":
              x.toolURL = moduleLinks?.filter(
                (yy) => yy?.toolName == "Best Practice Dashboard"
              )[0]?.toolURL;

              break;
          }
        });

        set_all_artifacts(res.data);
        return res.data;
      }
    } catch (err) {
      // set_loader(false)
      console.log(err);
    }
  };

  const GetAllToolAndArtifactFunc = async () => {
    const arrA = await get_all_artifacts();
    const arrT = await get_all_tools();
    const tags = [];

    const filteredTags = [];
    arrT?.forEach((x) => {
      tags.push(...x?.arguments?.tags);
    });
    arrA?.forEach((x) => {
      tags.push(...x?.arguments?.tags);
    });
    tags?.forEach((x) => {
      if (!filteredTags.includes(x)) {
        filteredTags.push(x);
      }
    });
    setAllTags(filteredTags);
  };

  const get_all_resource_types = async () => {
    if (backEndURL === null || backEndURL === undefined || backEndURL == "") {
      return;
    }
    try {
      console.log("config_mssp.json -backEndURL-", backEndURL);
      const res = await axios.get(`${backEndURL}/Resources/count-same-type`);
      if (res) {
        const unSorted = res.data;

        console.log("unSorted", unSorted);

        const FilterOut = [
          "2007",
          "2001",
          "2009",
          "2002",
          "2008",
          "2006",
          "2005",
          "2004",
          "2003",
        ];
        const filtered_resource_type = unSorted.filter(
          (resource_type) =>
            !FilterOut.includes(resource_type?.resource_type_id)
        );

        const place1 = unSorted.find(
          (resource_type) => resource_type?.resource_type_id === "2007"
        ); // "Company Name"
        const place2 = unSorted.find(
          (resource_type) => resource_type?.resource_type_id === "2001"
        ); // "Domain"
        const place3 = unSorted.find(
          (resource_type) => resource_type?.resource_type_id === "2009"
        ); // "Email Domain"
        const place4 = unSorted.find(
          (resource_type) => resource_type?.resource_type_id === "2002"
        ); // "IP Address"
        const place5 = unSorted.find(
          (resource_type) => resource_type?.resource_type_id === "2008"
        ); // "Computer"
        const place6 = unSorted.find(
          (resource_type) => resource_type?.resource_type_id === "2006"
        ); // "Email Address"
        const place7 = unSorted.find(
          (resource_type) => resource_type?.resource_type_id === "2005"
        ); // "Full Name"
        const place8 = unSorted.find(
          (resource_type) => resource_type?.resource_type_id === "2004"
        ); // "Phone Number"
        const place9 = unSorted.find(
          (resource_type) => resource_type?.resource_type_id === "2003"
        ); // "Username (Social)"

        // Create manual_sort array, filtering out undefined or null values
        const manual_sort = [
          place1,
          place2,
          place3,
          place4,
          place5,
          place6,
          place7,
          place8,
          place9,
        ].filter((item) => item != null);

        set_all_Resource_Types([...manual_sort, ...filtered_resource_type]);

        // console.log("all_Resource_Types", all_Resource_Types);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    get_all_resource_types();
    get_all_tools();
  }, [backEndURL, moduleLinks]);

  return (
    <GeneralContext.Provider
      value={{
        AllTags,
        setAllTags,
        GetAllToolAndArtifactFunc,
        UpdateSideBar,
        setUpdateSideBar,
        DownloadList,
        setDownloadList,
        DownloadProgressBar,
        setDownloadProgressBar,
        UploadProgressBar,
        setUploadProgressBar,
        backEndURL,
        fetchConfig,
        all_Resource_Types,
        all_Tools,
        set_all_Tools,
        all_artifacts,
        set_all_artifacts,
        addToCart,
        items,
        set_items,

        user_id,
        get_all_resource_types,
        moduleLinks,
        dashboardLinks,
        examInnterval_minutes,
        expiryDate,
        front_IP,
        front_URL,
        mssp_config_json,
        set_mssp_config_json,

        Assets_Preview_List,
        set_Assets_Preview_List,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
}

export default GeneralContext;
