
export function setGallery() {
    const pictures = [
        { src: "resources/img/gallery/beard-shaving.jpg", alt: "Imágen en la que le afeitan la barba a un hombre" },
        { src: "resources/img/gallery/combing-hair.png", alt: "Imágen de un hombre peinándose" },
        { src: "resources/img/gallery/men-haircut.jpg", alt: "Imágen en la que le realizan un corte de cabello a un hombre" },
        { src: "resources/img/gallery/men.jpg", alt: "Imágen en la que le esta dando el corte a un hombre" },
        { src: "resources/img/gallery/kid-haircut.jpg", alt: "Imágen en la que se le realiza un corte de cabello a un niño" },
        { src: "resources/img/gallery/styling-hairdryer.png", alt: "Imágen en la que se esta peinando con un secador de pelo a un hombre" },
    ];

    const gallery = document.getElementById('gallery-content');
    pictures.forEach(img => {
        const imgTag = document.createElement('img');
        imgTag.src = img.src;
        imgTag.alt = img.alt;
        gallery.appendChild(imgTag);
    })
}
            