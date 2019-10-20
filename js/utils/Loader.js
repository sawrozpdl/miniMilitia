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
            setTimeout(resolve, 1000, response.json()); 
            //resolve(response.json());
        });
    });
}

export function loadAudio(url) {
    return new Promise (resolve => {
        var audio = new Audio();
        audio.addEventListener('load', () => {
            resolve(audio);
        });
        audio.src = url;
    });
}

export function mediaLoader(jsonUrl) {
    // loadJson(jsonUrl).then(response => {
    //     var images = [];
    //     var jsons = [];
    //     var audios = [];
    //     const json = response.json();
    //     for (key in json) {
    //         switch (key) {
    //             case 'image':
    //                 for (image in json[key].images)

    //                 loaderList.push(loadImage());
    //                 return;
    //             case 'json':
    //                 return;
    //             case 'audio':
    //                 return;
    //         }
    //     }
    // });
}