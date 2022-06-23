//global variables
let button = document.querySelector("button");
let autoSearchDisplay = document.getElementsByClassName("autoSearchQuery")[0];
let timer = 0;
let isError=false;
let autoSearchOn =false;

const CONFIG = {
  userInquiry: document.getElementsByClassName("userSearchField")[0],
  mainContainer: document.getElementsByClassName("main_Container")[0],
  listDisplay: document.createElement("div"),
  marqueeContainer: document.getElementById("marquee"),
  urlQueryString: "",
  companySymbol: "",
  //status variables
  loadingState: false,
  displayPageState: false,
  errorState: false,
  //url adresses
  searchRequestUrl: `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3`,
  profileDataUrl:
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile",
  stockHistoryUrl:
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/",
  //helper Functions
    popToastError (text) {
      let errorToast = document.getElementsByClassName("errorToast")[0];
      errorToast.classList.add("show");
      errorToast.innerText = text;
      setTimeout(() => {
        errorToast.className = errorToast.className.replace("show", "");
      }, 5000);
    },
  };
