window.onload = async function () {
  const marquee = new Marquee(CONFIG.marqueeContainer);
  await marquee.load();
  const results = new SearchResult();
  const form = new SearchForm(document.getElementById("form"), results);
  form.createForm();
  form.searchAppendedUrl();
};
