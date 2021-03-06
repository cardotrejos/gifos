let darkMode = localStorage.getItem('darkMode');
const darkModeToggle = document.querySelector('.dark_mode');

const enableDarkMode = () => {
    document.body.classList.add('dark');
    document.getElementById("dark_ligth").innerHTML = "Modo Diurno";

    localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
    document.body.classList.remove('dark');
    document.getElementById("dark_ligth").innerHTML = "Modo Nocturno";

    localStorage.setItem('darkMode', 'disable');
}

const verifyTheme = (() => {
    darkMode = localStorage.getItem('darkMode');
    if (!darkMode) {
        localStorage.setItem('darkMode', 'disable');
    }
    if (darkMode == 'enabled') {
        enableDarkMode();
    }
    else {
        disableDarkMode();
    }
})

const changeTheme = (() => {
    darkModeToggle.addEventListener('click', () => {
        darkMode = localStorage.getItem('darkMode');
        if (darkMode !== 'enabled') {
            enableDarkMode();
        }
        else {
            disableDarkMode();
        }
    });

})

export { changeTheme, verifyTheme };