//Auxiliary functions
const enableEnterKey = (event) => {
  if (event.key === "Enter") {
    inquiryRequest();
  }
};

function inquiryRequest() {
  if (userInquiry.value.length > 0) {
    listDisplay.innerHTML = "";
    toggleList();
    toggleLoader();
    return getNasdaqStats(userInquiry.value);
  }
  if (userInquiry.value.length > 0 && list === true) {
    toggleLoader();
    return getNasdaqStats(userInquiry.value);
  }
  toggleList();
  listDisplay.innerHTML = "";
}

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

const createList = (data) => {
  for (element in data) {
    let queryResult = data[element];
    let listItem = document.createElement("a");
    listItem.classList.add("listItem");
    listItem.setAttribute(
      "href",
      `./company.html?symbol=${queryResult.symbol}`
    );
    listItem.innerText += `${queryResult.name}    (${queryResult.symbol})`;
    listDisplay.appendChild(listItem);
  }
  toggleLoader();
};

const insertProfileHeader = (imageUrl, name) => {
  let profileHeader = document.createElement("div");
  profileHeader.classList.add("profileHeader");
  let companyImage = document.createElement("img");
  companyImage.setAttribute("src", `${imageUrl}`);
  companyImage.setAttribute("alt", `${name} logo`);
  companyImage.classList.add("imageContainer");
  profileHeader.appendChild(companyImage);
  let companyName = document.createElement("h3");
  companyName.style.marginLeft = "3vh";
  companyName.innerText = `${name}`;
  profileHeader.appendChild(companyName);
  listDisplay.appendChild(profileHeader);
};

const insertStockPrices = (price, stockChange) => {
  let stockInformation = document.createElement("div");
  stockInformation.classList.add("profileHeader");
  let stockPrice = document.createElement("h3");
  stockPrice.innerText = `Stock price:${price} usd`;
  let stockIndicator = document.createElement("h3");
  stockIndicator.style.marginLeft = "3vh";
  stockIndicator.innerText = `(${stockChange}%)`;
  setPriceIndicator(stockIndicator, stockChange);
  stockInformation.appendChild(stockPrice);
  stockInformation.appendChild(stockIndicator);
  listDisplay.appendChild(stockInformation);
};

const setPriceIndicator = (element, percentageChange) => {
  if (percentageChange > 0) {
    return (element.style.color = "rgb(10, 230, 57)");
  }
  return (element.style.color = "red");
};

const insertDescription = (description) => {
  let companyDescription = document.createElement("div");
  companyDescription.classList.add("description");
  companyDescription.innerText = `${description}`;
  listDisplay.appendChild(companyDescription);
};

const insertUrl = (url) => {
  let companyUrlLink = document.createElement("a");
  companyUrlLink.classList.add("listItem");
  companyUrlLink.style.fontSize = "14px";
  companyUrlLink.setAttribute("href", `${url}`);
  companyUrlLink.setAttribute("target", "_blank");
  companyUrlLink.innerText = `${url}`;
  listDisplay.appendChild(companyUrlLink);
};

function appendChart() {
  let chartContainer = document.createElement("div");
  let chart = document.createElement("canvas");
  chart.setAttribute("id", "myChart");
  chart.style.position = "relative";
  chartContainer.appendChild(chart);
  listDisplay.appendChild(chartContainer);
  toggleLoader();
}

function initiateChart(dates, dailyPriceLogs) {
  const ctx = document.getElementById("myChart");
  const data = {
    labels: dates,
    datasets: [
      {
        label: "Stock Price History",
        color: "rgb(255, 238, 0)",
        backgroundColor: "rgb(150, 207, 230, 0.5)",
        borderColor: "rgb(150, 207, 230, 0.5)",
        fill: "origin",
        data: dailyPriceLogs,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };
  const myChart = new Chart(ctx, config);
}
