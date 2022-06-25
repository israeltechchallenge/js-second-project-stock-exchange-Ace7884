// Auxiliary functions

const getNasdaqStats = async (userQuery) => {
  // CONFIG.companySymbolList=[];
  if (userQuery === "") {
    throw "Invalid Stock Query Try Again";
  }
  const url = `${CONFIG.searchRequestUrl}/search?query=${userQuery}&limit=10&exchange=NASDAQ`;
  try {
    let response = await fetch(url);
    response = await response.json();
    // response.forEach(element => {
    //   CONFIG.companySymbolList.push(element.symbol);
    // });
    return response;
  } catch (error) {
    console.log(`No Object Received from server ${error}`);
    popToastError(error);
  }
};

toggleList = () => {
  let mainContainer = document.getElementsByClassName("main_Container")[0];
  // this.element= document.createElement("div");
  // listDisplay.classList.add("listItem");
  if (!CONFIG.displayPageState) {
    mainContainer.appendChild(CONFIG.results);
    return (CONFIG.displayPageState = true);
  }
  if (CONFIG.displayPageState && !CONFIG.isError) {
    CONFIG.results.innerHTML = "";
    return (CONFIG.displayPageState = true);
  }
  mainContainer = document.getElementsByClassName("main_Container")[0];
  mainContainer.removeChild(CONFIG.results);
  CONFIG.loadingState = true;
  return (CONFIG.displayPageState = false);
};

const toggleLoader = () => {
  if (!CONFIG.loadingState) {
    let loaderContainer = document.createElement("div");
    let loaderSpinnerContainer = document.createElement("div");
    let loaderIcon = document.createElement("div");
    CONFIG.results.classList.add("#results");
    loaderContainer.classList.add("loader-container");
    CONFIG.results.style.visibility = "hidden";
    CONFIG.results.style.position = "absolute";
    loaderContainer.style.position = "relative";
    loaderContainer.style.visibility = "visible";
    loaderSpinnerContainer.classList.add("loading-bar-spinner");
    loaderIcon.classList.add("spinner-icon");
    loaderSpinnerContainer.appendChild(loaderIcon);
    loaderContainer.appendChild(loaderSpinnerContainer);
    CONFIG.mainContainer.appendChild(loaderContainer);
    return (CONFIG.loadingState = true);
  }

  let loaderContainer = document.getElementsByClassName("loader-container")[0];
  let loaderSpinnerContainer = document.getElementsByClassName(
    "loading-bar-spinner"
  )[0];
  let loaderIcon = document.getElementsByClassName("spinner-icon")[0];
  loaderContainer.style.visibility = "hidden";
  loaderContainer.style.position = "absolute";
  CONFIG.results.style.position = "relative";
  CONFIG.results.style.visibility = "visible";
  CONFIG.mainContainer.removeChild(loaderContainer);
  loaderContainer.removeChild(loaderSpinnerContainer);
  loaderSpinnerContainer.removeChild(loaderIcon);
  return (CONFIG.loadingState = false);
};

const setPriceIndicator = (element, percentageChange) => {
  if (percentageChange.charAt(0) === "-") {
    percentageChange = percentageChange.slice(0, 6);
  } else {
    percentageChange = percentageChange.slice(0, 5);
  }
  percentageChange = parseFloat(percentageChange);

  if (percentageChange > 0) {
    percentageChange = percentageChange.toString();
    element.innerText = `(+${percentageChange}%)`;
    return (element.style.color = "rgb(10, 230, 57)");
  }
  element.innerText = `(${percentageChange}%)`;
  return (element.style.color = "red");
};

const ItemContainerAppend = (...arg) => {
  let listArr = [...arg];
  let parentElement = listArr.pop();
  listArr.forEach((item) => {
    parentElement.appendChild(item);
  });
};

const popToastError = (text) => {
  let errorToast = document.createElement("div");
  CONFIG.mainContainer.appendChild(errorToast);
  errorToast.classList.add("errorToast");
  errorToast.classList.add("show");
  errorToast.innerText = text;
  setTimeout(() => {
    errorToast.className = errorToast.className.replace("show", "");
  }, 5000);
};

//Milestone3.1 in progress work below
//check in console for promise.all item limit number
const checkCompanyDataApiLimit = async (a) => {
  let companySymbolList = [];
  let count = 0;
  let data = await mockGetNasdaqStats(a);
  for (let key in data) {
    // Scale up or down requests to api
    // 30 is minimal limit
    if (key === "30") {
      break;
    }
    count++;
    companySymbolList.push(data[key].symbol);
  }
  console.log(companySymbolList);
  let dataProf = await mockReceiveCompanyData(companySymbolList);
  console.log(dataProf);
  return;
};

//mock geNasdaqFunc for api limit test
const mockGetNasdaqStats = async (userQuery) => {
  if (userQuery === "") {
    throw "Invalid Stock Query Try Again";
  }
  //change url delete limit to recieve full list;
  const url = `${CONFIG.searchRequestUrl}/search?query=${userQuery}&exchange=NASDAQ`;
  try {
    let response = await fetch(url);
    response = await response.json();
    console.log(response);
    return response;
  } catch (error) {
    console.log(`No Object Received from server ${error}`);
  }
};

// mock  receiveCompanyData profile endpoint to be checked
const mockReceiveCompanyData = async (company) => {
  const url = `${CONFIG.profileDataUrl}/${company}`;
  console.log(url);
  let response = await fetch(url);
  try {
    response = await response.json();
    console.log("recieved2");
    return response;
  } catch (error) {
    console.log(`Error in data reception from server please check:${error}`);
  }
};
