window.onload = async function reset() {
  //Functions
  CONFIG.listDisplay.innerHTML = "";
  autoSearchDisplay.innerText = "";
  const marquee = new Marquee(CONFIG.marqueeContainer);
  await marquee.load();
  CONFIG.urlQueryString = new URLSearchParams(window.location.search);
  CONFIG.urlQueryString = CONFIG.urlQueryString.toString();
  if (CONFIG.urlQueryString.length > 0) {
    CONFIG.userInquiry.value = CONFIG.urlQueryString.slice(
      6,
      CONFIG.urlQueryString.length
    );
    displayResults();
  }
};

const displayResults = async () => {
  autoSearchDisplay.style.visibility = "hidden";
  isError = false;
  toggleLoader();
  toggleList();
  if (!autoSearchOn) {
    CONFIG.userInquiry =
      document.getElementsByClassName("userSearchField")[0].value;
  }
  try {
    let data = await getNasdaqStats(CONFIG.userInquiry);
    if (data.length === 0) {
      isError = true;
      toggleList();
      toggleLoader();
      return popToastError("No match found please try another Query");
    }
    await createList(data);
    return toggleLoader();
  } catch (error) {
    console.log(`No Object Received from server ${error}`);
    popToastError(error);
    isError = true;
    toggleList();
    return toggleLoader();
  }
};

const getNasdaqStats = async (userQuery) => {
  if (userQuery === "") {
    throw "Invalid Stock Query Try Again";
  }
  const url = `${CONFIG.searchRequestUrl}/search?query=${userQuery}&limit=10&exchange=NASDAQ`;
  try {
    let response = await fetch(url);
    response = await response.json();
    return response;
  } catch (error) {
    console.log(`No Object Received from server ${error}`);
    popToastError(error);
  }
};

const createList = async (data) => {
  try {
    CONFIG.listDisplay.replaceChildren();
    let listContainer = document.createElement("div");
    listContainer.classList.add("listContainer");
    CONFIG.listDisplay.appendChild(listContainer);
    for (element in data) {
      let listItemContainer = document.createElement('div');
      let itemContainerLeft = document.createElement("span");
      let itemContainerRight = document.createElement("span");
      listItemContainer.classList.add("listItemContainer");
      itemContainerLeft.classList.add("itemContainer");
      itemContainerRight.classList.add("itemContainer");
      let queryResult = data[element];
      let companyInfo = await receiveFurtherData(queryResult.symbol);
      let listImage = document.createElement("img");
      if (companyInfo === undefined) {
        listImage.setAttribute("src", "../resources/noLogo.png");
        continue;
      } else {
        listImage.setAttribute("src", `${companyInfo.image}`);
      }
      listImage.classList.add("listImage");
      let listItem = document.createElement("a");
      listItem.classList.add("listItem");
      listItem.setAttribute(
        "href",
        `./company.html?symbol=${queryResult.symbol}`
      );
      listItem.setAttribute("target", `_blank`);
      listItem.innerText += `${queryResult.name}    (${queryResult.symbol})`;
      let stockIndicator = document.createElement("p");
      stockIndicator.style.marginLeft = "3vh";
      stockIndicator.innerText = `(${companyInfo.changesPercentage}%)`;
      setPriceIndicator(stockIndicator, companyInfo.changesPercentage);
      itemContainerRight.appendChild(stockIndicator);
      ItemContainerAppend(listImage, listItem,itemContainerLeft);
      listItemContainer.appendChild(itemContainerLeft);
      listItemContainer.appendChild(itemContainerRight);
      listContainer.appendChild(listItemContainer);
    }
    listContainer.style.display = "flex";
  } catch (error) {
    popToastError(
      "Error has Occurred in Data retrieval please reload and try different inquiry"
    );
    console.log(`Error in data packet from server please check:${error}`);
  }
};

const receiveFurtherData = async (CompanyKey) => {
  const url = `${CONFIG.profileDataUrl}/${CompanyKey}`;
  try {
    let response = await fetch(url);
    response = await response.json();
    return response.profile;
  } catch (error) {
    console.log(`Error in data packet from server please check:${error}`);
  }
};

const autoSearch = (e) => {
  clearTimeout(timer);
  autoSearchDisplay.style.visibility = "hidden";
  autoSearchDisplay.innerText = "";
  if (e.target.value.length > 0) {
    timer = setTimeout(async () => {
      appendQueryStringToUrl(e.target.value);
      try {
        let result = await getNasdaqStats(e.target.value);
        if (result === undefined || result.length === 0) {
          autoSearchDisplay.innerText = "No matches found";
          autoSearchDisplay.classList.add("autoSearchQuery");
          return (autoSearchDisplay.style.visibility = "visible");
        }
        if(!autoSearchOn){
          result.forEach((element) => {
            listItem = document.createElement("li");
            listItem.innerText = `${element.name}`;
            autoSearchDisplay.appendChild(listItem);
            listItem.addEventListener("click", () => {
              CONFIG.userInquiry = element.name;
              autoSearchOn = true;
              displayResults();
            });
          });
          autoSearchDisplay.style.visibility = "visible";
          autoSearchDisplay.classList.add("autoSearchQuery");
          autoSearchOn=true;
        }
        autoSearchOn=false;
      } catch (error) {
        console.log(
          `Error in data retrieval from server please check:${error}`
        );
        popToastError("AutoSearch unavailable please try again later");
      }
    }, 300);
  }
};

//Event listeners
button.addEventListener("click", () => {
  autoSearchOn = false;
  displayResults();
});
CONFIG.userInquiry.addEventListener("keyup", autoSearch);
// button.addEventListener("keypress", enableEnterKey);