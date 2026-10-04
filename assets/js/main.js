(() => {
  // Theme switch
  const body = document.body;
  const lamp = document.getElementById("mode");

  lamp.addEventListener("click", () => {
    const next = body.hasAttribute("data-theme") ? "light" : "dark";
    if (next === "dark") {
      body.setAttribute("data-theme", "dark");
    } else {
      body.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });

  // Blur the content when the menu is open
  const cbox = document.getElementById("menu-trigger");

  cbox.addEventListener("change", function () {
    const area = document.querySelector(".wrapper");
    this.checked
      ? area.classList.add("blurry")
      : area.classList.remove("blurry");
  });
})();
