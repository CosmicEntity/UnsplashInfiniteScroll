const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API
const count = 30;
const apiKey = process.env.API_KEY;
const apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}`;

//Helper Function to set Attributes on Dom Elements
function setAttributes(element, attributes){
    for( const key in attributes){
        element.setAttribute(key,attributes[key]);
    }
}
// Check if all Images are loaded
function imageLoaded(){
    imagesLoaded++;
    if(imagesLoaded === totalImages){
        ready = true;
        loader.hidden = true;
    }
}
// Create Elements for Links & Photos -> Add to DOM
function displayPhotos(){
    imagesLoaded=0;
    totalImages = photosArray.length;
    // Create Element for each Object in photosArray
    photosArray.forEach((photo)=>{
        // Create <a></a> to Link to Unsplash
        const item = document.createElement('a');
        
        setAttributes(item,{
            href: photo.links.html,
            target: "_blank"
        });
        // Create <img> for Image
        const img = document.createElement('img');
        
        setAttributes(img,{
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        })

        // Check when each Image is finished loading
        img.addEventListener("load", imageLoaded);

        // Put <img> inside <a></a> -> Put both inside Image Container Element
        item.appendChild(img);
        imageContainer.appendChild(item);
    })
}

// Get photos from Unsplash API
async function getPhotos(){
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();
    } catch (error) {
        // Catch Errors Here
    }
}

// Check to see is scroll near bottom of page -> Load more Photos
window.addEventListener("scroll", ()=>{
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready){
        ready=false;
        getPhotos();
    }
})

// On Load
getPhotos();