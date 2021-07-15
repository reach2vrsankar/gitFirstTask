async function search_list(){
    document.querySelector('#serach_field').style.display='';
    const token = await getToken();
    try {
      const result = await fetch(
        `https://api.spotify.com/v1/browse/categories?limit=50`,        
        {
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        }
      );
        const data = await result.json();
        // console.log(data); 
        const category = data.categories.items
        document.getElementById("home").innerHTML='';
        var search_container = document.getElementById("search");
        document.getElementById("library").innerHTML='';
        document.getElementById("songs_list").innerHTML='';
        document.getElementById("songs_list_track").style.display='none';
        let output = ""
        category.forEach((item) => {
             output += `
            <div class="col-3 mt-5 mb-5 text-center" >
                <img src="${item.icons[0].url}" id="${item.id}" alt="${item.id}" onclick="category(this.id)" width="150px" style="border-radius:10px;">
            </div>
            `
            search_container.innerHTML=output;
        })      
   
    } catch (error) {
      console.log(error);
    }
}

async function home_list(){
    document.querySelector('#serach_field').style.display='none';
    const token = await getToken();
    try {
      const result = await fetch(
        `https://api.spotify.com/v1/browse/categories?limit=50`,        
        {
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        }
      );
        const data = await result.json();
        const category = data.categories.items
        var home_container = document.getElementById("home")
        document.getElementById("search").innerHTML='';;
        document.getElementById("library").innerHTML='';
        document.getElementById("songs_list").innerHTML='';   
        document.getElementById("songs_list_track").style.display='none';   
    
    } catch (error) {
      console.log(error);
    }
}

async function library_list(){
    document.querySelector('#serach_field').style.display='none';
    const token = await getToken();
    try {
      const result = await fetch(
        `https://api.spotify.com/v1/browse/categories?limit=50`,        
        {
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        }
      );
        const data = await result.json();
        const category = data.categories.items
        document.getElementById("home").innerHTML='';
        document.getElementById("search").innerHTML='';
        var library_container = document.getElementById("library");
        document.getElementById("songs_list").innerHTML='';
        document.getElementById("songs_list_track").style.display='none';
    
    } catch (error) {
      console.log(error);
    }
}

async function getToken(){
    try{
        const clientId = '3820dc39516a420e98bb54fdb483bbed';
        const clientSecret = '6cb3960862f84aa8aff63e9226ff1f17';
        const result = await fetch("https://accounts.spotify.com/api/token",{
            method: "POST",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + btoa(clientId + ":" + clientSecret)
            },
            body: "grant_type=client_credentials",
        })
        const data = await result.json();
        const accessToken = data.access_token;
        return accessToken;
    }catch(err){
        console.log(err);
    }
}

async function category(category_id){
  document.getElementById("home").innerHTML='';
  document.getElementById("search").innerHTML='';
  document.getElementById("library").innerHTML='';
  var songs_list_container = document.getElementById("songs_list");
  document.getElementById("songs_list_track").style.display='none';
  const token = await getToken();
  try{
    const result = await fetch(
        `https://api.spotify.com/v1/browse/categories/${category_id}/playlists`,         
        {
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        }
      );
      const data = await result.json();
      // console.log(data);    
      let output ='';
      data.playlists.items.forEach(item=>{
        output += `
        <div class="col-3 mt-3 mb-3">
        <div class=" card" style="width: 10rem;height:15rem">
            <img id="${item.id}" src="${item.images[0].url}" onclick="getTrack(this.id)" class="card-img-top m-1" alt="image" style="width:150px;">
            <p class="font-weight-bold song_icon">&#9835;</p> 
            <div class="card-body">
              <p class="card-title font-weight-bold">${item.name}</p>
            </div>
          </div>
    </div>
        `  
        songs_list_container.innerHTML=output;
      })
         
  }catch(err){
      console.log(err)
  }
}

async function getTrack(playlist_id){
  document.getElementById("home").innerHTML='';
  document.getElementById("search").innerHTML='';
  document.getElementById("library").innerHTML='';
  document.getElementById("songs_list").innerHTML='';
  document.getElementById("songs_list_track").style.display='block';
  var track_list = document.getElementById("track_list");
  let output ='';
  const token = await getToken();
  try{
    const result = await fetch(
        `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,         
        {
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        }
      );
      const data = await result.json(); 
      // console.log(data)  
      let count=1;
      data.items.forEach(item=>{       
        let singers = "";
        item.track.artists.forEach(singer=>{
          singers += singer.name+",";
        })
       
        output += `
        <tr id="${item.track.id}" onclick="getSingleSong(this.id)">
          <th scope="row" >${count++}</th>
          <td>
              <img src="${item.track.album.images[2].url}" alt="image" width="40px;">
              <span>
              &ensp;${singers}
              </span>
          </td>
          <td>${item.track.name}</td>
          <td>${item.track.album.release_date}</td>
          <td>
          ${(parseInt(item.track.duration_ms)/60000).toFixed(2).replace(".",":")}&nbsp;
          <span  class="text-light" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          &nbsp;...
        </span>
        <div class="dropdown-menu">
          <button class="dropdown-item" type="button">Follow(Like)</button>
          <button class="dropdown-item" type="button">UnFollow(UnLike)</button>
          <button class="dropdown-item" type="button">Remove From Playlist</button>
          <button name="${item.track.id}" class="dropdown-item" type="button" onclick="addToPlaylist(this.name)">Add To Playlist</button>
          </div>

        </td>
        </tr>
        `
        track_list.innerHTML = output;
      }) 
     
          
  }catch(err){
      console.log(err)
  }
}

async function getSingleSong(song_id){
  document.getElementById("song_controls").style.display='block';
  const token = await getToken();
  try{
    const result = await fetch(
      `https://api.spotify.com/v1/tracks/${song_id}`,         
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );
    const data = await result.json(); 
    // console.log(data);
    var arr =[]
    arr.push(data);
    var song_img_list = document.getElementById("song_image");
    let output ="";
    arr.forEach(item=>{       
      let singers = "";
      item.artists.forEach(singer=>{
        singers += singer.name+",";
      })
     
      output = `
      <div class="row">
        <div class="col-3">
            <img src="${item.album.images[2].url}" alt="image" width="60px;">
        </div>
        <div class="col-7 text-light">
            <div class="font-weight-bold">${item.name}</div>
            <div>${singers}</div>
        </div>
        <div class="col-2 text-light">
            <div><i class="fa fa-heart" id="heart" style="color:white" onclick="Like(this.id)"></i></div>
        </div>
    </div>
      `
      song_img_list.innerHTML = output;
    }) 
  }catch(err){
    console.log(err);
  }
}
function Like(id){
  var heart = document.getElementById(id);
  if(heart.style.color=="white"){
    heart.style.color="red"
  }else{
    heart.style.color="white"
  }
}

async function createPlaylist(){
  const token = await getToken();
  try{
    const result = await fetch(
      `https://api.spotify.com/v1/users/khasim/playlists`,         
      {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
      }
    );
    const data = await result.json(); 
    // console.log(data);
  }catch(err){
    console.log(err);
  }
}

async function addToPlaylist(id){
  alert("This Song is Added to playlist");
}
// async function addToPlaylist(playlist_id){
//   const token = await getToken();
//   try{
//     const result = await fetch(
//       `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,         
//       {
//         method: "POST",
//         headers: { Authorization: "Bearer " + token },
//       }
//     );
//     const data = await result.json(); 
//     console.log(data);
//   }catch(err){
//     console.log(err);
//   }
// }
