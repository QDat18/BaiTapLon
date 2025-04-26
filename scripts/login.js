$(document).ready(function () {
    // Xử lý khi người dùng gửi form đăng nhập
    $('#login-form').submit(function (e) {
        e.preventDefault(); // Ngừng hành động mặc định của form

        var username = $('#username').val();
        var password = $('#password').val();

        // Lấy danh sách tài khoản đã đăng ký từ localStorage
        var accounts = JSON.parse(localStorage.getItem('accounts')) || [];

        // Kiểm tra tài khoản và mật khẩu
        var user = accounts.find(account => account.username === username && account.password === password);

        if (user) {
            alert("Đăng nhập thành công!");
            // Sau khi đăng nhập thành công, chuyển hướng đến trang chủ hoặc trang cá nhân
            window.location.href = 'index.html';
        } else {
            alert("Sai tài khoản hoặc mật khẩu!");
        }
    });
});