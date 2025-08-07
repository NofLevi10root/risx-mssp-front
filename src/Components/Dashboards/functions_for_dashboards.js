// const make_url_from_id = (id, moduleLinks,front_IP) => {

const cases = (visblePage) => {
  switch (visblePage) {
    case "dashboard-cti":
      console.log("dashboard-cti");
      return "2001003";
      break;

    case "dashboard-risx":
      console.log("dashboard-risx");
      return "2001000";
      break;

    case "dashboard-misp":
      console.log("dashboard-misp");
      return "2001012";
      break;

    case "dashboard-iris":
      console.log("dashboard-iris");
      return "2001010";
      break;

    case "dashboard-timesketch":
      console.log("dashboard-timesketch");
      return "2001002";
      break;

    case "dashboard-anyrun":
      console.log("dashboard-anyrun");
      return "2001006";
      break;

    default:
      console.log("dashboard-default-didnt find the visable page");
      return "2001000";
      break;
  }
};

const fix_path = (path, front_IP, front_URL) => {
  if (path === undefined || path === null || path === "") {
    console.log("fix_path problem - path is -", path);
    return;
  }

  if (path.includes("${FRONT_IP}")) {
    const module_link_change_front_ip = path.replace("${FRONT_IP}", front_IP);
    console.log(
      "fix_path  -> change_front_ip to: ",
      module_link_change_front_ip
    );
    return module_link_change_front_ip;
  } else if (path.includes("${FRONT_URL}")) {
    const module_link_change_front_URL = path.replace(
      "${FRONT_URL}",
      front_URL
    );
    console.log(
      "fix_path -> change_front_URL to: ",
      module_link_change_front_URL
    );
    return module_link_change_front_URL;
  } else {
    console.log("fix_path use orginal path", path);
    return path;
  }
};

const Make_url_from_id = (id, moduleLinks, front_IP, front_URL) => {
  // const id = cases(visblePage);
  // console.log("make_url_from_id" , id);

  if (moduleLinks === undefined || moduleLinks.length === 0) {
    return;
  }
  const [module_data] = moduleLinks.filter((element) => element?.toolID === id);

  const module_link = module_data?.toolURL;
  // console.log("module_link" , module_link);

  if (module_link === undefined || module_link === null || module_link === "") {
    console.log("module_link problem - is -", module_link);
    return;
  }

  if (module_link.includes("${FRONT_IP}")) {
    const module_link_change_front_ip = module_link.replace(
      "${FRONT_IP}",
      front_IP
    );
    console.log("module_link_change_front_ip", module_link_change_front_ip);
    return module_link_change_front_ip;
  } else if (module_link.includes("${FRONT_URL}")) {
    const module_link_change_front_URL = module_link.replace(
      "${FRONT_URL}",
      front_URL
    );
    console.log("module_link_change_front_URL", module_link_change_front_URL);
    return module_link_change_front_URL;
  } else {
    console.log("orginal_module_link", module_link);
    return module_link;
  }
};

export { Make_url_from_id, fix_path };
