window.onload = function companySymbolExtraction() {
  try {
    recieveCompanyData(companySymbol);
  } catch (error) {
    console.log(error);
  }

  toggleLoader();
  displayPrepToggle();
};

async function recieveCompanyData(company) {
  const url = `${Url.profileData}/${company}`;
  let response = await fetch(url);
  try {
    response = await response.json();
    displayProfile(response.profile);
  } catch (error) {
    console.log(error);
  }
}

async function getStockHistory() {
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
    console.log(error);
  }
}

const displayProfile = (data) => {
  insertProfileHeader(data.image, data.companyName);
  insertStockPrices(data.price, data.changesPercentage);
  insertDescription(data.description);
  insertUrl(data.website);
  getStockHistory();
  appendChart();
};
