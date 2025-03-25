let movieNameRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");

const translateText = async (text) => {
    try {
        let url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt-br`;
        let response = await fetch(url);
        let data = await response.json();
        
        if (data.responseData && data.responseData.translatedText) {
            return data.responseData.translatedText;
        } else {
            return text; // Se a tradução falhar, mantém o texto original
        }
    } catch (error) {
        console.error("Erro na tradução:", error);
        return text; 
    }
};

let getMovie = () => {
    let movieName = movieNameRef.value;
    let url = `http://www.omdbapi.com/?t=${movieName}&apikey=${key}`;

    if (movieName.length <= 0) {
        result.innerHTML = `<h3 class="msg">Por favor, insira um nome de filme</h3>`;
    } else {
        fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.Response == "True") {
                    let genres = data.Genre.split(", "); // Separa os gêneros para traduzir cada um
                    
                    // Traduz a sinopse e os gêneros
                    Promise.all([translateText(data.Plot), ...genres.map(translateText)])
                        .then(([translatedPlot, ...translatedGenres]) => {
                            result.innerHTML = `
                                <div class="info">
                                    <img src=${data.Poster} class="poster">
                                    <div>
                                        <h2>${data.Title}</h2>
                                        <div class="rating">
                                            <img src="star-icon.svg">
                                            <h4>${data.imdbRating}</h4>
                                        </div>
                                        <div class="details">
                                            <span>${data.Rated}</span>
                                            <span>${data.Year}</span>
                                            <span>${data.Runtime}</span>
                                        </div>
                                        <div class="genre">
                                            <div>${translatedGenres.join("</div><div>")}</div>
                                        </div>
                                    </div>
                                </div>
                                <h3>Sinopse:</h3>
                                <p>${translatedPlot}</p>
                                <h3>Elenco:</h3>
                                <p>${data.Actors}</p>
                            `;
                        });
                } else {
                    result.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
                }
            })
            .catch(() => {
                result.innerHTML = `<h3 class="msg">Ocorreu um erro</h3>`;
            });
    }
};

searchBtn.addEventListener("click", getMovie);
window.addEventListener("load", getMovie);
