const CONFIG = {
  //global variables
  userInquiry: document.getElementsByClassName("userSearchField")[0],
  mainContainer: document.getElementsByClassName("main_Container")[0],
  results: document.getElementById("results"),
  marqueeContainer: document.getElementById("marquee"),
  companySymbol: "",
  // companySymbolList:[],
  dateLogs: [],
  closingPriceLogs: [],
  //status variables
  loadingState: false,
  displayPageState: false,
  isError: false,
  autoSearchOn: false,
  //url addresses
  searchRequestUrl: `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3`,
  profileDataUrl:
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile",
  stockHistoryUrl:
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/",
};
