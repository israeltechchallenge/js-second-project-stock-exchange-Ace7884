//Auxiliary functions
function enableEnterKey(event) {
  if (event.key === "Enter" && list) {
    inquiryRequest();
  }
}

function inquiryRequest() {
  if (userInquiry.value.length > 0) {
    listDisplay.innerHTML = "";
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

function resetInput() {
  userInquiry.value = "";
}

function toggleList() {
  if (!list && userInquiry.value.length > 0) {
    listDisplay.innerHTML = "";
    document
      .getElementsByClassName("main_Container")[0]
      .appendChild(listDisplay);
    listDisplay.classList.add("listDisplay");
    return (list = true);
  }
  if (list && userInquiry.value.length > 0) {
    return (list = true);
  }
  listDisplay.classList.remove("listDisplay");
  document.getElementsByClassName("main_Container")[0].removeChild(listDisplay);
  return (list = false);
}

function toggleLoader() {
  if (!loading) {
    document.getElementsByClassName("loading-bar-spinner")[0].style.display =
      "block";
    return (loading = true);
  }
  document.getElementsByClassName("loading-bar-spinner")[0].style.display =
    "none";
  return (loading = false);
}
