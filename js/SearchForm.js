class SearchForm {
  constructor(element, instance) {
    this.element = element;
    this.instance = instance;
    this.searchInputContainer;
    this.autoSearchDisplay;
    this.button;
    this.timer = 0;
  }

  createForm = () => {
    this.searchInputContainer = document.createElement("div");
    CONFIG.userInquiry = document.createElement("input");
    this.autoSearchDisplay = document.createElement("div");
    this.button = document.createElement("button");
    this.element.setAttribute("id", "form");
    this.searchInputContainer.classList.add("searchInputContainer");
    CONFIG.userInquiry.classList.add("userSearchField");
    this.autoSearchDisplay.classList.add("autoSearchQuery");
    this.button.classList.add("searchButton");
    CONFIG.userInquiry.setAttribute("placeholder", "Search for Data");
    this.button.innerText = "Submit";
    this.element.appendChild(this.searchInputContainer);
    this.element.appendChild(this.button);
    this.searchInputContainer.appendChild(CONFIG.userInquiry);
    this.searchInputContainer.appendChild(this.autoSearchDisplay);
    this.enableEventListeners(CONFIG.userInquiry);
  };

  autoSearch = (e) => {
    this.autoSearchDisplay.innerText = "";
    clearTimeout(this.timer);
    this.autoSearchDisplay.style.visibility = "hidden";
    this.autoSearchDisplay.innerText = "";
    if (e.target.value.length > 0) {
      this.timer = setTimeout(async () => {
        this.appendQueryStringToUrl(e.target.value);
        try {
          let result = await getNasdaqStats(e.target.value);
          if (result === undefined || result.length === 0) {
            this.autoSearchDisplay.innerText = "No matches found";
            this.autoSearchDisplay.classList.add("autoSearchQuery");
            return (this.autoSearchDisplay.style.visibility = "visible");
          }
          if (!CONFIG.autoSearchOn) {
            result.forEach((element) => {
              let listItem = document.createElement("li");
              listItem.innerText = `${element.name}`;
              this.autoSearchDisplay.appendChild(listItem);
              listItem.addEventListener("click", () => {
                CONFIG.userInquiry = element.name;
                CONFIG.autoSearchOn = true;
                this.instance.displayResults();
              });
            });
            this.autoSearchDisplay.style.visibility = "visible";
            this.autoSearchDisplay.classList.add("autoSearchQuery");
            CONFIG.autoSearchOn = true;
          }
          CONFIG.autoSearchOn = false;
        } catch (error) {
          console.log(
            `Error in data retrieval from server please check:${error}`
          );
          popToastError("AutoSearch unavailable please try again later");
        }
      }, 300);
    }
  };

  enableEventListeners = (userInquiry) => {
    this.button.addEventListener("click", () => {
      this.autoSearchDisplay.style.visibility = "hidden";
      CONFIG.autoSearchOn = false;
      CONFIG.results.innerText='';
      this.instance.displayResults();
    });
    document.body.addEventListener("keypress", this.enableEnterKey);
    userInquiry.addEventListener("keyup", this.autoSearch);
    document.body.addEventListener("click", () => {
      this.autoSearchDisplay.style.visibility = "hidden";
      CONFIG.autoSearchOn = false;
    });
  };

  enableEnterKey = (event) => {
    if (event.key === "Enter") {
      this.autoSearchDisplay.style.visibility = "hidden";
      CONFIG.autoSearchOn = false;
      this.instance.displayResults();
    }
  };

  searchAppendedUrl = () => {
    let urlQueryString = new URLSearchParams(window.location.search);
    urlQueryString = urlQueryString.toString();
    if (urlQueryString.length > 0) {
      CONFIG.userInquiry.value = urlQueryString.slice(6, urlQueryString.length);
      CONFIG.results.innerText='';
      this.instance.displayResults();
    }
  };

  appendQueryStringToUrl = (targetString) => {
    const url = new URL(window.location);
    url.searchParams.set("query", `${targetString}`);
    history.pushState({}, "", url);
  };
}
