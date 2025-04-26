document.addEventListener('DOMContentLoaded', function() {
  // Load navbar
  fetch('components/navbar.html')
      .then(response => response.text())
      .then(data => {
          document.getElementById('navbar-placeholder').innerHTML = data;
      });
  
  // Load footer
  fetch('components/footer.html')
      .then(response => response.text())
      .then(data => {
          document.getElementById('footer-placeholder').innerHTML = data;
      });
});