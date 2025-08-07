import "./Settings_Menu.css";

function Settings_Menu({
  Preview_This_in_menu,
  Preview_This_comp,
  handle_Click_Btn,
  set_show_nested,
  show_nested,
}) {
  console.log("Preview_This_comp", Preview_This_comp);

  const sub_menu_options = [
    {
      preview_name: "Main Config",
      value: "Main Config",
      is_nasted: false,
    },
    {
      preview_name: "UI Settings",
      value: "UI Settings",
      is_nasted: false,
    },
    {
      preview_name: "Paths",
      value: "Paths",
      is_nasted: false,
      father_comp: "",
    },
    {
      preview_name: "Automation",
      value: "Automation",
      is_nasted: false,
    },
    {
      preview_name: "Portainer",
      value: "Portainer",
      is_nasted: false,
    },
    // {
    //   preview_name: "Backend Log",
    //   value: "Backend Log",
    //   is_nasted: false,
    // },
    // {
    //   preview_name: "Python Main Log",
    //   value: "Python Main Log",
    //   is_nasted: false,
    // },
    // {
    //   preview_name: "Python Interval Log",
    //   value: "Python Interval Log",
    //   is_nasted: false,
    // },
    {
      preview_name: "Users",
      value: "Users",
      is_nasted: false,
    },
    {
      preview_name: "Offline Agent",
      value: "Velociraptor",
      is_nasted: false,
    },    {
      preview_name: "MCP",
      value: "MCP",
      is_nasted: false,
    },
    {
      preview_name: "Alerts",
      value: "Alerts",
      is_nasted: false,
    },{
      preview_name: "AI Vulnerability",
      value: "AI Vulnerability",
      is_nasted: false,
    },
    // {
    //   preview_name: "Prompt",
    //   value: "Prompt",
    //   is_nasted: false,
    // },
    // {
    //   preview_name: "AI Rules",
    //   value: "AI Rules",
    //   is_nasted: true,
    //   sub_sub: [
    //     {
    //       preview_name: "Sigma",
    //       value: "Sigma AI",
    //       is_nasted: false,
    //       father_comp: "AI Rules",
    //     },
    //     {
    //       preview_name: "Yara",
    //       value: "Yara AI",
    //       is_nasted: false,
    //       father_comp: "AI Rules",
    //     },
    //     {
    //       preview_name: "Nuclie",
    //       value: "Nuclie AI",
    //       is_nasted: false,
    //       father_comp: "AI Rules",
    //     },
    //   ],
    // },
    {
      preview_name: "Logs",
      value: "Logs",
      is_nasted: true,
      sub_sub: [
        {
          preview_name: "Backend Requests",
          value: "Backend Log Request",
          is_nasted: false,
          father_comp: "Logs",
        },
        {
          preview_name: "Backend",
          value: "Backend Log",
          is_nasted: false,
          father_comp: "Logs",
        },
        {
          preview_name: "Python Main",
          value: "Python Main Log",
          is_nasted: false,
          father_comp: "Logs",
        },
        {
          preview_name: "Automation",
          value: "Python Interval Log",
          is_nasted: false,
          father_comp: "Logs",
        },
        {
          preview_name: "Collector",
          value: "Collector Log",
          is_nasted: false,
          father_comp: "Logs",
        },
        {
          preview_name: "Collector Import",
          value: "Collector Import Log",
          is_nasted: false,
          father_comp: "Logs",
        },
        {
          preview_name: "Alerts",
          value: "Alerts Interval Log",
          is_nasted: false,
          father_comp: "Logs",
        },
        {
          preview_name: "Crash",
          value: "Crash Log",
          is_nasted: false,
          father_comp: "Logs",
        },
        {
          preview_name: "Daily Update Interval",
          value: "Daily Update Interval Log",
          is_nasted: false,
          father_comp: "Logs",
        },
        {
          preview_name: "Dashboard",
          value: "Dashboard Log",
          is_nasted: false,
          father_comp: "Logs",
        },
        {
          preview_name: "Resource Usage",
          value: "Resource Usage Log",
          is_nasted: false,
          father_comp: "Logs",
        },
        {
          preview_name: "Ai Management",
          value: "AiManagement Log",
          is_nasted: false,
          father_comp: "Logs",
        },
      ],
    },
  ];

  // {Preview_This_comp == "Resource Usage Log" && (
  //     <Settings_section_logs
  //       usethis={"log_resource_usage"}
  //       fileName={"resource_usage.log"}
  //       headline={"Resource Usage"}
  //       subline={""}
  //     />
  //   )}

  return (
    <div className="SubMenu-all">
      <div className="SubMenu-in">
        {sub_menu_options.map((item, index) => {
          const fater_value = item?.value;

          return (
            <div className="SubMenu-unit" key={index}>
              <button
                disabled={
                  Preview_This_in_menu === item?.value && !item?.is_nasted
                }
                className={`SubMenu-btn ${
                  Preview_This_in_menu === item?.value &&
                  !item?.is_nasted &&
                  "SubMenu-btn-active"
                }    ${
                  Preview_This_in_menu === item?.value &&
                  item?.is_nasted &&
                  "SubMenu-btn-active-and-clickable"
                }                     `}
                // onClick={() => {
                //   set_Preview_This_comp(item?.value);
                // }}
                onClick={() => {
                  handle_Click_Btn(
                    item?.value,
                    item?.is_nasted,
                    show_nested,
                    fater_value
                  );
                }}
              >
                <p className="font-type-menu">{item?.preview_name}</p>
                <div className="SubMenu-gap" />
              </button>

              {item?.is_nasted && show_nested.includes(item?.value) && (
                <div
                  className="SubMenu-submenu"
                  onMouseLeave={() => set_show_nested([])}
                >
                  {item.sub_sub.map((item, index) => (
                    <div
                      className="SubMenu-submenu-item"
                      onClick={() => {
                        handle_Click_Btn(
                          item?.value,
                          item?.is_nasted,
                          show_nested,
                          fater_value
                        );
                      }}
                    >
                      {" "}
                      <p className="font-type-menu">{item?.preview_name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Settings_Menu;
