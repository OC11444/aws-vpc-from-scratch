document.getElementById("docToggle").addEventListener("change", function() {
  document.getElementById("docSection").style.display = this.checked ? "block" : "none";
});

function submitTask() {
  document.querySelector("#modal").style.display = "block";
  let progress = document.querySelector("#progressBar div");
  let width = parseInt(progress.style.width) || 0;
  progress.style.width = Math.min(width + 20, 100) + "%";
  setTimeout(() => {
    document.querySelector("#modal").style.display = "none";
  }, 2000);
}