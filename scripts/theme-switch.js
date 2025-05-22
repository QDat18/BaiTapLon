
// Thiết lập mặc định
const ThemeSettings = {
  // Chế độ mặc định (auto = theo hệ thống, light = sáng, dark = tối)
  defaultTheme: 'auto',
  // Key lưu trong localStorage
  storageKey: 'anhemrot_theme',
  // Các class để áp dụng chế độ tối
  darkModeClass: 'dark-theme',
  // Transition khi chuyển chế độ
  transitionClass: 'theme-transition',
  // Thời gian transition (ms)
  transitionDuration: 1000
};

// Khởi tạo themeManager
const themeManager = {
  currentTheme: ThemeSettings.defaultTheme,
  systemPrefersDark: false,
  
  /**
   * Khởi tạo chức năng
   */
  initialize() {
    // Kiểm tra theme trong localStorage
    const savedTheme = localStorage.getItem(ThemeSettings.storageKey);
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }
    
    // Kiểm tra thiết lập hệ thống
    this.systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Thêm sự kiện lắng nghe khi thiết lập hệ thống thay đổi
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      this.systemPrefersDark = e.matches;
      if (this.currentTheme === 'auto') {
        this.applyTheme();
      }
    });
    
    // Tạo widget chuyển đổi
    this.createThemeWidget();
    
    // Áp dụng theme hiện tại
    this.applyTheme();
  },
  
  /**
   * Tạo widget chuyển đổi theme
   */
  createThemeWidget() {
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
      <button class="theme-toggle-btn" id="theme-toggle-btn" aria-label="Chuyển đổi giao diện">
        <i class="fas fa-sun light-icon"></i>
        <i class="fas fa-moon dark-icon"></i>
        <span class="theme-toggle-slider"></span>
      </button>
      <div class="theme-menu">
        <div class="theme-option" data-theme="light">
          <i class="fas fa-sun"></i>
          <span>Sáng</span>
        </div>
        <div class="theme-option" data-theme="dark">
          <i class="fas fa-moon"></i>
          <span>Tối</span>
        </div>
        <div class="theme-option" data-theme="auto">
          <i class="fas fa-adjust"></i>
          <span>Tự động</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(themeToggle);
    
    // Thêm sự kiện click cho nút toggle
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const themeMenu = themeToggle.querySelector('.theme-menu');
    
    toggleBtn.addEventListener('click', () => {
      themeMenu.classList.toggle('show');
    });
    
    // Thêm sự kiện cho các tùy chọn
    const themeOptions = themeToggle.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const theme = option.getAttribute('data-theme');
        this.setTheme(theme);
        themeMenu.classList.remove('show');
      });
    });
    
    // Đóng menu khi click ra ngoài
    document.addEventListener('click', (event) => {
      if (!themeToggle.contains(event.target)) {
        themeMenu.classList.remove('show');
      }
    });
    
    // Cập nhật trạng thái active cho tùy chọn hiện tại
    this.updateActiveOption();
  },
  
  /**
   * Cập nhật trạng thái active cho tùy chọn hiện tại
   */
  updateActiveOption() {
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
      const theme = option.getAttribute('data-theme');
      if (theme === this.currentTheme) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
    
    // Cập nhật icon toggle
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (this.getCurrentMode() === 'dark') {
      toggleBtn.classList.add('dark-active');
    } else {
      toggleBtn.classList.remove('dark-active');
    }
  },
  
  /**
   * Đặt theme
   * @param {string} theme - Theme mới (light, dark, auto)
   */
  setTheme(theme) {
    if (!['light', 'dark', 'auto'].includes(theme)) {
      console.error('Theme không hợp lệ:', theme);
      return;
    }
    
    this.currentTheme = theme;
    localStorage.setItem(ThemeSettings.storageKey, theme);
    
    this.applyTheme();
    this.updateActiveOption();
    
    // Kích hoạt sự kiện theme thay đổi
    const event = new CustomEvent('themeChanged', { 
      detail: { theme: theme, mode: this.getCurrentMode() } 
    });
    document.dispatchEvent(event);
  },
  
  /**
   * Lấy chế độ hiện tại (light hoặc dark)
   */
  getCurrentMode() {
    if (this.currentTheme === 'auto') {
      return this.systemPrefersDark ? 'dark' : 'light';
    }
    return this.currentTheme;
  },
  
  /**
   * Áp dụng theme hiện tại vào trang
   */
  applyTheme() {
    // Thêm class transition trước khi thay đổi theme
    document.documentElement.classList.add(ThemeSettings.transitionClass);
    
    const mode = this.getCurrentMode();
    
    if (mode === 'dark') {
      document.documentElement.classList.add(ThemeSettings.darkModeClass);
    } else {
      document.documentElement.classList.remove(ThemeSettings.darkModeClass);
    }
    
    // Cập nhật toggle button
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      if (mode === 'dark') {
        toggleBtn.classList.add('dark-active');
      } else {
        toggleBtn.classList.remove('dark-active');
      }
    }
    
    // Xóa class transition sau khi hoàn tất
    setTimeout(() => {
      document.documentElement.classList.remove(ThemeSettings.transitionClass);
    }, ThemeSettings.transitionDuration);
  },
  
  /**
   * Chuyển đổi qua lại giữa light và dark
   */
  toggle() {
    const newTheme = this.getCurrentMode() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
};

// Khởi tạo khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
  themeManager.initialize();
});

// Export themeManager để có thể sử dụng từ bên ngoài
window.themeManager = themeManager;