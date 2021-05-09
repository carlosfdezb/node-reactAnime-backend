const cheerio = require('cheerio');
const Crawler = require("crawler");
const cheerioTableparser = require('cheerio-tableparser');
const cloudscraper = require('cloudscraper');
const decodeURL = require('urldecode');
const axios = require('axios');
const {MergeRecursive , urlify , decodeZippyURL , imageUrlToBase64} = require('../utils/index');
const {
  BASE_URL         , SEARCH_URL             , BROWSE_URL , 
  ANIME_VIDEO_URL  , BASE_EPISODE_IMG_URL   , 
  BASE_JIKA_URL    , BASE_MYANIME_LIST_URL, BASE_NEWS, MAL_ID , TMO__URL
} = require('./urls');

const malScraper = require('mal-scraper');
const tioanime = require('tioanime');


const Test = async() => {
  promises = [];
  await tioanime.latestEpisodesAdded().then((res) => promises.push(res))

  return Promise.all(promises);
}


//FIXED

const latestAnimeAdded = async() =>{
  const res = await cloudscraper(`https://tioanime.com/` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];
  $('#tioanime > div > section:nth-child(3) > ul > li').each((index , element) =>{
    const $element = $(element);
    const id = $element.find('article a').attr('href').replace('/anime','anime');
    const title = $element.find('article a h3.title').text();
    const poster = 'https://tioanime.com'+$element.find('article a div.thumb figure img').attr('src');
    const type = $element.find('div.anime__item__text ul li.anime').text().replace('\n','');
    promises.push({
      id: id || null,
      title: title || null,
      poster: poster || null,
      type: type || null,
    })
  })
  return Promise.all(promises);
};

const latestEpisodesAdded = async() =>{
  const res = await cloudscraper(`https://tioanime.com/` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];
  $('#tioanime > div > section:nth-child(1) > ul > li').each((index , element) =>{
    const $element = $(element);

    const master = $element.find('article a').attr('href').split('/')[2].split('-');
    const masterT = $element.find('article a h3.title').text().split(' ');
    masterT.pop();
    const episode = master.pop();
    const id = master.join('-');
    const title = masterT.join(' ');
    const poster = 'https://tioanime.com'+$element.find('article a div.thumb figure img').attr('src');
    
    promises.push({
      id: id || null,
      title: title || null,
      poster: poster || null,
      episode: episode || null,
    })
  })
  return await Promise.all(promises);
};

const getAnimeServers = async(id, episode) =>{
  const res = await cloudscraper(`https://tioanime.com/ver/${id}-${episode}` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body , {xmlMode: false});
  const promises = [];
  var textNode = $('body > script')
    .map((i, x) => x.children[0])                              
    .filter((i, x) => x && x.data.match(/var videos = /)).get(0);
  const aux =  JSON.parse(textNode.data.match(/var videos = (\[.*?\;)/)[1].replace(';',''));
  promises.push(aux);
  return await Promise.all(promises.flat(1));
};

const downloadEpisode = async(id, episode) =>{
  const res = await cloudscraper(`https://tioanime.com/ver/${id}-${episode}` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];
  $('#downloads > div > div > div.modal-body > div > table > tbody > tr').each((index , element) =>{
    const $element = $(element);
    const server = $element.find('td:nth-child(2)').text();
    const url = $element.find('td.text-center > a').attr('href');

    promises.push({
      server: server || null,
      url: url || null,
    })
  })
  return await Promise.all(promises.flat(1));
};

const getByRelease = async() =>{
  let i=1;
  const promises = [];
  for(i=1; i<5; i++){
    const res = await cloudscraper(`https://tioanime.com/directorio?year=1950%2C2021&status=1&sort=recent&p=${i}` , {method: 'GET'});
    const body = await res;
    const $ = cheerio.load(body);
    $('#tioanime > div > div.row.justify-content-between.filters-cont > main > ul > li').each((index , element) =>{
      const $element = $(element);
      const id = $element.find('article a').attr('href').replace('/anime', 'anime');
      const title = $element.find('article a h3.title').text();
      const poster = 'https://tioanime.com'+$element.find('article a div.thumb figure img').attr('src');
      const rating = $element.find('div.Description p span.Vts').text();

      promises.push({
        id: id || null,
        title: title || null,
        poster: poster || null,
        rating: rating || null,
      })
    })
  }
  return Promise.all(promises);
};

const getAnimeInfo = async(id) =>{
  const res = await cloudscraper(`https://tioanime.com/anime/${id}` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];

  const title = $('#tioanime > article > div > div > aside.col.col-sm-8.col-lg-9.col-xl-10 > h1.title').text();
  const poster = 'https://tioanime.com'+$('#tioanime > article > div > div > aside.col.col-sm-4.col-lg-3.col-xl-2 > div > figure > img').attr('src');
  const banner = 'https://tioanime.com'+$('#tioanime > article > figure > img').attr('src');
  const synopsis = $('#tioanime > article > div > div > aside.col.col-sm-8.col-lg-9.col-xl-10 > p.sinopsis').text().replace(/\n/g,'');
  const debut = $('#tioanime > article > div > div > aside.col.col-sm-4.col-lg-3.col-xl-2 > div > a').text();
  const type = $('#tioanime > article > div > div > aside.col.col-sm-8.col-lg-9.col-xl-10 > div.meta > span.anime-type-peli').text();
  const genres = [];

  $('#tioanime > article > div > div > aside.col.col-sm-8.col-lg-9.col-xl-10 > p.genres > span').each((index, element) => {
    const $element = $(element);
    const genre = $element.find('a').text()
    genres.push(genre);
  });

  let nextEpisode;
  $('body > script:nth-child(21)').map((i, x) => x.children[0])
    .filter((i, x) => {
      const info =  x && JSON.parse(x.data.match(/var anime_info = (\[.*?\])/)[1]);
      nextEpisode = info[3];
  });

  let malId;
  $('body > script:nth-child(20)').map((i, x) => x.children[0])
    .filter((i, x) => {
      const info =  x && x.data.match(/axios.get(\(.*?\))/)[1];
      malId = info.split('/')[5].replace("')",'');
  });

  promises.push(getEpisodes(id).then(episodes => ({
    id: id,
    malId: malId || null,
    title: title || null,
    poster: poster || null,
    banner: banner || null,
    synopsis: synopsis || null,
    debut: debut || null,
    type: type === 'TV' ? 'Anime' : type || null,
    genres: genres || null,
    nextEpisode: nextEpisode || null,
    episodes: episodes,
  })));

  return Promise.all(promises);
};


const getEpisodes = async(id) =>{
  const res = await cloudscraper(`https://tioanime.com/anime/${id}` , {method: 'GET'});
  const body = await res;
  const promises = [];
  const $ = cheerio.load(body , {xmlMode: false});
  $('body > script:nth-child(21)').map((i, x) => x.children[0])
    .filter((i, x) => {
      const info =  x && JSON.parse(x.data.match(/var anime_info = (\[.*?\])/)[1]);
      const episodes =  x && JSON.parse(x.data.match(/var episodes = (\[.*?\])/)[1]);
      const episodes_detail =  x && JSON.parse(x.data.match(/var episodes_details = (\[.*?\])/)[1]);
      const id = info[1];
      const poster = 'https://tioanime.com/uploads/thumbs/'+info[0]+'.jpg';

      episodes.map((index, i) => {
        promises.push({
          id: id || null,
          poster: poster || null,
          episode: index || null,
          date: episodes_detail[i] || null,
      })
    })
  });
  return await Promise.all(promises);
  
};

const search = async(query) =>{
  const res = await cloudscraper(`https://tioanime.com/directorio?q=${query}` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];

  $('#tioanime > div > div.row.justify-content-between.filters-cont > main > ul > li').each((index , element) =>{
    const $element = $(element);
    const id = $element.find('article a').attr('href').replace('/anime','anime');
    const title = $element.find('article a h3.title').text();
    const poster = 'https://tioanime.com'+$element.find('article a div.thumb figure img').attr('src');
   
    promises.push({
      id: id || null,
      title: title || null,
      malid: id || null,
      poster: poster || null,
      banner: null,
      synopsis: null,
      type: null,
      rating: null,
    })
  })
  return Promise.all(promises);
};

const getByCategorie = async(genre, page) =>{
  const promises = [];
  console.log(genre)
  const res = await cloudscraper(`https://tioanime.com/directorio?genero%5B%5D=${genre}&year=1950%2C2021&status=2&sort=recent&p=${page}` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  $('#tioanime > div > div.row.justify-content-between.filters-cont > main > ul > li').each((index , element) =>{
    const $element = $(element);
    const id = $element.find('article a').attr('href').replace('/anime','anime');
    const title = $element.find('article a h3.title').text();
    const poster = 'https://tioanime.com'+$element.find('article a div.thumb figure img').attr('src');
   
    promises.push({
      id: id || null,
      title: title || null,
      malid: id || null,
      poster: poster || null,
      banner: null,
      synopsis: null,
      type: null,
      rating: null,
    })
  })
  
  return Promise.all(promises);
};

const searchRelated = async(query) =>{
  const res = await cloudscraper(`https://tioanime.com/anime/${query}` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];
  
  $('#tioanime > div > div > aside.sidebar.col-12 > div > section > ul > li').each((index , element) =>{
    const $element = $(element);
    const id = $element.find('article div.thumb a').attr('href').replace('/anime','anime');
    const title = $element.find('article div.media-body a h3.title').text();
    let poster = 'https://tioanime.com'+$element.find('article div.thumb a figure img').attr('src');

    promises.push({
      id: id || null,
      title: title || null,
      poster: poster || null,
    })
  })
  return Promise.all(promises);
};


//RUTAS ANIME



const TopAiring = async() =>{
  const res = await cloudscraper(`https://myanimelist.net/topanime.php?type=airing` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];

  let count = 0;

  $('#content > div.pb12 > table > tbody > tr').each((index , element) =>{
    const $element = $(element);
    if (index === 0) return true;
    if (count > 24) return true;
    if($element.find('td.title div.detail div.information').text().split('\n')[1].includes('ONA')) return true;

    const title = $element.find('td.title div.detail h3').text();
    let part1 = $element.find('td.title a img').attr('data-src').split('/')[7];
    let part2 = $element.find('td.title a img').attr('data-src').split('/')[8];
    const poster = 'https://cdn.myanimelist.net/images/anime/' + part1 + '/' + part2.split('.')[0] + '.jpg';

    count++
    
    promises.push({
      number: count || null,
      title: title || null,
      poster: poster || null,
    })
  })
  return Promise.all(promises);
};

const TopFuture = async() =>{
  const res = await cloudscraper(`https://myanimelist.net/topanime.php?type=upcoming` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];

  $('#content > div.pb12 > table > tbody > tr').each((index , element) =>{
    if (index === 0) return true;
    if (index > 25) return true;

    const $element = $(element);
    const number = $element.find('td.rank span').text();
    const title = $element.find('td.title div.detail h3').text();
    let part1 = $element.find('td.title a img').attr('data-src').split('/')[7];
    let part2 = $element.find('td.title a img').attr('data-src').split('/')[8];
    const poster = 'https://cdn.myanimelist.net/images/anime/' + part1 + '/' + part2.split('.')[0] + '.jpg';
    

    promises.push({
      number: number || null,
      title: title || null,
      poster: poster || null,
    })
  })
  return Promise.all(promises);
};


const TopAllTime = async() =>{
  const res = await cloudscraper(`https://myanimelist.net/topanime.php?type=bypopularity` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];

  $('#content > div.pb12 > table > tbody > tr').each((index , element) =>{
    if (index === 0) return true;
    if (index > 25) return true;

    const $element = $(element);
    const number = $element.find('td.rank span').text();
    const title = $element.find('td.title div.detail h3').text();
    let part1 = $element.find('td.title a img').attr('data-src').split('/')[7];
    let part2 = $element.find('td.title a img').attr('data-src').split('/')[8];
    const poster = 'https://cdn.myanimelist.net/images/anime/' + part1 + '/' + part2.split('.')[0] + '.jpg'; 
    const ranking = $element.find('td.score span').text();
    

    promises.push({
      number: number || null,
      title: title || null,
      poster: poster || null,
      ranking: ranking || null,
    })
  })
  return Promise.all(promises);
};






const getMalId = async(title) => {
  const animeDetails = `${MAL_ID}${title}`;
  const data = await cloudscraper.get(animeDetails);
  const body = Array(JSON.parse(data));
  const promises = [];
  
  body.map(doc =>{
    doc.categories.map((cat) => {
      cat.items.map((it) => {
        promises.push({
          malId: it.id,
        });
      })
    })
    
  });
  return Promise.all(promises);
  
}

const getAnimeNews = async(query) =>{
  const res = await cloudscraper(`${BASE_NEWS}` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];

  $('div.container div.main article').each((index , element) =>{
    const $element = $(element);
    const link = $element.find('h2.Title a').attr('href');
    const image = $element.find('a img').attr('src');
    const title = $element.find('h2.Title a').text();
    const date = $element.find('p.meta span').text().split('\n')[0];
    const description = $element.find('p').text().split('\n')[5];

    promises.push({
      image: image || null,
      link: link || null,
      title: title || null,
      date: date || null,
      description: description || null,
    })
  })
  return Promise.all(promises);
};




const animeImages = async(title) => {
  const res = await cloudscraper(`${BASE_JIKA_URL}${title}` , {method: 'GET'});
  const matchAnime = JSON.parse(res).results;
  const malId = matchAnime[0].mal_id;
  const promises = [];
 
  return malId;
  
}

const animeExtraInfo = async(title) =>{
  const res = await cloudscraper(`${BASE_JIKA_URL}${title}` , {method: 'GET'});
  const matchAnime = JSON.parse(res).results;
  const malId = matchAnime[0].mal_id;

  if(typeof matchAnime[0].mal_id === 'undefined') return null;

  const animeDetails = `https://api.jikan.moe/v3/anime/${malId}`;
  const data = await cloudscraper.get(animeDetails);
  const body = Array(JSON.parse(data));
  const promises = [];
  
  body.map(doc =>{
    promises.push({
      titleJapanese: doc.title_japanese,
      source: doc.source,
      totalEpisodes: doc.episodes,
      status: doc.status,
      aired:{
        from: doc.aired.from,
        to: doc.aired.to,
        string: doc.aired.string.split('to')[0]  
      },
      duration: doc.duration,
      rank: doc.rank,
      popularity: doc.popularity,
      members: doc.members,
      favorites: doc.favorites,
      premiered: doc.premiered,
      broadcast: doc.broadcast,
      producers:{
        names: doc.producers.map(x => x.name)
      },
      licensors:{
        names: doc.licensors.map(x => x.name)
      },
      studios:{
        names: doc.studios.map(x => x.name)
      },
      openingThemes: doc.opening_themes,
      endingThemes: doc.ending_themes
    });
  });
  return Promise.all(promises);
};

const animeExtraInfoLite = async(title) =>{
  const res = await cloudscraper(`${BASE_JIKA_URL}${title}` , {method: 'GET'});
  const matchAnime = JSON.parse(res).results;
  const malId = matchAnime[0].mal_id;

  if(typeof matchAnime[0].mal_id === 'undefined') return null;

  const animeDetails = `https://api.jikan.moe/v3/anime/${malId}`;
  const data = await cloudscraper.get(animeDetails);
  const body = Array(JSON.parse(data));
  const promises = [];
  
  body.map(doc =>{
    promises.push({
      titleJapanese: doc.title_japanese,
      source: doc.source,
      totalEpisodes: doc.episodes,
      aired:{
        string: doc.aired.string.split('to')[0]  
      }
    });
  });
  return Promise.all(promises);
};


const downloadLinksByEpsId = async(id) =>{
  const res = await cloudscraper(`${ANIME_VIDEO_URL}${id}` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  cheerioTableparser($);
  let tempServerNames = $('table.RTbl').parsetable(true , true , true)[0];
  let serverNames = tempServerNames.filter(x => x !== 'SERVIDOR');
  let urls = [];
  
  try{
    const table = $('table.RTbl').html();
    const data = await urlify(table).then(res => { return res; });
    const tempUrls = [];  
    data.map(baseUrl =>{
      let url = baseUrl.split('"')[0]; 
      tempUrls.push(url)
    });
  
    const urlDecoded = [];
    tempUrls.map(url =>{
      let urlFixed = decodeURL(url).toString().split('?s=')[1]
      urlDecoded.push(urlFixed)
    });

    Array.from({length: tempUrls.length} , (v , k) =>{
      urls.push({
        server: serverNames[k],
        url: urlDecoded[k],
      });
    });

    const zippyshareURL = urls.filter(doc => doc.server == 'Zippyshare')[0].url || null;
    const zippyMP4 = await decodeZippyURL(zippyshareURL);

    for(var key in urls){
      if(urls.hasOwnProperty(key)){
        if(urls[key].server == 'Zippyshare'){
          urls[key].url = zippyMP4
        }
      }
   }

  }catch(err){
    console.log(err);
  }

  return Promise.all(urls);
};

const getAnimeChapterTitlesHelper = async(title) =>{
  const res = await cloudscraper(`${BASE_JIKA_URL}${title}` , {method: 'GET'});
  const matchAnime = JSON.parse(res).results.filter(x => x.title === title);
  const malId = matchAnime[0].mal_id;

  if(typeof matchAnime[0].mal_id === 'undefined') return null;

  const jikanEpisodesURL = `https://api.jikan.moe/v3/anime/${malId}/episodes`;
  const data = await cloudscraper.get(jikanEpisodesURL);
  const body = JSON.parse(data).episodes;
  const promises = [];

  body.map(doc =>{
    let date = doc.aired.substring(0 , doc.aired.lastIndexOf('T'));
    promises.push({
      episode: doc.episode_id,
      title: doc.title,
      date: date
    });
  });

  return Promise.all(promises);
};

const getAnimeVideoPromo = async(title) =>{
  const res = await cloudscraper(`${BASE_JIKA_URL}${title}` , {method: 'GET'});
  const matchAnime = JSON.parse(res).results.filter(x => x.title === title);
  const malId = matchAnime[0].mal_id;

  if(typeof matchAnime[0].mal_id === 'undefined') return null;

  const jikanCharactersURL = `https://api.jikan.moe/v3/anime/${malId}/videos`;
  const data = await cloudscraper.get(jikanCharactersURL);
  const body = JSON.parse(data).promo;
  const promises = [];
  
  body.map(doc =>{
    promises.push({
      title: doc.title,
      previewImage: doc.image_url,
      videoURL: doc.video_url
    });
  });

  return Promise.all(promises);
};

const getAnimeCharacters = async(title) =>{
  const res = await cloudscraper(`${BASE_JIKA_URL}${title}` , {method: 'GET'});
  const matchAnime = JSON.parse(res).results;
  const malId = matchAnime[0].mal_id;

  if(typeof matchAnime[0].mal_id === 'undefined') return null;

  const jikanCharactersURL = `https://api.jikan.moe/v3/anime/${malId}/characters_staff`;
  const data = await cloudscraper.get(jikanCharactersURL);
  let body = JSON.parse(data).characters;
  if(typeof body === 'undefined') return null;

  const charactersId = body.map(doc =>{
    return doc.mal_id
  })
  const charactersNames = body.map(doc => {
    return doc.name;
  });
  const charactersImages = body.map(doc =>{
    return doc.image_url;
  });
  const charactersRoles = body.map(doc =>{
    return doc.role
  });

  let characters = [];
  Array.from({length: charactersNames.length} , (v , k) =>{
    const id = charactersId[k];
    let name = charactersNames[k];
    let characterImg = charactersImages[k];
    let role = charactersRoles[k];
    characters.push({
      character:{
        id: id,
        name: name,
        image: characterImg,
        role: role
      }
    });
  });
  
  return Promise.all(characters);
};


const animeByState = async(state , order , page ) => {
  const res = await cloudscraper(`${BROWSE_URL}type%5B%5D=tv&status%5B%5D=${state}&order=${order}&page=${page}` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];

  $('div.Container ul.ListAnimes li article').each((index , element) =>{
    const $element = $(element);
    const id = $element.find('div.Description a.Button').attr('href').slice(1);
    const title = $element.find('a h3').text();
    const poster = $element.find('a div.Image figure img').attr('src');
    const banner = poster.replace('covers' , 'banners').trim();
    const type = $element.find('div.Description p span.Type').text();
    const synopsis = $element.find('div.Description p').eq(1).text().trim();
    const rating = $element.find('div.Description p span.Vts').text();
    const debut = $element.find('a span.Estreno').text().toLowerCase();
    promises.push(animeEpisodesHandler(id).then(async extra => ({
      id: id || null,
      title: title || null,
      //id: id || null,
      poster: poster || null,
      banner: banner || null,
      synopsis: synopsis || null,
      type: type || null,
      rating: rating || null,
    })))
  })
  return Promise.all(promises);
};

const tv = async(order , page) => {
  const res = await cloudscraper(`${BROWSE_URL}type%5B%5D=tv&order=${order}&page=${page}` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];

  $('div.Container ul.ListAnimes li article').each((index , element) =>{
    const $element = $(element);
    const id = $element.find('div.Description a.Button').attr('href').slice(1);
    const title = $element.find('a h3').text();
    const poster = $element.find('a div.Image figure img').attr('src');
    const banner = poster.replace('covers' , 'banners').trim();
    const type = $element.find('div.Description p span.Type').text();
    const synopsis = $element.find('div.Description p').eq(1).text().trim();
    const rating = $element.find('div.Description p span.Vts').text();
    const debut = $element.find('a span.Estreno').text().toLowerCase();
    promises.push(animeEpisodesHandler(id).then(async extra => ({
      id: id || null,
      title: title || null,
      //id: id || null,
      poster: poster || null,
      banner: banner || null,
      synopsis: synopsis || null,
      debut: extra.animeExtraInfo[0].debut || null,
      type: type || null,
      rating: rating || null,
      genres: extra.genres || null,
      episodes: extra.listByEps || null
    })))
  })
  return Promise.all(promises);
};

const ova = async(order , page ) => {
  const res = await cloudscraper(`${BROWSE_URL}type%5B%5D=ova&order=${order}&page=${page}` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];

  $('div.Container ul.ListAnimes li article').each((index , element) =>{
    const $element = $(element);
    const id = $element.find('div.Description a.Button').attr('href').slice(1);
    const title = $element.find('a h3').text();
    const poster = $element.find('a div.Image.fa-play-circle-o figure img').attr('src');
    const banner = poster.replace('covers' , 'banners').trim();
    const type = $element.find('div.Description p span.Type').text();
    const synopsis = $element.find('div.Description p').eq(1).text().trim();
    const rating = $element.find('div.Description p span.Vts').text();
    const debut = $element.find('a span.Estreno').text().toLowerCase();
    promises.push(animeEpisodesHandler(id).then(async extra => ({
      id: id || null,
      title: title || null,
      //id: id || null,
      poster: poster || null,
      banner: banner || null,
      synopsis: synopsis || null,
      debut: extra.animeExtraInfo[0].debut || null,
      type: type || null,
      rating: rating || null,
      genres: extra.genres || null,
      episodes: extra.listByEps || null
    })))
  })
  return Promise.all(promises);
};

const special = async(order , page) => {
  const res = await cloudscraper(`${BROWSE_URL}type%5B%5D=special&order=${order}&page=${page}` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];

  $('div.Container ul.ListAnimes li article').each((index , element) =>{
    const $element = $(element);
    const id = $element.find('div.Description a.Button').attr('href').slice(1);
    const title = $element.find('a h3').text();
    const poster = $element.find('a div.Image figure img').attr('src');
    const banner = poster.replace('covers' , 'banners').trim();
    const type = $element.find('div.Description p span.Type').text();
    const synopsis = $element.find('div.Description p').eq(1).text().trim();
    const rating = $element.find('div.Description p span.Vts').text();
    const debut = $element.find('a span.Estreno').text().toLowerCase();
    promises.push(animeEpisodesHandler(id).then(async extra => ({
      id: id || null,
      title: title || null,
      //id: id || null,
      poster: poster || null,
      banner: banner || null,
      synopsis: synopsis || null,
      debut: extra.animeExtraInfo[0].debut || null,
      type: type || null,
      rating: rating || null,
      genres: extra.genres || null,
      episodes: extra.listByEps || null
    })))
  })
  return Promise.all(promises);
};

const movies = async(order , page) => {
  const res = await cloudscraper(`${BROWSE_URL}type%5B%5D=movie&order=${order}&page=${page}`, {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];

  $('div.Container ul.ListAnimes li article').each((index , element) =>{
    const $element = $(element);
    const id = $element.find('div.Description a.Button').attr('href').slice(1);
    const title = $element.find('a h3').text();
    const poster = $element.find('a div.Image figure img').attr('src');
    const banner = poster.replace('covers' , 'banners').trim();
    const type = $element.find('div.Description p span.Type').text();
    const synopsis = $element.find('div.Description p').eq(1).text().trim();
    const rating = $element.find('div.Description p span.Vts').text();
    const debut = $element.find('a span.Estreno').text().toLowerCase();
    promises.push(animeEpisodesHandler(id).then(async extra => ({
      id: id || null,
      title: title || null,
      //id: id || null,
      poster: poster || null,
      banner: banner || null,
      synopsis: synopsis || null,
      debut: extra.animeExtraInfo[0].debut || null,
      type: type || null,
      rating: rating || null,
      genres: extra.genres || null,
      episodes: extra.listByEps || null
    })))
  })
  return Promise.all(promises);
};

const animeByGenres = async(genre , order , page) => {
  const res = await cloudscraper(`${BROWSE_URL}genre%5B%5D=${genre}&order=${order}&page=${page}` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];

  $('div.Container ul.ListAnimes li article').each((index , element) =>{
    const $element = $(element);
    const id = $element.find('div.Description a.Button').attr('href').slice(1);
    const title = $element.find('a h3').text();
    const poster = $element.find('a div.Image figure img').attr('src');
    const banner = poster.replace('covers' , 'banners').trim();
    const type = $element.find('div.Description p span.Type').text();
    const synopsis = $element.find('div.Description p').eq(1).text().trim();
    const rating = $element.find('div.Description p span.Vts').text();
    const debut = $element.find('a span.Estreno').text().toLowerCase();
    promises.push(animeEpisodesHandler(id).then(async extra => ({
      id: id || null,
      title: title || null,
      //id: id || null,
      poster: poster || null,
      banner: banner || null,
      synopsis: synopsis || null,
      debut: extra.animeExtraInfo[0].debut || null,
      type: type || null,
      rating: rating || null,
      genres: extra.genres || null,
      episodes: extra.listByEps || null
    })))
  })
  return Promise.all(promises);
};





const animeEpisodesHandler = async(id) =>{
  try{
    const res = await cloudscraper(`${BASE_URL}/${id}` , {method: 'GET'});
    const body = await res;
    const $ = cheerio.load(body);
    const scripts = $('script');
    const anime_info_ids = [];
    const anime_eps_data = [];
    const animeExtraInfo = [];
    const genres = [];
    const genresValue = [];
    let listByEps;
    
    let animeTitle = $('body div.Wrapper div.Body div div.Ficha.fchlt div.Container h1.Title').text();
    let poster = `${BASE_URL}` + $('body div div div div div aside div.AnimeCover div.Image figure img').attr('src')
    const banner = poster.replace('covers' , 'banners').trim();
    let synopsis = $('body div div div div div main section div.Description p').text().trim();
    let rating = $('body div div div.Ficha.fchlt div.Container div.vtshr div.Votes span#votes_prmd').text();
    const debut = $('body div.Wrapper div.Body div div.Container div.BX.Row.BFluid.Sp20 aside.SidebarA.BFixed p.AnmStts').text();
    const type = $('body div.Wrapper div.Body div div.Ficha.fchlt div.Container span.Type').text()
    
    
    animeExtraInfo.push({
      title: animeTitle,
      poster: poster,
      banner: banner,
      synopsis: synopsis,
      rating: rating,
      debut: debut,
      type: type,
    })
    
    $('main.Main section.WdgtCn nav.Nvgnrs a').each((index , element) =>{
      const $element = $(element);
      const genre = $element.attr('href').split('=')[1] || null;
      genres.push(genre);
    });

    $('main.Main section.WdgtCn nav.Nvgnrs a').each((index , element) =>{
      const $element = $(element);
      const genreValue = $element.text() || null;
      genresValue.push(genreValue);
    });
  
    Array.from({length: scripts.length} , (v , k) =>{
      const $script = $(scripts[k]);
      const contents = $script.html();
      if((contents || '').includes('var anime_info = [')) {
        let anime_info = contents.split('var anime_info = ')[1].split(';')[0];
        let dat_anime_info = JSON.parse(anime_info);
        anime_info_ids.push(dat_anime_info);
      }
      if((contents || '').includes('var episodes = [')) {
        let episodes = contents.split('var episodes = ')[1].split(';')[0];
        let eps_data = JSON.parse(episodes)
        anime_eps_data.push(eps_data);
      }
    });
    const AnimeThumbnailsId = anime_info_ids[0][0];
    const animeId = anime_info_ids[0][2];
    let nextEpisodeDate = anime_info_ids[0][3] || null
    const amimeTempList = [];
    for(const [key , value] of Object.entries(anime_eps_data)){
      let episode = anime_eps_data[key].map(x => x[0]);
      let episodeId = anime_eps_data[key].map(x => x[1]);
      amimeTempList.push(episode , episodeId);
    }
    const animeListEps = [{nextEpisodeDate: nextEpisodeDate}];
    Array.from({length: amimeTempList[1].length} , (v , k) =>{
      let data = amimeTempList.map(x => x[k]);
      let episode = data[0];
      let id = data[1];
      let imagePreview = `${BASE_EPISODE_IMG_URL}${AnimeThumbnailsId}/${episode}/th_3.jpg`
      let link = `${id}/${animeId}-${episode}`
      // @ts-ignore
      animeListEps.push({
        episode: episode,
        id: link,
        imagePreview: imagePreview
      })
    })

    listByEps = animeListEps;

    return {listByEps , genres, genresValue, animeExtraInfo};  
  }catch(err){
    console.error(err)
  }
};

//getAnimeInfo('anime/5226/tokyo-ghoul' , 'Tokyo Ghoul')
//  .then(doc =>{
//    console.log(JSON.stringify(doc , null , 2));
//})


module.exports = {
  Test,
  getByCategorie,
  TopAiring,
  TopFuture,
  TopAllTime,
  getByRelease,
  getAnimeNews,
  animeImages,
  animeExtraInfo,
  animeExtraInfoLite,
  latestAnimeAdded,
  latestEpisodesAdded,
  getAnimeVideoPromo,
  getAnimeCharacters,
  getAnimeServers,
  downloadEpisode,
  animeByGenres,
  animeByState,
  searchRelated,
  search,
  movies,
  special,
  ova,
  tv,
  getAnimeInfo,
  getEpisodes,
  downloadLinksByEpsId
};
