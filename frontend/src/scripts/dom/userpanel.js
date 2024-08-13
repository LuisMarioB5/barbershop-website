export function setUserPage() {
    const sectionLinks = document.querySelectorAll('nav ul li a');
    console.log(sectionLinks);

    sectionLinks.forEach(a => {
        a.addEventListener('click', () => {
            sectionLinks.forEach(a => a.classList.remove('active'));

            a.classList.add('active');
        });
    });
}