$(document).ready(function () {
    $('#register-form').submit(function (e) {
        e.preventDefault();

        var username = $('#username').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var confirmPassword = $('#confirm-password').val();

        // Validate username
        if (username.length < 6 || username.length > 20) {
            alert("Tên đăng nhập phải có độ dài từ 6 đến 20 ký tự.");
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Vui lòng nhập địa chỉ email hợp lệ!");
            return;
        }

        // Validate password
        if (password.length < 6 || password.length > 20) {
            alert("Mật khẩu phải có độ dài từ 6 đến 20 ký tự.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp!");
            return;
        }

        // Get accounts from localStorage
        var accounts = JSON.parse(localStorage.getItem('accounts')) || [];

        // Check for existing username or email
        if (accounts.some(account => account.username === username)) {
            alert("Tài khoản đã tồn tại!");
            return;
        }
        if (accounts.some(account => account.email === email)) {
            alert("Email đã được sử dụng!");
            return;
        }

        // Save new account
        accounts.push({ username: username, email: email, password: password });
        localStorage.setItem('accounts', JSON.stringify(accounts));

        $('.btn').text('Registering...');
        setTimeout(() => {
            alert("Đăng ký thành công!");
            window.location.href = 'login.html';
        }, 1000);
    });
});