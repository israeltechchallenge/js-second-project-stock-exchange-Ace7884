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
  informationArr.forEach((item) => {
    parentElement.appendChild(item);
  });
};

const listContainerAppend = (image, listItem, stockValue, parentElement) => {
  let listArr = [image, listItem, stockValue];
  listArr.forEach((item) => {
    parentElement.appendChild(item);
  });
};

async function createMarquee() {
  try {
    marqueeContainer.innerHTML = "";
    marqueeContainer.classList.add("stockMarquee_Container");
    let marqueeText = document.createElement("span");
    marqueeText.classList.add("marqueeDisplay");
    let marqueeData = await getMarqueeStockData();
    for (key in marqueeData) {
      if (isError === true && key === "100") {
        break;
      } else {
        appendMarquee(marqueeData, marqueeText);
      }
    }
    marqueeContainer.appendChild(marqueeText);
    document
      .getElementsByClassName("main_Container")[0]
      .appendChild(marqueeContainer);
  } catch (error) {
    isError = true;
    createMarquee();
    return console.log(error);
  }
}

async function getMarqueeStockData() {
  const url = Url.stockPriceMarque;
  let response = await fetch(url);
  try {
    response = await response.json();
    return response;
  } catch (error) {
    console.log(error);
  }
}

function appendMarquee(data, element) {
  let marqueeStockSymbol = document.createElement("p");
  let marqueeStockPrice = document.createElement("p");
  marqueeStockSymbol.innerText = `${data[key].symbol}`;
  marqueeStockSymbol.style.color = "rgb(255, 247, 0)";
  marqueeStockSymbol.style.paddingLeft = "1vw";
  marqueeStockPrice.innerText = `$${data[key].price}`;
  marqueeStockPrice.style.color = "rgb(43, 255, 0)";
  appendstockInformation(marqueeStockSymbol, marqueeStockPrice, element);
}
