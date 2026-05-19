(function() {
  try {
    var theme = localStorage.getItem('theme');
    var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
    if (theme === 'dark' || (!theme && supportDarkMode)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
