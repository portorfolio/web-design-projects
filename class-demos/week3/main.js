//shorthand for document.addEventListener('load', ()=>{})
window.onload = () =>{
    console.log('script is connected');

    //retrieving button element on page
    let button = document.getElementById('send')

    //adding click event to button to detect when it's been clicked, ()=>{}: no need for function to execute 
    button.addEventListener('click', ()=>{
        //retrieving input text box
        let text = document.getElementById('search')
        //printing that data to console
        console.log(text.value);
        //call function when button has been clicked
        request(text.value);
        //resetting text value to be empty
        text.value = "";
    })
    //call function
    // request() //i only want to call my fetch request when the button has been clicked
}

async function request(inputText){
    //baseurl retrieved from omdbapi
    let baseUrl = "http://www.omdbapi.com/?"

    //apikey=1dac9740
    let params = new URLSearchParams({
        apikey: "9aa8e798",
        s: inputText,
        type: "movie",
    });

    console.log(baseUrl + params)
    let url = baseUrl + params;

    let response = await fetch(url);
    console.log(response)

    let json = await response.json()
    console.log(json)

    let movies = json.Search;
    console.log(movies)

    //1. retrieve where on the webpage movie data should be added
    let container = document.getElementById('container')

    //erases previous data when searching for something new
    container.innerHTML="";

    for(let movie of movies){
        //2. create item to be added
        let m = document.createElement('div')
        m.textContent = movie.Title + " " + movie.Year
        //2.5: add poster element
        let img = document.createElement('img')
        img.src = movie.Poster
        //3. add img to div
        m.appendChild(img)
        //4. add div to container
        container.appendChild(m)
    }
}