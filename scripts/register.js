$(document).ready(function () {
    // Xử lý khi người dùng gửi form đăng ký
    $('#register-form').submit(function (e) {
        e.preventDefault(); // Ngừng hành động mặc định của form

        var username = $('#username').val();
        var password = $('#password').val();
        var confirmPassword = $('#confirm-password').val();
        // Kiểm tra tên đăng nhập và mật khẩu
        if (username.length < 6 || username.length > 20) {
            alert("Tên đăng nhập phải có độ dài từ 6 đến 20 ký tự.");
            event.preventDefault(); // Ngừng gửi form nếu tên đăng nhập không hợp lệ
            return;
        }

        if (password.length < 6 || password.length > 20) {
            alert("Mật khẩu phải có độ dài từ 6 đến 20 ký tự.");
            event.preventDefault(); // Ngừng gửi form nếu mật khẩu không hợp lệ
            return;
        }
        //  xác nhận mật khẩu
        if (password !== confirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp!");
            return;
        }

        // Lấy danh sách tài khoản đã có từ localStorage
        var accounts = JSON.parse(localStorage.getItem('accounts')) || [];
        // Kiểm tra xem tài khoản đã tồn tại chưa
        if (accounts.some(account => account.username === username)) {
            alert("Tài khoản đã tồn tại!");
            return;
        }

        // Thêm tài khoản mới vào danh sách
        accounts.push({ username: username, password: password });

        // Lưu lại danh sách tài khoản vào localStorage
        localStorage.setItem('accounts', JSON.stringify(accounts));

        alert("Đăng ký thành công!");
        window.location.href = 'login.html'; // Chuyển đến trang đăng nhập
    });
});