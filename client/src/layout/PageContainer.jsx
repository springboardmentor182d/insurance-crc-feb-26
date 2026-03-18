useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage");
    if (savedLang) {
        document.documentElement.lang = savedLang;
    }
}, []);