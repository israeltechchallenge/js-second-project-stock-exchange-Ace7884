//Auxiliary functions
// const enableEnterKey = (event) => {
//   debugger;
//   console.log("click");
//   if (event.key === "Enter") {
//     displayResults();
//   }
// };

const toggleList = () => {
  CONFIG.listDisplay.classList.add("listItem");
  if (!CONFIG.displayPageState) {
    CONFIG.listDisplay.classList.add("listDisplay");
    CONFIG.mainContainer.appendChild(CONFIG.listDisplay);
    return (CONFIG.displayPageState = true);
  }
  if (CONFIG.displayPageState && !isError) {
    CONFIG.listDisplay.innerHTML = "";
    return (CONFIG.displayPageState = true);
  }
  CONFIG.mainContainer = document.getElementsByClassName("main_Container")[0];
  CONFIG.mainContainer.removeChild(CONFIG.listDisplay);
  CONFIG.listDisplay.classList.remove("listDisplay");
  CONFIG.loadingState = true;
  return (CONFIG.displayPageState = false);
};

const toggleLoader = () => {
  if (!CONFIG.loadingState) {
    let loaderContainer = document.createElement("div");
    let loaderSpinnerContainer = document.createElement("div");
    let loaderIcon = document.createElement("div");
    loaderContainer.classList.add("loader-container");
    loaderContainer.style.visibility = "visible";
    loaderContainer.style.position = "relative";
    CONFIG.listDisplay.style.visibility = "hidden";
    CONFIG.listDisplay.style.position = "absolute";
    loaderSpinnerContainer.classList.add("loading-bar-spinner");
    loaderIcon.classList.add("spinner-icon");
    loaderSpinnerContainer.appendChild(loaderIcon);
    loaderContainer.appendChild(loaderSpinnerContainer);
    CONFIG.mainContainer.appendChild(loaderContainer);
    return (CONFIG.loadingState = true);
  }
  CONFIG.listDisplay.style.visibility = "visible";
  CONFIG.listDisplay.style.position = "relative";
  let loaderContainer = document.getElementsByClassName("loader-container")[0];
  let loaderSpinnerContainer = document.getElementsByClassName(
    "loading-bar-spinner"
  )[0];
  let loaderIcon = document.getElementsByClassName("spinner-icon")[0];
  loaderContainer.style.position = "absolute";
  loaderContainer.style.visibility = "hidden";
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

const popToastError = (text)=>{
  let errorToast = document.getElementsByClassName("errorToast")[0];
  errorToast.classList.add("show");
  errorToast.innerText = text;
  setTimeout(() => {
    errorToast.className = errorToast.className.replace("show", "");
  }, 5000);
};

const appendQueryStringToUrl = (targetString) => {
  const url = new URL(window.location);
  url.searchParams.set("query", `${targetString}`);
  history.pushState({}, "", url);
};
