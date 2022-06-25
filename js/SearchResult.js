class SearchResult {
  constructor() {
    
  }

  displayResults = async () => {
    CONFIG.results.style.visibility = "hidden";
    CONFIG.results.innerText='';
    CONFIG.isError = false;
    toggleLoader();
    toggleList();
    if (!CONFIG.autoSearchOn) {
      CONFIG.userInquiry =
        document.getElementsByClassName("userSearchField")[0].value;
    }
    try {
      let data = await getNasdaqStats(CONFIG.userInquiry);
      if (data.length === 0) {
        CONFIG.isError = true;
        toggleList();
        toggleLoader();
        return popToastError("No match found please try another Query");
      }
      await this.createList(data);
      return toggleLoader();
    } catch (error) {
      console.log(`No Object Received from server ${error}`);
      popToastError(error);
      CONFIG.isError = true;
      toggleList();
      return toggleLoader();
    }
  };

  receiveFurtherData = async (CompanyKey) => {
    const url = `${CONFIG.profileDataUrl}/${CompanyKey}`;
    try {
      let response = await fetch(url);
      response = await response.json();
      return response.profile;
    } catch (error) {
      console.log(`Error in data packet from server please check:${error}`);
    }
  };

  createList = async (data) => {
    try {
      CONFIG.element = document.getElementById("results");
      let listContainer = document.createElement("div");
      listContainer.classList.add("listContainer");
      CONFIG.element.appendChild(listContainer);
      // Milestone3.1 pending work
      // console.log(CONFIG.companySymbolList);
      // let companyInfo = await Promise.all(receiveFurtherData(CONFIG.companySymbolList));
      for (let key in data) {
        let listItemContainer = document.createElement("div");
        let itemContainerLeft = document.createElement("span");
        let itemContainerRight = document.createElement("span");
        listItemContainer.classList.add("listItemContainer");
        itemContainerLeft.classList.add("itemContainer");
        itemContainerRight.classList.add("itemContainer");
        let queryResult = data[key];
        let companyInfo = await this.receiveFurtherData(queryResult.symbol);
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
        let listItemText = `${queryResult.name}    (${queryResult.symbol})`;
        listItemText = [...listItemText];
        let userInputArray = [...CONFIG.userInquiry];
        listContainer.style.display = "flex";
        for (let i = 0; i < listItemText.length; i++) {
          let charWrapper = document.createElement("span");
          charWrapper.innerText = listItemText[i];
          listItem.appendChild(charWrapper);
          for (let j = 0; j < CONFIG.userInquiry.length; j++) {
            if (listItemText[i] === userInputArray[j]) {
              charWrapper.classList.add("charWrapper");
            }
          }
        }
        ItemContainerAppend(listImage, listItem, itemContainerLeft);
        let stockIndicator = document.createElement("p");
        stockIndicator.style.marginLeft = "3vh";
        stockIndicator.innerText = `(${companyInfo.changesPercentage}%)`;
        setPriceIndicator(stockIndicator, companyInfo.changesPercentage);
        itemContainerRight.appendChild(stockIndicator);
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
}
