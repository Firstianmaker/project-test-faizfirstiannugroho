fetch("/api/ideas", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    "page[number]": 1,
    "page[size]": 10,
    append: ["small_image", "medium_image"],
    sort: "-published_at",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
