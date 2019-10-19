export function loadImage(url) {
    return new Promise(resolve => {
                var img = new Image();
                img.addEventListener('load', () => {
                    //setTimeout(resolve, 3000, img); //a loading screen ?
                    resolve(img);
                });
                img.src = url;
            });

}

export function loadJson(url) {
    return new Promise(resolve => {
        return fetch(url).then(response => {
            resolve(response.json());
        });
    });
}