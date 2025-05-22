$(document).ready(function () {
    $('#login-form').submit(function (e) {
        e.preventDefault();

        var username = $('#username').val();
        var password = $('#password').val();

        var accounts = JSON.parse(localStorage.getItem('accounts')) || [];
        var user = accounts.find(account => account.username === username && account.password === password);

        if (user) {
            $('.btn').text('Logging in...');
            setTimeout(() => {
                alert("Đăng nhập thành công!");
                window.location.href = 'index.html';
            }, 1000);
        } else {
            alert("Sai tài khoản hoặc mật khẩu!");
        }
    });
});