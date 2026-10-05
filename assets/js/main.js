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
})();
