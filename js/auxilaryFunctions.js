//Auxiliary functions

function resetInput() {
  userInquiry.value = "";
}

function toggleList() {
  if (!list && userInquiry.value.length > 0) {
    listDisplay.innerHTML = "";
    displayPrepToggle();
    return (list = true);
  }
  if (list && userInquiry.value.length > 0) {
    return (list = true);
  }
  displayPrepToggle();
  return (list = false);
}

function toggleLoader() {
  if (!loading) {
    document.getElementsByClassName("loading-bar-spinner")[0].style.display =
      "block";
    return (loading = true);
  }
  document.getElementsByClassName("loading-bar-spinner")[0].style.display =
    "none";
  return (loading = false);
}

function displayPrepToggle() {
  if (!displayPage) {
    document
      .getElementsByClassName("main_Container")[0]
      .appendChild(listDisplay);
    listDisplay.classList.add("listDisplay");
    return (displayPage = true);
  }
  listDisplay.classList.remove("listDisplay");
  document.getElementsByClassName("main_Container")[0].removeChild(listDisplay);
  return (displayPage = false);
}

function appendChart() {
  let chartContainer = document.createElement("div");
  let chart = document.createElement("canvas");
  chart.setAttribute("id", "myChart");
  chart.style.position = "relative";
  chartContainer.appendChild(chart);
  listDisplay.appendChild(chartContainer);
  toggleLoader();
}

const enableEnterKey = (event) => {
  if (event.key === "Enter") {
    inquiryRequest();
  }
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

const appendstockInformation = (stockPrice, stockIndicator, parentElement) => {
  let informationArr = [stockPrice, stockIndicator];
  informationArr.forEach((item) => parentElement.appendChild(item));
};

const listContainerAppend = (image, listItem, stockValue, parentElement) => {
  let listArr = [image, listItem, stockValue];
  listArr.forEach((item) => parentElement.appendChild(item));
};
