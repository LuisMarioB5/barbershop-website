const phones = document.querySelectorAll(".phone");

phones.forEach(phone =>{
    window.intlTelInput(phone, {
        initialCountry: "do",
        nationalMode: true,
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@23.3.2/build/js/utils.js"
    });
});
