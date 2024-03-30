const posts = document.getElementById("posts");
const loading = document.querySelector(".loading");
const filter = document.getElementById("filter");

let page = 1;
let limit = 5;

let pageInit = false;

const getPosts = async () => {
  const result = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
  );

  return result.json();
};

const showPosts = async () => {
  const getAllPosts = await getPosts();

  getAllPosts.forEach((post) => {
    const element = document.createElement("div");
    element.classList.add("post");

    element.innerHTML = `
        <div class="number">${post.id}</div>
        <div class="post-info">
          <div class="post-title">${post.title}</div>
          <div class="post-body">${post.body}</div>
        </div>
        `;

    posts.appendChild(element);
  });
};

const showLoading = () => {
  if (!pageInit) return;
  loading.classList.add("show");

  setTimeout(() => {
    loading.classList.remove("show");

    page++;
    showPosts();
  }, 1000);
};

const searchedPhrase = (section, phrase, term, post) => {
  const splittedPhrase = phrase.split(" ");
  const keyword = splittedPhrase.find((word) => word.toUpperCase() === term);
  const index = splittedPhrase.indexOf(keyword);
  splittedPhrase[
    index
  ] = `<span style='background-color: red; color: white; padding-left: 3px; padding-right:3px'>${keyword}</span>`;
  section === "title"
    ? (post.querySelector(".post-title").innerHTML = splittedPhrase.join(" "))
    : (post.querySelector(".post-body").innerHTML = splittedPhrase.join(" "));
};

const filterPosts = (event) => {
  const term = event.target.value.toUpperCase();
  const posts = document.querySelectorAll(".post");

  posts.forEach((post) => {
    const title = post.querySelector(".post-title").innerText;
    const body = post.querySelector(".post-body").innerText;

    if (
      title.toUpperCase().indexOf(term) > -1 ||
      body.toUpperCase().indexOf(term) > -1
    ) {
      post.style.display = "block";
      searchedPhrase("title", title, term, post);
      searchedPhrase("body", body, term, post);
    } else post.style.display = "none";
  });

  pageInit = false;
};

filter.addEventListener("input", filterPosts);

window.addEventListener("scroll", () => {
  if (
    Math.abs(
      document.documentElement.scrollHeight -
        document.documentElement.scrollTop -
        document.documentElement.clientHeight
    ) < 1
  ) {
    showLoading();
    pageInit = true;
  }
});

showPosts();
