export function loadImage(url) {
    return new Promise(resolve => {
                var img = new Image();
                img.addEventListener('load', () => {
                    resolve(img);
                });
                img.src = url;
            });

}

export function loadJson(url) {
    return new Promise(resolve => {
        return fetch(url).then(response => {
            setTimeout(resolve, 5000, response.json()); //a loading screen ?
            //resolve(response.json());
        });
    });
}