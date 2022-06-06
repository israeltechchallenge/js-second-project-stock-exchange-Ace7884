//global variables
let userInquiry = document.getElementsByClassName("userSearchField")[0];
let button = document.getElementsByClassName("searchButton")[0];
let listDisplay = document.createElement("div");
let marqueeContainer = document.createElement("div");
let urlQueryString = "";
let companySymbol = "";
//status variables
let loading = false;
let list = false;
let displayPage = false;
let isError = false;

const Url = {
  searchRequest: `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3`,
  profileData:
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile",
  stockHistory:
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/",
  stockPriceMarque:
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/nasdaq",
};
