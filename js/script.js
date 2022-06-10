//Event listeners
button.addEventListener("click", inquiryRequest);
document.addEventListener("keypress", enableEnterKey);
userInquiry.addEventListener("click", function () {
  resetInput();
});

//Functions
window.onload = createMarquee();

function inquiryRequest() {
  if (userInquiry.value.length > 0) {
    listDisplay.innerHTML = "";
    toggleList();
    // toggleLoader();
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
      let companyInfo = await recieveFurtherData(queryResult.symbol);
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
    console.log(error);
  }
};

async function recieveFurtherData(CompanyKey) {
  const url = `${Url.profileData}/${CompanyKey}`;
  let response = await fetch(url);
  try {
    response = await response.json();
    return response.profile;
  } catch (error) {
    console.log(error);
  }
}
