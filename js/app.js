// Webp support
function isWebp() {
  function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }

  testWebP(function (support) {
    if (support == true) {
      document.querySelector("body").classList.add("webp");
    } else {
      document.querySelector("body").classList.add("no-webp");
    }
  });
}

// Header events
function headerHandler() {
  // Scroll
  const header = document.querySelector(".header");

  if (header) {
    headerOnScroll();
    window.addEventListener("scroll", headerOnScroll);
  }

  // Burger
  const burger = document.querySelector(".header__burger");

  if (burger) {
    const menu = document.querySelector(".header__middle");

    burger.addEventListener("click", () => {
      burger.classList.toggle("_active");
      menu.classList.toggle("_active");
      document.body.classList.toggle("_lock");
    });
  }

  function headerOnScroll() {
    if (window.scrollY > 0) {
      header.classList.add("_scroll");
    } else {
      header.classList.remove("_scroll");
    }
  }
}

// Anchor Scroll
function anchorLinks() {
  const links = document.querySelectorAll("a._anchor-scroll");
  const header = document.querySelector(".header"),
    burger = document.querySelector(".header__burger"),
    menu = document.querySelector(".header__middle");

  for (let index = 0; index < links.length; index++) {
    const link = links[index];

    link.addEventListener("click", (e) => {
      e.preventDefault();

      const href = link.getAttribute("href").replace("#", ""),
        scrollTarget = document.getElementById(href),
        elementPosition = scrollTarget.getBoundingClientRect().top,
        topOffset = getTopOffset(),
        offsetPosition = elementPosition - topOffset;

      // Close menu & burger on click
      burger.classList.remove("_active");
      menu.classList.remove("_active");
      document.body.classList.remove("_lock");

      window.scrollBy({
        top: offsetPosition,
        behavior: "smooth",
      });
    });
  }
  function getTopOffset() {
    if (window.innerWidth <= 991.98 || header.classList.contains("_scroll")) {
      return header.clientHeight;
    }
    return header.clientHeight - 67;
  }
}

// Lazyloading
function lazyload() {
  window.onload = () => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;

          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          } else if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute("data-srcset");
          }

          img.onload = () => {
            img.classList.add("_lazy-loaded");
          };
          observer.unobserve(img);
        }
      });
    }, options);

    const lazyImages = document.querySelectorAll(
      "img[data-src], source[data-srcset]"
    );
    lazyImages.forEach((img) => observer.observe(img));
  };
}

// Dynamic Adaptive
class DynamicAdapt {
  constructor(type) {
    this.type = type;
  }

  init() {
    // ???????????? ????????????????
    this.??bjects = [];
    this.daClassname = "_dynamic_adapt_";
    // ???????????? DOM-??????????????????
    this.nodes = [...document.querySelectorAll("[data-da]")];

    // ???????????????????? ??bjects ????????????????
    this.nodes.forEach((node) => {
      const data = node.dataset.da.trim();
      const dataArray = data.split(",");
      const ??bject = {};
      ??bject.element = node;
      ??bject.parent = node.parentNode;
      ??bject.destination = document.querySelector(`${dataArray[0].trim()}`);
      ??bject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
      ??bject.place = dataArray[2] ? dataArray[2].trim() : "last";
      ??bject.index = this.indexInParent(??bject.parent, ??bject.element);
      this.??bjects.push(??bject);
    });

    this.arraySort(this.??bjects);

    // ???????????? ???????????????????? ??????????-????????????????
    this.mediaQueries = this.??bjects
      .map(
        ({ breakpoint }) =>
          `(${this.type}-width: ${breakpoint}px),${breakpoint}`
      )
      .filter((item, index, self) => self.indexOf(item) === index);

    // ?????????????????????? ?????????????????? ???? ??????????-????????????
    // ?? ?????????? ?????????????????????? ?????? ???????????? ??????????????
    this.mediaQueries.forEach((media) => {
      const mediaSplit = media.split(",");
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];

      // ???????????? ???????????????? ?? ???????????????????? ????????????????????????
      const ??bjectsFilter = this.??bjects.filter(
        ({ breakpoint }) => breakpoint === mediaBreakpoint
      );
      matchMedia.addEventListener("change", () => {
        this.mediaHandler(matchMedia, ??bjectsFilter);
      });
      this.mediaHandler(matchMedia, ??bjectsFilter);
    });
  }

  // ???????????????? ??????????????
  mediaHandler(matchMedia, ??bjects) {
    if (matchMedia.matches) {
      ??bjects.forEach((??bject) => {
        ??bject.index = this.indexInParent(??bject.parent, ??bject.element);
        this.moveTo(??bject.place, ??bject.element, ??bject.destination);
      });
    } else {
      ??bjects.forEach(({ parent, element, index }) => {
        if (element.classList.contains(this.daClassname)) {
          this.moveBack(parent, element, index);
        }
      });
    }
  }

  // ?????????????? ??????????????????????
  moveTo(place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === "last" || place >= destination.children.length) {
      destination.append(element);
      return;
    }
    if (place === "first") {
      destination.prepend(element);
      return;
    }
    destination.children[place].before(element);
  }

  // ?????????????? ????????????????
  moveBack(parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
      parent.children[index].before(element);
    } else {
      parent.append(element);
    }
  }

  // ?????????????? ?????????????????? ?????????????? ???????????? ????????????????
  indexInParent(parent, element) {
    return [...parent.children].indexOf(element);
  }

  // ?????????????? ???????????????????? ?????????????? ???? breakpoint ?? place
  // ???? ?????????????????????? ?????? this.type = min
  // ???? ???????????????? ?????? this.type = max
  arraySort(arr) {
    if (this.type === "min") {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === "first" || b.place === "last") {
            return -1;
          }
          if (a.place === "last" || b.place === "first") {
            return 1;
          }
          return a.place - b.place;
        }
        return a.breakpoint - b.breakpoint;
      });
    } else {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === "first" || b.place === "last") {
            return 1;
          }
          if (a.place === "last" || b.place === "first") {
            return -1;
          }
          return b.place - a.place;
        }
        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  }
}

// lazyloading();
headerHandler();
isWebp();
anchorLinks();
lazyload();

// ---> Dynamic Adaptive <---
const da = new DynamicAdapt("max");
da.init();
// ---> Dynamic Adaptive <---
