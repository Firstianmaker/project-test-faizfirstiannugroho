let lastScrollTop = 0;
const header = document.querySelector(".header");

window.addEventListener("scroll", function () {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    header.style.top = "-100px";
  } else {
    header.style.top = "0";
  }
  lastScrollTop = scrollTop;
});

window.addEventListener("scroll", function () {
  const bannerImage = document.querySelector(".banner-image img");
  const scrollPosition = window.pageYOffset;
  bannerImage.style.transform = `translateY(${scrollPosition * 0.5}px)`;
});

let currentPage = 1;
const items = Array.from(document.querySelectorAll(".card"));
const grid = document.querySelector(".grid");
const paginationContainer = document.querySelector(".page-numbers");

const storedState = localStorage.getItem("appState");
if (storedState) {
  const { sortValue, perPage, currentPage } = JSON.parse(storedState);
  document.getElementById("sort").value = sortValue;
  document.getElementById("per-page").value = perPage;
  this.currentPage = currentPage;
}

const hash = window.location.hash;
if (hash) {
  const pageNumber = parseInt(hash.replace("#page=", ""), 10);
  if (pageNumber) {
    currentPage = pageNumber;
  }
}

function updateView() {
  const sortValue = document.getElementById("sort").value;
  const perPage = parseInt(document.getElementById("per-page").value, 10);

  items.sort((a, b) => {
    let dateA = new Date(a.querySelector("h2").textContent);
    let dateB = new Date(b.querySelector("h2").textContent);
    return sortValue === "newest" ? dateB - dateA : dateA - dateB;
  });

  grid.innerHTML = "";

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  items.slice(startIndex, endIndex).forEach((item) => {
    grid.appendChild(item);
    item.style.display = "";
  });

  const totalPages = Math.ceil(items.length / perPage);
  paginationContainer.innerHTML = "";

  if (totalPages > 1) {
    const prevLink = document.createElement("a");
    prevLink.href = "#";
    prevLink.textContent = "<";
    prevLink.disabled = currentPage === 1;
    paginationContainer.appendChild(prevLink);

    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement("a");
      pageLink.href = `#page=${i}`;
      pageLink.textContent = i;
      pageLink.className = currentPage === i ? "active" : "";
      paginationContainer.appendChild(pageLink);
    }

    const nextLink = document.createElement("a");
    nextLink.href = "#";
    nextLink.textContent = ">";
    nextLink.disabled = currentPage === totalPages;
    paginationContainer.appendChild(nextLink);
  }

  const appState = {
    sortValue,
    perPage,
    currentPage,
  };
  localStorage.setItem("appState", JSON.stringify(appState));

  window.location.hash = `#page=${currentPage}`;
}

document.getElementById("sort").addEventListener("change", updateView);

document.getElementById("per-page").addEventListener("change", () => {
  const perPage = parseInt(document.getElementById("per-page").value, 10);
  if (currentPage > 1) {
    currentPage = 1;
    window.location.hash = `#page=${currentPage}`;
  }
  updateView();
});

paginationContainer.addEventListener("click", (event) => {
  event.preventDefault();
  const target = event.target;
  if (target.tagName === "A") {
    if (target.textContent === "<") {
      currentPage = Math.max(1, currentPage - 1);
    } else if (target.textContent === ">") {
      currentPage = Math.min(totalPages, currentPage + 1);
    } else {
      currentPage = parseInt(target.textContent);
    }
    updateView();
  }
});

updateView();
