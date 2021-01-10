
const date = (document.getElementById(
  "date"
).innerHTML = new Date().getFullYear());


const navBtn = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");

navBtn.addEventListener("click", () => {
  links.classList.toggle("show-links");
});

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 62) {
    navbar.classList.add("fixed");
  } else {
    navbar.classList.remove("fixed");
  }
});

const scrollLinks = document.querySelectorAll(".scroll-link");
scrollLinks.forEach(link => {
  link.addEventListener("click", e => {

    e.preventDefault();
    links.classList.remove("show-links");

    const id = e.target.getAttribute("href").slice(1);
    const element = document.getElementById(id);
    //
    let position;
    if (navbar.classList.contains("fixed")) {
      position = element.offsetTop - 62;
    } else {
      position = element.offsetTop - 124;
    }
    if (window.innerWidth < 992) {
      if (navbar.classList.contains("fixed")) {
        position = element.offsetTop - 62;
      } else {
        position = element.offsetTop - 332 - 62;
      }
    }
    window.scrollTo({
      left: 0,
      top: position,
      behavior: "smooth"
    });
  });
});
