export function loadImage(url) {
    return new Promise(resolve => {
                var img = new Image();
                img.addEventListener('load', () => {
                    resolve(img);
                });
                img.src = url;
            });
}

export function loadAudio(url) {
    return new Promise (resolve => {
        var audio = new Audio(url);
        audio.addEventListener('loadeddata', () => {
            setTimeout(resolve, 2000, audio);
            //resolve(audio);
        });
    });
}

export function loadJson(url) {
    return new Promise(resolve => {
        return fetch(url).then(response => {
            resolve(response.json());
        });
    });
}

export function loadMedia(jsonUrl) {
    return new Promise(resolve => {
        var c = 0;
        var promises = 0;
        loadJson(jsonUrl).then(json => {
            var images = {};
            var audios = {};
            promises = json['images'].length + json['audios'].length;
            json['images'].forEach((url) => {
                loadImage(url).then(img => {
                    images[getKey(img.src)] = img;
                    c++;
                    if (c === promises)  
                        resolve({images : images, audios : audios});
                });
            });
            json['audios'].forEach((url) => {
                loadAudio(url).then(audio => {
                    audios[getKey(audio.src)] = audio;
                    c++;
                    if (c === promises)  
                        resolve({images : images, audios : audios});
                });
            });   
        });
    });
}

function getKey(url) {
    let temp = url.split("/");
    return temp[temp.length - 1].split('.')[0];
} 