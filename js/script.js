//Event listeners
button.addEventListener("click", inquiryRequest);
document.addEventListener("keypress", enableEnterKey);
userInquiry.addEventListener("click", () => {
  resetInput();
});
userInquiry.addEventListener("keyup", autoSearch);
userInquiry.addEventListener("keypress", autoSearchClear);

//Functions
window.onload = function reset() {
  const marquee = new Marquee(marqueeContainer);
  marquee.createMarquee();
  listDisplay.innerHTML = "";
  autoSearchDisplay.innerText = "";
  autoSearchDisplay.classList.remove("autoSearchQuery");
};

function inquiryRequest() {
  if (userInquiry.value.length > 0) {
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

const getNasdaqStats = async (userQuery) => {
  const url = `${Url.searchRequest}/search?query=${userQuery}&limit=10&exchange=NASDAQ`;
  listDisplay.classList.remove("error");
  listDisplay.classList.add("listItem");
  try {
    let response = await fetch(url);
    response = await response.json();
    if (response.length === 0) {
      throw "No matches found";
    }
    createList(response);
    resetInput();
  } catch (error) {
    listDisplay.classList.add("error");
    listDisplay.innerText = error;
    toggleLoader();
  }
};

const createList = async (data) => {
  try {
    let listContainer = document.createElement("div");
    listContainer.classList.add("listContainer");
    listContainer.style.display = "none";
    listDisplay.appendChild(listContainer);
    for (element in data) {
      let itemContainer = document.createElement("span");
      let queryResult = data[element];
      let companyInfo = await receiveFurtherData(queryResult.symbol);
      if (companyInfo === undefined) {
        continue;
      }
      itemContainer.classList.add("itemContainer");
      let listImage = document.createElement("img");
      listImage.setAttribute("src", `${companyInfo.image}`);
      listImage.setAttribute("alt", "Logo");
      listImage.classList.add("listImage");
      let listItem = document.createElement("a");
      listItem.classList.add("listItem");
      listItem.setAttribute(
        "href",
        `./company.html?symbol=${queryResult.symbol}`
      );
      listItem.innerText += `${queryResult.name}    (${queryResult.symbol})`;
      let stockIndicator = document.createElement("p");
      stockIndicator.style.marginLeft = "3vh";
      stockIndicator.innerText = `(${companyInfo.changesPercentage}%)`;
      setPriceIndicator(stockIndicator, companyInfo.changesPercentage);
      ItemContainerAppend(listImage, listItem, stockIndicator, itemContainer);
      listContainer.appendChild(itemContainer);
    }
    listContainer.style.display = "flex";
    toggleLoader();
  } catch (error) {
    popToastError(
      "Error has Occurred in Data retrieval please reload and try different inquiry"
    );
    console.log(`Error in data packet from server please check:${error}`);
  }
};

async function receiveFurtherData(CompanyKey) {
  const url = `${Url.profileData}/${CompanyKey}`;
  let response = await fetch(url);
  try {
    response = await response.json();
    return response.profile;
  } catch (error) {
    console.log(`Error in data packet from server please check:${error}`);
  }
}

function autoSearch(e) {
  clearTimeout(timer);
  autoSearchDisplay.classList.add("autoSearchQuery");
  autoSearchDisplay.innerText = `${e.target.value} - Auto Search`;
  timer = setTimeout(() => {
    inquiryRequest();
  }, 800);
}
