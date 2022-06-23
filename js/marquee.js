class Marquee {
  constructor(element) {
    this.element = element;
    this.url =
      "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/nasdaq";
  }
  load = async () => {
    try {
      this.element.innerHTML = "";
      this.element.classList.add("stockMarquee_Container");
      let marqueeText = document.createElement("span");
      marqueeText.classList.add("marqueeDisplay");
      let marqueeData = await this.getMarqueeStockData();
      for (let key in marqueeData) {
        if (CONFIG.errorState === true && key === "100") {
          break;
        } else {
          this.appendMarquee(marqueeData[key], marqueeText);
        }
      }
      this.element.appendChild(marqueeText);
    } catch (error) {
      CONFIG.errorState = true;
      console.log(`Error in data rendering from server please check:${error}`);
      this.createMarquee();
    }
  };

  getMarqueeStockData = async () => {
    let response = await fetch(this.url);
    try {
      response = await response.json();
      return response;
    } catch (error) {
      console.log(`Error in data rendering from server please check:${error}`);
      popToastError(
        "Error occurred while loading stock updates please refresh or try again later"
      );
    }
  };

  appendMarquee = (data, element) => {
    let marqueeStockSymbol = document.createElement("p");
    let marqueeStockPrice = document.createElement("p");
    marqueeStockSymbol.innerText = `${data.symbol}`;
    marqueeStockSymbol.style.color = "rgb(255, 247, 0)";
    marqueeStockSymbol.style.paddingLeft = "1vw";
    marqueeStockPrice.innerText = `$${data.price}`;
    marqueeStockPrice.style.color = "rgb(43, 255, 0)";
    this.ItemContainerAppend(marqueeStockSymbol, marqueeStockPrice, element);
  };

  ItemContainerAppend = (...arg) => {
    let listArr = [...arg];
    let parentElement = listArr.pop();
    listArr.forEach((item) => {
      parentElement.appendChild(item);
    });
  };
}
