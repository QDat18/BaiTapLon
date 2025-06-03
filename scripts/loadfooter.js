document.addEventListener("DOMContentLoaded", function () {
  fetch("component/footer.html")
    .then(response => {
      if (!response.ok) {
        throw new Error("Không thể tải footer.");
      }
      return response.text();
    })
    .then(html => {
      document.getElementById("footer-placeholder").innerHTML = html;
      console.log("Footer đã được tải thành công.");
    })
    .catch(error => {
      console.error("Lỗi khi tải footer:", error);
    });
});