//global variables
let userInquiry = document.getElementsByClassName("userSearchField")[0];
let button = document.getElementsByClassName("searchButton")[0];
let listDisplay = document.createElement("div");

//status variables
let loading = false;
let list = false;

//Server Url addresses
const customServerUrl =
  "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com";
let searchRequestUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${userInquiry}&limit=10&exchange=NASDAQ`;

//Functions

//Extracts stockExchange Data
async function getNasdaqStats(userQuery) {
  try {
    //Send userInquiry and Recieve results
    let response = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${userQuery}&limit=10&exchange=NASDAQ`
    );
    response = await response.json();
    if (response.length === 0) {
      throw "No matches found";
    }
    createList(response);
    resetInput();
  } catch (error) {
    listDisplay.classList.add("listItem");
    listDisplay.innerText = error;
    toggleLoader();
  }
}

function createList(data) {
  for (element in data) {
    let queryResult = data[element];
    let listItem = document.createElement("a");
    listItem.classList.add("listItem");
    listItem.setAttribute("href", `/company.html?symbol=${queryResult.symbol}`);
    listItem.innerText += `${queryResult.name}    (${queryResult.symbol})`;
    listDisplay.appendChild(listItem);
  }
  toggleLoader();
}

//Event listeners
button.addEventListener("click", inquiryRequest);
document.addEventListener("keypress", enableEnterKey);
userInquiry.addEventListener("click", function () {
  resetInput();
});
