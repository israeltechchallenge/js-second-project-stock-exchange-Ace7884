window.onload = async function startPage() {
  try {
    const marquee = new Marquee(CONFIG.marqueeContainer);
    await marquee.load();
    CONFIG.urlQueryString = new URLSearchParams(window.location.search);
    CONFIG.companySymbol = CONFIG.urlQueryString.get("symbol");
    displayProfile(CONFIG.companySymbol);
  } catch (error) {
    popToastError(
      "Error has Occurred in Data retrieval please reload and try different inquiry"
    );
    console.log(`Error in page rendering please check:${error}`);
  }
};

const displayProfile = async (data) => {
  let profileData = await receiveCompanyData(data);
  toggleLoader();
  toggleList();
  insertProfileHeader(
    profileData.image,
    profileData.companyName,
    profileData.industry
  );
  insertStockPrices(profileData.price, profileData.changesPercentage);
  insertDescription(profileData.description);
  insertUrl(profileData.website);
  await getStockHistory();
  appendChart();
  initiateChart();
  toggleLoader();
};

const receiveCompanyData = async (company) => {
  const url = `${CONFIG.profileDataUrl}/${company}`;
  let response = await fetch(url);
  try {
    response = await response.json();
    return response.profile;
  } catch (error) {
    console.log(`Error in data reception from server please check:${error}`);
  }
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
  let companyIndustry = document.createElement("h4");
  companyIndustry.style.marginLeft = "3vh";
  companyIndustry.innerText = `(${industry})`;
  ItemContainerAppend(
    companyImage,
    companyName,
    companyIndustry,
    profileHeader
  );
  CONFIG.results.appendChild(profileHeader);
};

const insertStockPrices = (price, stockChange) => {
  let stockInformation = document.createElement("div");
  stockInformation.classList.add("profileHeader");
  let stockPrice = document.createElement("p");
  stockPrice.innerText = `Stock price:${price} usd`;
  let stockIndicator = document.createElement("p");
  stockIndicator.style.marginLeft = "3vh";
  setPriceIndicator(stockIndicator, stockChange);
  ItemContainerAppend(stockPrice, stockIndicator, stockInformation);
  CONFIG.results.appendChild(stockInformation);
};

const insertDescription = (description) => {
  let companyDescription = document.createElement("div");
  companyDescription.classList.add("description");
  companyDescription.innerText = `${description}`;
  CONFIG.results.appendChild(companyDescription);
};

const insertUrl = (url) => {
  let companyUrlLink = document.createElement("a");
  companyUrlLink.classList.add("listItem");
  companyUrlLink.style.fontSize = "14px";
  companyUrlLink.style.textDecoration = "underline";
  companyUrlLink.setAttribute("href", `${url}`);
  companyUrlLink.setAttribute("target", "_blank");
  companyUrlLink.innerText = `${url}`;
  CONFIG.results.appendChild(companyUrlLink);
};

const getStockHistory = async () => {
  const url = `${CONFIG.stockHistoryUrl}/${CONFIG.companySymbol}?serietype=line`;

  try {
    let response = await fetch(url);
    response = await response.json();
    let data = response.historical;
    for (let key in data) {
      if (key === "18") {
        break;
      }
      CONFIG.dateLogs.push(data[key].date);
      CONFIG.closingPriceLogs.push(data[key].close);
    }
    return;
  } catch (error) {
    console.log(error);
    popToastError(error);
  }
};

const appendChart = () => {
  let chartContainer = document.createElement("div");
  let chart = document.createElement("canvas");
  chartContainer.style.marginTop = "1vh";
  chartContainer.style.height = "50%";
  chart.setAttribute("id", "myChart");
  chartContainer.appendChild(chart);
  CONFIG.results.appendChild(chartContainer);
};

const initiateChart = () => {
  const ctx = document.getElementById("myChart");
  const Data = {
    labels: CONFIG.dateLogs,
    datasets: [
      {
        label: "Stock Price History",
        color: "rgb(255, 238, 0)",
        backgroundColor: "rgb(150, 207, 230, 0.5)",
        borderColor: "rgb(150, 207, 230, 0.5)",
        fill: "origin",
        data: CONFIG.closingPriceLogs,
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
