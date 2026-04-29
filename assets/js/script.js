function loadHeaderAndFooter() {
  const rootPath = "../".repeat(location.pathname.split("/").length - 2);
  const cacheBuster = "?v=" + new Date().getFullYear() + String(new Date().getMonth() + 1).padStart(2, "0") + String(new Date().getDate()).padStart(2, "0");
  fetch(rootPath + "header.html" + cacheBuster)
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("#header").innerHTML = data;
    });
  fetch(rootPath + "footer.html" + cacheBuster)
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("#footer").innerHTML = data;
    });
  fetch(rootPath + "blog-footer.html" + cacheBuster)
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("#blog-footer").innerHTML = data;
    });
}
loadHeaderAndFooter();
function openInNewWindow(link) {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const windowWidth = 600;
  const windowHeight = screenHeight;
  const left = (screenWidth - windowWidth) / 2;
  const top = 0;
  window.open(link, "", `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`);
}
function shareOnLinkedIn() {
  var url = window.location.href;
  var title = document.title;
  openInNewWindow("https://www.linkedin.com/shareArticle?url=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(title));
}
function shareOnTwitter() {
  var url = window.location.href;
  var title = document.title;
  openInNewWindow("https://twitter.com/intent/tweet?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(title));
}
function shareOnFacebook() {
  var url = window.location.href;
  openInNewWindow("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url));
}
function copyToClipboard() {
  var url = window.location.href;
  var textField = document.createElement("textarea");
  textField.innerText = url;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand("copy");
  textField.remove();
  alert("URL copied to clipboard: " + url);
}
function shareViaEmail() {
  var url = window.location.href;
  var title = document.title;
  openInNewWindow("mailto:?subject=" + encodeURIComponent(title) + "&body=I%20thought%20you%20might%20find%20this%20article%20interesting:%20" + encodeURIComponent(url));
}
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".linkedin-share").addEventListener("click", shareOnLinkedIn);
  document.querySelector(".twitter-share").addEventListener("click", shareOnTwitter);
  document.querySelector(".facebook-share").addEventListener("click", shareOnFacebook);
  document.querySelector(".copy-link").addEventListener("click", copyToClipboard);
  document.querySelector(".email-share").addEventListener("click", shareViaEmail);
});
document.addEventListener("DOMContentLoaded", function () {
  var buttons = document.querySelectorAll(".author-accordian .accordion-item .icon");
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var icon = this.querySelector("i");
      icon.classList.toggle("uil-angle-down");
      icon.classList.toggle("uil-angle-up");
    });
  });
});
