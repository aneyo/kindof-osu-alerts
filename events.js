// Please use event listeners to run functions.
const DISPOSE_TIMEOUT = 10000;
let content, olds;
document.addEventListener("onLoad", () => {
  content = document.createElement("div");
  content.id = "alertu";

  olds = document.createElement("div");
  olds.id = "old-ones";

  content.appendChild(olds);
  document.body.appendChild(content);
});

document.addEventListener("onEventReceived", event => {
  console.log(event);

  let element = document.querySelector("body > .osu");

  content.appendChild(element);
  element.classList.add("new");
  element.classList.add(event.detail.type);

  element.addEventListener("animationend", event => {
    if (event.target.classList.contains("notification")) {
      if (!element.hasAttribute("to-despose")) {
        element.setAttribute("to-despose", "");

        setTimeout(() => {
          element.setAttribute("dispose", "");
          element.addEventListener("animationend", e => e.target.remove());
        }, DISPOSE_TIMEOUT);
      }
    }
  });

  let old = document.querySelector("#alertu > .osu.new:not(:last-child)");

  if (old) {
    old.classList.remove("new");
    old.classList.add("old");

    olds.appendChild(old);
    document.querySelectorAll("#old-ones > .osu").forEach(node => {
      /* force refresh trick to start sorting animation again */
      node.style.display = "none"; // hide item
      node.offsetHeight; // tell browser that we referenced one of layout values, that should do the trick
      node.style.display = null; // remove inline style
      /* node should redraw cause browser now thinks that we changed layout values */
    });
  }
});
