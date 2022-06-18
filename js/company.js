window.onload = async function startPage() {
  try {
    const marquee = new Marquee(marqueeContainer);
    await marquee.createMarquee();
    urlQueryString = new URLSearchParams(window.location.search);
    companySymbol = urlQueryString.get("symbol");
    receiveCompanyData(companySymbol);
  } catch (error) {
    popToastError(
      "Error has Occurred in Data retrieval please reload and try different inquiry"
    );
    console.log(`Error in page rendering please check:${error}`);
  }
};

const receiveCompanyData = async (company) => {
  toggleLoader();
  displayPrepToggle();
  const url = `${Url.profileData}/${company}`;
  let response = await fetch(url);
  try {
    response = await response.json();
    displayProfile(response.profile);
  } catch (error) {
    console.log(`Error in data reception from server please check:${error}`);
  }
};

const displayProfile = (data) => {
  insertProfileHeader(data.image, data.companyName, data.industry);
  insertStockPrices(data.price, data.changesPercentage);
  insertDescription(data.description);
  insertUrl(data.website);
  getStockHistory();
  appendChart();
};

const insertProfileHeader = (imageUrl, name, industry) => {
  let profileHeader = document.createElement("div");
  profileHeader.classList.add("profileHeader");
  let companyImage = document.createElement("img");
  companyImage.setAttribute("src", `${imageUrl}`);
  companyImage.setAttribute("alt", `logo`);
  companyImage.classList.add("imageContainer");
  profileHeader.appendChild(companyImage);
  let companyName = document.createElement("h3");
  companyName.style.marginLeft = "3vh";
  companyName.innerText = `${name}`;
  let companyIndustry = document.createElement("h3");
  companyIndustry.style.marginLeft = "3vh";
  companyIndustry.innerText = `(${industry})`;
  ItemContainerAppend(
    companyImage,
    companyName,
    companyIndustry,
    profileHeader
  );
  listDisplay.appendChild(profileHeader);
};

const insertStockPrices = (price, stockChange) => {
  let stockInformation = document.createElement("div");
  stockInformation.classList.add("profileHeader");
  let stockPrice = document.createElement("h3");
  stockPrice.innerText = `Stock price:${price} usd`;
  let stockIndicator = document.createElement("h3");
  stockIndicator.style.marginLeft = "3vh";
  setPriceIndicator(stockIndicator, stockChange);
  ItemContainerAppend(stockPrice, stockIndicator, stockInformation);
  listDisplay.appendChild(stockInformation);
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
  companyUrlLink.style.textDecoration = "underline";
  companyUrlLink.setAttribute("href", `${url}`);
  companyUrlLink.setAttribute("target", "_blank");
  companyUrlLink.innerText = `${url}`;
  listDisplay.appendChild(companyUrlLink);
};

const getStockHistory = async () => {
  const url = `${Url.stockHistory}/${companySymbol}?serietype=line`;
  let dateLogs = [];
  let closingPriceLogs = [];
  try {
    let response = await fetch(url);
    response = await response.json();
    let data = response.historical;

    for (key in data) {
      if (key === "18") {
        break;
      }
      dateLogs.push(data[key].date);
      closingPriceLogs.push(data[key].close);
    }
    initiateChart(dateLogs, closingPriceLogs);
  } catch (error) {
    popToastError(error);
    console.log(error);
  }
};

const initiateChart = (dates, dailyPriceLogs) => {
  const ctx = document.getElementById("myChart");
  const Data = {
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
  const Config = {
    type: "line",
    data: Data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };
  const myChart = new Chart(ctx, Config);
};
