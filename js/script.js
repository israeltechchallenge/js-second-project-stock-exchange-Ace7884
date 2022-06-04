//Functions
async function getNasdaqStats(userQuery) {
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
}

//Event listeners
button.addEventListener("click", inquiryRequest);
document.addEventListener("keypress", enableEnterKey);
userInquiry.addEventListener("click", function () {
  resetInput();
});
