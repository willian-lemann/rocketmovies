const setvalue = (id, item) => { return document.getElementById(id).innerHTML = item; };
const set = (id, item) => { return document.getElementById(id).innerHTML += item; };
const setImage = (id, src) => { return document.getElementById(id).src = src; };
const movieName = document.getElementById('searchInput');
let pages = 1;
let lastItem = '';
let lastPage = 0;
let index = 1;
let jsonContent = [];


$(document).ready(function () {
    getSearch();
    M.updateTextFields();
});



document.getElementById('btnDownload').addEventListener('click', () => {
    download(`${movieName.value}.csv`, ConvertToCSV(JSON.stringify(jsonContent)));
});


let message = (message, time, classe) => {
    M.toast({
        html: message,
        classes: classe,
        inDuration: time,
        outDuration: time
    });
}

let validaCampo = (value) => {
    value == '' ? message('Filme não encontrado ou campo vazio', 200, 'rounded') : {}
}
//https://www.imdb.com/title/%7Bimdbid%7D

let loadPage = (id) => {

    jsonContent = [];
    document.getElementById('cards').innerHTML = '';
    axios.get(`http://www.omdbapi.com/?s=${movieName.value}&apikey=27ec0df9&type=movie&page=${id}`)
        .then((res) => {

            let data = res.data.Search;
            jsonContent = data;
            let element = (id, name, poster) => {
                return `<a id="${id}" class="carousel-item" href="#${id}"><h6 class="center white-text">${name}</h6>
                <img class="modal-trigger" href="#infomodal" onclick="loadModal(${id})" onerror="this.src='/assets/warning.svg'" style="width: 300px; height: 370px; border-radius: 10px;"
                 src="${poster}"></a>`;
            }

            data.forEach(item => {

                item.Poster == 'N/A' ? set('cards', `${element(item.imdbID, item.Title, item.Poster)}`) :
                    set('cards', `${element(item.imdbID, item.Title, item.Poster)}`);

            });
            carousel();
        })
        .catch((err) => {
            console.log(`Erro ${err}`);
        });
}

let loadModal = (id) => {

    axios.get(`http://www.omdbapi.com/?i=${id.id}&apikey=27ec0df9&type=movie`)
        .then((res) => {

            let data = res.data;
            let ratings = res.data.Ratings;

            setImage('poster', `${data.Poster}`);
            setvalue('titulo', `${data.Title}`);
            setvalue('enredo', `${data.Plot}`);
            setvalue('diretor', `${data.Director}`);
            setvalue('atores', `${data.Actors}`);
            setvalue('genero', `${data.Genre}`);
            setvalue('anolancamento', `${data.Year}`);
            setvalue('duracao', `${data.Runtime}`);
            setvalue('pais', `${data.Country}`);
            ratings.forEach(item => {
                set('avaliacoes', `${item.Source} ${item.Value}`)
            });

        })
        .catch((err) => {
            console.log(`Erro ${err}`);
        });

    $('#infomodal').modal({
        onCloseEnd: function () {
            setImage('poster', '');
            setvalue('titulo', '');
            setvalue('enredo', '');
            setvalue('diretor', '');
            setvalue('atores', '');
            setvalue('genero', '');
            setvalue('anolancamento', '');
            setvalue('duracao', '');
            setvalue('pais', '');
            setvalue('avaliacoes', '');
        }
    });

}

let carousel = () => {

    $('.carousel').carousel({
        fullWidth: true,
        dist: 100,
        noWrap: false,
        duration: 1000,
        padding: 300
        // onCycleTo: function (incomingElement) {

        //     if (lastPage == 1)
        //         return;

        //     if (incomingElement.id === lastItem) {
        //         document.getElementById('cards').innerHTML = '';
        //         pages++;
        //         message(`Você está na pagina ${pages}`, 200, 'rounded');
        //         Pagination.Start();
        //         axios.get(`http://www.omdbapi.com/?s=${movieName.value}&apikey=27ec0df9&type=movie&page=${pages}`)
        //             .then((res) => {

        //                 let data = res.data.Search;
        //                 let element = (id, name, poster) => {
        //                     return `<a id="${id}" class="carousel-item" href="#${id}"><h6 class="center white-text">${name}</h6>
        //                 <img class="modal-trigger" href="#infomodal imagem" onclick="loadModal(${id})" onerror="this.src='/assets/warning.svg'" style="width: 300px; height: 370px; border-radius: 10px;"
        //                  src="${poster}"></a>`;
        //                 }

        //                 data.forEach(item => {

        //                     item.Poster == 'N/A' ? set('cards', `${element(item.imdbID, item.Title, item.Poster)}`) :
        //                         set('cards', `${element(item.imdbID, item.Title, item.Poster)}`);

        //                 });
        //                 carousel();
        //                 lastItem = data[data.length - 1].imdbID;


        //             })
        //             .catch((err) => {
        //                 console.log(`Erro: ${err}`);
        //             });
        //     }
        // }
    });
}

let getSearch = () => {

    document.getElementById('searchInput').addEventListener('keydown', (e) => {

        document.getElementById('cards').innerHTML = '';
        if (e.keyCode === 8) {
            index = 1;
            pages = 1;
            lastItem = '';
            document.getElementById('pagination').innerHTML = '';
        }

        if (e.keyCode === 13) {

            validaCampo(movieName.value)
            message(`${lastPage} resultados para esta pesquisa`, 200, 'rounded');
            index++;

            axios.get(`http://www.omdbapi.com/?s=${movieName.value}&apikey=27ec0df9&type=movie`)
                .then((res) => {

                    let data = res.data.Search;
                    jsonContent = res.data.Search;
                    lastPage = Math.ceil(parseInt(res.data.totalResults) / 10);

                    let element = (id, name, poster) => {
                        return `<a id="${id}" class="carousel-item" href="#${id}"><h6 class="center white-text">${name}</h6>
                        <img class="modal-trigger responsive-img" href="#infomodal" onclick="loadModal(${id})" onerror="this.src='/assets/warning.svg'" style="width: 300px; height: 370px; border-radius: 10px;"
                         src="${poster}"></a>`;
                    }

                    data.forEach(item => {

                        item.Poster == 'N/A' ? set('cards', `${element(item.imdbID, item.Title, item.Poster)}`) :
                            set('cards', `${element(item.imdbID, item.Title, item.Poster)}`);

                    });

                    lastItem = data[data.length - 1].imdbID;

                    carousel();
                    incre = 1;
                    pages = 1;

                    init();

                })
                .catch((err) => {
                    console.log(`Erro ${err}`);
                });
        }
    });

}

function ConvertToCSV(objArray) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }
    return str;
}

function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


let Pagination = {

    code: '',

    Extend: function () {
        Pagination.size = lastPage;
        Pagination.page = 1;
        Pagination.step = 3;
    },

    // add pages by number (from [s] to [f])
    Add: function (s, f) {
        for (let i = s; i < f; i++) {
            Pagination.code += `<a onclick="loadPage('${i}')">${i}</a>`;
        }
    },

    // add last page with separator
    Last: function () {
        Pagination.code += `<i>. . . .</i><a>${Pagination.size}</a>`;
    },

    // add first page with separator
    First: function () {
        Pagination.code += '<a>1</a><i>. . . .</i>';
    },

    // change page
    Click: function () {
        pages = +this.innerHTML;
        Pagination.Start();
    },

    // previous page
    Prev: function () {
        Pagination.page--;
        if (Pagination.page < 1) {
            Pagination.page = 1;
        }
        Pagination.Start();
    },

    // next page
    Next: function () {
        Pagination.page++;
        if (Pagination.page > Pagination.size) {
            Pagination.page = Pagination.size;
        }
        Pagination.Start();
    },


    // binding pages
    Bind: function () {
        let a = Pagination.e.getElementsByTagName('a');
        for (let i = 0; i < a.length; i++) {
            if (+a[i].innerHTML === pages) a[i].className = 'current';
            a[i].addEventListener('click', Pagination.Click, false);
        }
    },

    // write pagination
    Finish: function () {
        Pagination.e.innerHTML = Pagination.code;
        Pagination.code = '';
        Pagination.Bind();
    },

    // find pagination type
    Start: function () {
        if (Pagination.size < Pagination.step * 2 + 6) {
            Pagination.Add(1, Pagination.size + 1);
        }
        else if (pages < Pagination.step * 2 + 1) {
            Pagination.Add(1, Pagination.step * 2 + 4);
            Pagination.Last();
        }
        else if (pages > Pagination.size - Pagination.step * 2) {
            Pagination.First();
            Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
        }
        else {
            Pagination.First();
            Pagination.Add(pages - Pagination.step, pages + Pagination.step + 1);
            Pagination.Last();
        }
        Pagination.Finish();
    },

    // create skeleton
    Create: function (e) {

        let html = ['<span></span>'];

        e.innerHTML = html.join('');
        Pagination.e = e.getElementsByTagName('span')[0];
    },

    // init
    Init: function (e, data) {
        Pagination.Extend(data);
        Pagination.Create(e);
        Pagination.Start();
    }
};



let init = function () {
    Pagination.Init(document.getElementById('pagination'), {
        size: lastPage,
        page: 1,
        step: 3
    });
};

document.addEventListener('DOMContentLoaded', init, false);



