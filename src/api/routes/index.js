const express = require('express');
const router = express.Router();
const api = require('../api');
const otakustv = require('otakustv');
const malScraper = require('mal-scraper');



//RUTAS ANIME
router.get('/getByCategorie/:genre/:page' , (req , res) =>{
  let genre = req.params.genre;
  let page = req.params.page;
  api.getByCategorie(genre, page)
    .then(genre =>{
      res.status(200).json(genre);
    }).catch((err) =>{
      console.error(err);
    });
});

router.get('/TopAiring' , (req , res) =>{ 
  api.TopAiring()
    .then(airing =>{
      res.status(200).json({
        airing
      });
    }).catch((err) =>{
      console.error(err);
    });
});

router.get('/TopFuture' , (req , res) =>{ 
  api.TopFuture()
    .then(future =>{
      res.status(200).json({
        future
      });
    }).catch((err) =>{
      console.error(err);
    });
});

router.get('/TopAllTime' , (req , res) =>{ 
  api.TopAllTime()
    .then(top =>{
      res.status(200).json({
        top
      });
    }).catch((err) =>{
      console.error(err);
    });
});

router.get('/releases' , (req , res) =>{ 
  api.getByRelease()
    .then(releases =>{
      res.status(200).json({
        releases
      });
    }).catch((err) =>{
      console.error(err);
    });
});

router.get('/animeNews' , (req , res) =>{
  api.getAnimeNews()
    .then(news =>{
      res.status(200).json({
        news
      });
    }).catch((err) =>{
      console.error(err);
    });
});

router.get('/SearchRelated/:query' , (req , res) =>{
  let query = req.params.query;
  
  api.searchRelated(query)
    .then(search =>{
      res.status(200).json({
        search
      });
    }).catch((err) =>{
      console.error(err);
    });
});

router.get('/animeMalIDTest/:title' , (req , res) =>{
  let title = req.params.title;
  malScraper.getInfoFromName(title)
      .then(malId =>{
        res.status(200).json(malId.id);
      }).catch((err) =>{
        console.error(err);
      });
});


router.get('/animeMalID/:title' , (req , res) =>{
  let title = req.params.title;
  api.animeImages(title)
      .then(malId =>{
        res.status(200).json(malId);
      }).catch((err) =>{
        console.error(err);
      });
});

router.get('/animeImages/:title' , (req , res) =>{
  let title = req.params.title;
  api.animeImages(title)
    .then(episodes =>{
      malScraper.getPictures(title,episodes)
      .then(images =>{
        res.status(200).json(images);
      }).catch((err) =>{
        console.error(err);
      });
    }).catch((err) =>{
      console.error(err);
    });
});



router.get('/premiereEpisodes' , (req , res) =>{
  otakustv.premiereEpisodes()
    .then(episodes =>{
      res.status(200).json(episodes);
    }).catch((err) =>{
      console.error(err);
    });
});


router.get('/getCharacters/:title' , (req , res) =>{
  api.getAnimeCharacters(req.params.title)
    .then(episodes =>{
      res.status(200).json(episodes);
    }).catch((err) =>{
      console.error(err);
    });
});

router.get('/getMoreInfo/:title' , (req , res) =>{
  api.animeExtraInfoLite(req.params.title)
    .then(episodes =>{
      res.status(200).json(episodes);
    }).catch((err) =>{
      console.error(err);
    });
});



/**
 *  @api {get} /LatestAnimeAdded Get list of recently added anime
 *  @apiVersion 1.0.5
 *  @apiName GetLatestAnimeAdded
 *  @apiGroup LastedAnimeAdded
 * 
 *  @apiSuccess {String} id           Anime id
 *  @apiSuccess {String} title        Anime title
 *  @apiSuccess {String} poster       Poster (img) on base64
 *  @apiSuccess {String} banner       Background image
 *  @apiSuccess {String} synopsis     Summary information about the story
 *  @apiSuccess {String} debut        Current status of the anime
 *  @apiSuccess {String} type         Type of content
 *  @apiSuccess {String} rating       Overall rating
 *  @apiSuccess {Object[]} genres     Genres to which he belongs
 *  @apiSuccess {Object[]} episodes   List of current episodes
 *  @apiSuccess {String} episodes.nextEpisodeDate Date of the next TV broadcast
 *  @apiSuccess {Number} episodes.episode         Episode number
 *  @apiSuccess {String} episodes.id              Episode id
 *  @apiSuccess {String} episodes.imagePreview    EpisodeDate image preview
 * 
 *  @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 * {
 *    "animes": [
 *      {
 *        "id": "anime/5715/pokemon-pelicula-22-mewtwo-no-gyakushuu-evolution",
 *        "title": "Pokemon Película 22: Mewtwo no Gyakushuu Evolution",
 *        "poster": "/9j/",
 *        "banner": "https://animeflv.net/uploads/animes/banners/3276.jpg",
 *        "synopsis": "Película 3.6Uno de los Pokémon más poderosos del mundo quiere venganza.",
 *        "debut": "Finalizado",
 *        "type": "Película",
 *        "rating": "3.6",
 *        "genres": [
 *          "accion",
 *          "aventura",
 *          "comedia",
 *          "fantasia",
 *          "infantil"
 *        ],
 *        "episodes": [
 *          {
 *            "nextEpisodeDate": null
 *          },
 *          {
 *            "episode": 1,
 *            "id": "54021/pokemon-pelicula-22-mewtwo-no-gyakushuu-evolution-1",
 *            "imagePreview": "https://cdn.animeflv.net/screenshots/3276/1/th_3.jpg"
 *          }
 *        ]
 *      },
 *    ]
 *  }
 */

router.get('/LatestAnimeAdded' , (req , res) =>{
  api.latestAnimeAdded()
    .then(animes =>{
      res.status(200).json(animes);
    }).catch((err) =>{
      console.error(err);
    });
});


/**
 *  @api {get} /LatestEpisodesAdded Get list of all recently added chapters
 *  @apiVersion 1.0.5
 *  @apiName GetLatestEpisodesAdded
 *  @apiGroup LatestEpisodesAdded
 * 
 *  @apiSuccess {String} id                     Episode id
 *  @apiSuccess {String} title                  Anime title
 *  @apiSuccess {String} poster                 Poster (img) on base64
 *  @apiSuccess {Number} episode                Episode number
 *  @apiSuccess {Object[]} servers              List of servers available for the episode
 *  @apiSuccess {String} servers.server         Server name
 *  @apiSuccess {String} servers.url            Video URL
 *  @apiSuccess {String} servers.title          Server temp name
 *  @apiSuccess {Boolean} servers.allow_mobile  N/A 
 *  @apiSuccess {String} servers.code           Video URL
 * 
 *  @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 * {
 * "episodes": [
 *   {
 *     "id": "54027/haikyuu-to-the-top-8",
 *     "title": "Haikyuu!!: To the Top",
 *     "poster": "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",
 *     "episode": 8,
 *     "servers": [
 *       {
 *         "server": "natsuki",
 *         "title": "Natsuki",
 *         "allow_mobile": true,
 *         "code": "https://s1.animeflv.net/embed.php?s=natsuki&v=THVKOEo0SElCSlFWWDZKMkQzUzYxV2V6blBFK2pFMEZmMkVPWEt3WERDVkRvbEl5MTRDVVFNNFlKT200YS9DRUJvT0RoMkZBUHJJcm9HKzBTa0xlUFFEOVBYbGdPcjl3VFhjc1dUVkF1UmJvbUN4SWFXZTQ1QUI1NjdYb0hmSTM0ckN5d29JeUZsR2s3TEp0ZkxjWTl3PT0="
 *       },
 *       {
 *         "server": "fembed",
 *         "title": "Fembed",
 *         "allow_mobile": true,
 *         "code": "https://embedsito.com/v/7rl7dfgx5lmzk8m"
 *       },
 *       {
 *         "server": "mega",
 *         "title": "MEGA",
 *         "url": "https://mega.nz/#!rfxzgI4R!0vIb1XjaAsSSzZe2cvr4ycjsdmRXqyZWldWqm5Ia-1U",
 *         "allow_mobile": true,
 *         "code": "https://mega.nz/embed#!rfxzgI4R!0vIb1XjaAsSSzZe2cvr4ycjsdmRXqyZWldWqm5Ia-1U"
 *       },
 *       {
 *         "server": "okru",
 *         "title": "Okru",
 *         "allow_mobile": true,
 *         "code": "https://ok.ru/videoembed/1625140431472"
 *       },
 *       {
 *         "server": "yu",
 *         "title": "YourUpload",
 *         "allow_mobile": true,
 *         "code": "https://www.yourupload.com/embed/SYDvT1FvNCDu"
 *       },
 *       {
 *         "server": "maru",
 *         "title": "Maru",
 *         "allow_mobile": true,
 *         "code": "https://my.mail.ru/video/embed/8995617145282895595#budyak.rus#7915"
 *       },
 *       {
 *         "server": "netu",
 *         "title": "Netu",
 *         "allow_mobile": true,
 *         "code": "https://hqq.tv/player/embed_player.php?vid=bDFrdWQ3RURGMFhrdmthcXlrT2I0dz09"
 *       }
 *     ]
 *   },
 */

router.get('/LatestEpisodesAdded' , (req , res) =>{
  api.latestEpisodesAdded()
    .then(episodes =>{
      res.status(200).json({
        episodes
      });
    }).catch((err) =>{
      console.error(err);
    });
});


/**
 *  @api {get} /GetAnimeServers/:id Get list of all servers available for the anime episode.
 *  @apiVersion 1.0.5
 *  @apiName GetAnimeServers
 *  @apiGroup GetAnimeServers
 * 
 *  @apiSuccess {Object[]} servers              List of servers available for the episode
 *  @apiSuccess {String} servers.server         Server name
 *  @apiSuccess {String} servers.url            Video URL
 *  @apiSuccess {String} servers.title          Server temp name
 *  @apiSuccess {Boolean} servers.allow_mobile  N/A 
 *  @apiSuccess {String} servers.code           Video URL
 * 
 *  @apiParam {String} id Episode id
 * 
 *  @apiParamExample {json} You will find the `id` of each chapter in the `episodes` property
 *  {
 *    "episodes": [
 *       {
 *         "nextEpisodeDate": null
 *       },
 *       {
 *         "episode": 12,
 *         "id": "28800/tokyo-ghoul-12",
 *         "imagePreview": "https://cdn.animeflv.net/screenshots/1415/12/th_3.jpg"
 *       },
 *        //......
 *     ]
 *  }
 * 
 *  @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *   {
 *     "servers": [
 *       {
 *         "server": "amus",
 *         "title": "Izanagi",
 *         "allow_mobile": true,
 *         "code": "https://s1.animeflv.net/embed.php?s=izanagi&v=RXJZUU5VSmRZRWZBSjhqazZiUUh6ZVhXY0JoUWxTU1FzTTBZVEh4OGNoT3FXNVF3amVPZGJxdWllRXhDYmNUaytjenlOdG9wVnlGdWdhUm1zSlovZlFWZy94SnFCK3RhWUxlYVAyY3FiRm56dkl4SXR1VzBVOVZGTDloRlJWZ3NZSVR3TW5peGhTMFN4cTkwc09tOWtBPT0="
 *       },
 *       {
 *         "server": "fembed",
 *         "title": "Fembed",
 *         "allow_mobile": true,
 *         "code": "https://embedsito.com/v/8xopp837qo7"
 *       },
 *       {
 *         "server": "mega",
 *         "title": "MEGA",
 *         "url": "https://mega.nz/#!55InSaxI!5JTxVNA29LCFNr7c1Fxg0PUBQPVQyXBo4aVF3e06jN0",
 *         "allow_mobile": true,
 *         "code": "https://mega.nz/embed#!55InSaxI!5JTxVNA29LCFNr7c1Fxg0PUBQPVQyXBo4aVF3e06jN0"
 *       },
 *       {
 *         "server": "yu",
 *         "title": "YourUpload",
 *         "allow_mobile": true,
 *         "code": "https://www.yourupload.com/embed/21KnA1854827"
 *       },
 *       {
 *         "server": "netu",
 *         "title": "Netu",
 *         "allow_mobile": true,
 *         "code": "https://hqq.tv/player/embed_player.php?vid=8B98HMBDSA95"
 *       }
 *     ]
 *   }
 */

router.get('/GetAnimeServers/:id([^/]+/[^/]+)' , (req , res) =>{
  let id = req.params.id;
  console.log(id);
  api.getAnimeServers(id)
    .then(servers =>{
      res.status(200).json({
        servers
      });
    }).catch((err) =>{
      console.error(err);
    });
});

/**
 *  @api {get} /Genres/:genre/:sortBy/:page Get list of Anime by genres
 *  @apiSampleRequest https://animeflv.chrismichael.now.sh/api/v1/Genres/:genre/:sortBy/:page
 *  @apiVersion 1.0.5
 *  @apiName GetGenres
 *  @apiGroup Genres
 * 
 *  @apiSuccess {String} id           Anime id
 *  @apiSuccess {String} title        Anime title
 *  @apiSuccess {String} poster       Poster (img) on base64
 *  @apiSuccess {String} banner       Background image
 *  @apiSuccess {String} synopsis     Summary information about the story
 *  @apiSuccess {String} debut        Current status of the anime
 *  @apiSuccess {String} type         Type of content
 *  @apiSuccess {String} rating       Overall rating
 *  @apiSuccess {Object[]} genres     Genres to which he belongs
 *  @apiSuccess {Object[]} episodes   List of current episodes
 *  @apiSuccess {String} episodes.nextEpisodeDate Date of the next TV broadcast
 *  @apiSuccess {Number} episodes.episode         Episode number
 *  @apiSuccess {String} episodes.id              Episode id
 *  @apiSuccess {String} episodes.imagePreview    EpisodeDate image preview
 * 
 *  @apiParam {String="accion","artes-marciales","aventura","carreras","ciencia-ficcion","comedia","demencia","demonios","deportes","drama","ecchi","escolares","espacial","fantasia","harem","historico","infantil","josei","juegos","magia","mecha","militar","misterio","musica","parodia","psicologico","recuentos-de-la-vida","romance","samurai","seinen","shoujo","shounen","sobrenatural","superpoderes","suspenso","terror","vampiros","yaoi","yuri"} genre 
 *  @apiParam {String="default","updated","added","rating","title"} sortBy
 *  @apiParam {Number} page Total page unknown
 *
 * 
 *  @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 * {
 * "animes": [
 *     {
 *       "id": "anime/5713/dorohedoro",
 *       "title": "Dorohedoro",
 *       "poster": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx72wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wgARCAFyAQQDA",
 *       "banner": "https://animeflv.net/uploads/animes/banners/3274.jpg",
 *       "synopsis": "La trama se centra en Caiman, un chico que no recuerda quien era después de haber sido transformado por un hechicero. Esta transformación le dejó con la cabeza de un reptil y un deseo de descubrir la verdad sobre quién es realmente.",
 *      "debut": "En emision",
 *      "type": "Anime",
 *      "rating": "0.0",
 *      "genres": [
 *        "accion",
 *        "comedia",
 *        "fantasia",
 *        "seinen",
 *        "terror"
 *      ],
 *      "episodes": [
 *        {
 *          "nextEpisodeDate": "2020-01-17"
 *        },
 *        {
 *          "episode": 7,
 *          "id": "53992/dorohedoro-7",
 *          "imagePreview": "https://cdn.animeflv.net/screenshots/3274/7/th_3.jpg"
 *        },
 *        {
 *          "episode": 6,
 *          "id": "53958/dorohedoro-6",
 *          "imagePreview": "https://cdn.animeflv.net/screenshots/3274/6/th_3.jpg"
 *        },
 *        {
 *          "episode": 5,
 *          "id": "53895/dorohedoro-5",
 *          "imagePreview": "https://cdn.animeflv.net/screenshots/3274/5/th_3.jpg"
 *        },
 *        {
 *          "episode": 4,
 *          "id": "53854/dorohedoro-4",
 *          "imagePreview": "https://cdn.animeflv.net/screenshots/3274/4/th_3.jpg"
 *        },
 *        {
 *          "episode": 3,
 *          "id": "53789/dorohedoro-3",
 *          "imagePreview": "https://cdn.animeflv.net/screenshots/3274/3/th_3.jpg"
 *        },
 *        {
 *          "episode": 2,
 *          "id": "53755/dorohedoro-2",
 *          "imagePreview": "https://cdn.animeflv.net/screenshots/3274/2/th_3.jpg"
 *        },
 *        {
 *          "episode": 1,
 *          "id": "53705/dorohedoro-1",
 *          "imagePreview": "https://cdn.animeflv.net/screenshots/3274/1/th_3.jpg"
 *        }
 *      ]
 *    },
 * 
 */

router.get('/Genres/:genre/:order/:page' , (req , res) =>{
  let genre = req.params.genre;
  let order = req.params.order;
  let page = req.params.page;
  api.animeByGenres(genre, order , page)
    .then(animes =>{
      res.status(200).json(animes);
    }).catch((err) =>{
      console.error(err);
    });
});


/**
 *  @api {get} /Movies/:sortBy/:page Get list of Movies
 *  @apiSampleRequest https://animeflv.chrismichael.now.sh/api/v1/Movies/:sortBy/:page
 *  @apiVersion 1.0.5
 *  @apiName GetMovies
 *  @apiGroup Movies
 * 
 *  @apiSuccess {String} id           Anime id
 *  @apiSuccess {String} title        Anime title
 *  @apiSuccess {String} poster       Poster (img) on base64
 *  @apiSuccess {String} banner       Background image
 *  @apiSuccess {String} synopsis     Summary information about the story
 *  @apiSuccess {String} debut        Current status of the anime
 *  @apiSuccess {String} type         Type of content
 *  @apiSuccess {String} rating       Overall rating
 *  @apiSuccess {Object[]} genres     Genres to which he belongs
 *  @apiSuccess {Object[]} episodes   List of current episodes
 *  @apiSuccess {String} episodes.nextEpisodeDate Date of the next TV broadcast
 *  @apiSuccess {Number} episodes.episode         Episode number
 *  @apiSuccess {String} episodes.id              Episode id
 *  @apiSuccess {String} episodes.imagePreview    EpisodeDate image preview
 * 
 * 
 *  @apiParam {String="default","updated","added","rating","title"} sortBy
 *  @apiParam {Number} page Total page unknown
 *
 *  @apiSuccessExample {json} Success-Response:
 *  {
 *   "movies": [
 *     {
 *       "id": "anime/5698/kyochuu-rettou-movie",
 *       "title": "Kyochuu Rettou Movie",
 *       "poster": "UklGRqiGAABXRUJQVlA4IJyGAADQTgGdASoEAXIBPk0ei0QioaEXu/cYKATEoA0I5qWd9Yu5r4n+V/c72VOQe2731+C/Wv+F97XXL2H5bfR3/Q+7P5b/8T9pPfL+sP",
 *       "banner": "https://animeflv.net/uploads/animes/banners/3259.jpg",
 *       "synopsis": "Después de un accidente de avión durante un viaje escolar, Oribe Mutsumi y sus compañeros de clase quedaron varados en una isla aparentemente desierta. Mutsumi encontró a los otros sobrevivientes y usó sus conocimientos para ayudarlos. Estos esperan a ser rescatados al menos en tres días, lo que no parece ser mucho tiempo. Sin embargo, Mutsu...",
 *       "debut": "Finalizado",
 *       "type": "Película",
 *       "rating": "4.4",
 *       "genres": [
 *         "terror"
 *       ],
 *       "episodes": [
 *         {
 *           "nextEpisodeDate": null
 *         },
 *         {
 *           "episode": 1,
 *           "id": "53644/kyochuu-rettou-movie-1",
 *           "imagePreview": "https://cdn.animeflv.net/screenshots/3259/1/th_3.jpg"
 *         }
 *       ]
 *     },
 *      // .....
 *    ]
 *  }
 */

router.get('/Movies/:order/:page' , (req , res) =>{
  let order = req.params.order;
  let page = req.params.page;
  api.movies(order , page)
    .then(movies =>{
      res.status(200).json({
        movies
      });
    }).catch((err) =>{
      console.error(err);
    });
});


/**
 *  @api {get} /Special/:sortBy/:page Get list of Special Anime
 *  @apiSampleRequest https://animeflv.chrismichael.now.sh/api/v1/Special/:sortBy/:page
 *  @apiVersion 1.0.5
 *  @apiName GetSpecial
 *  @apiGroup Special
 * 
 *  @apiSuccess {String} id           Anime id
 *  @apiSuccess {String} title        Anime title
 *  @apiSuccess {String} poster       Poster (img) on base64
 *  @apiSuccess {String} banner       Background image
 *  @apiSuccess {String} synopsis     Summary information about the story
 *  @apiSuccess {String} debut        Current status of the anime
 *  @apiSuccess {String} type         Type of content
 *  @apiSuccess {String} rating       Overall rating
 *  @apiSuccess {Object[]} genres     Genres to which he belongs
 *  @apiSuccess {Object[]} episodes   List of current episodes
 *  @apiSuccess {String} episodes.nextEpisodeDate Date of the next TV broadcast
 *  @apiSuccess {Number} episodes.episode         Episode number
 *  @apiSuccess {String} episodes.id              Episode id
 *  @apiSuccess {String} episodes.imagePreview    EpisodeDate image preview
 * 
 * 
 *  @apiParam {String="default","updated","added","rating","title"} sortBy
 *  @apiParam {Number} page Total page unknown
 *
 *  @apiSuccessExample {json} Success-Response:
 *
 * {
 *     "special": [
 *       {
 *         "id": "anime/5620/fategrand-order-zettai-majuu-sensen-babylonia-initium-iter",
 *         "title": "Fate/Grand Order: Zettai Majuu Sensen Babylonia - Initium Iter",
 *         "poster": "UklGRgZNAABXRUJQVlA4IPpMAACQ+ACdASoEAXIBPlEijkUjoiEpKFYL4SAKCWNuDsiTKrm8nGcqJ8frlx/82zZ+r/S/7b8ie0rvk6/8yvoz/ufdV8vP+n68/",
 *         "banner": "https://animeflv.net/uploads/animes/banners/3181.jpg",
 *         "synopsis": "Año 2017. La última era en la que existió la magia. Los humanos crearon la sociedad, pero los Magos fueron quienes consiguieron alcanzar la verdad del mundo. La magia se compone de técnicas del pasado que la ciencia no puede explicar, mientras que la ciencia se compone de técnicas del futuro que la magia no puede alcanzar. Estudiosos e investi...",
 *         "debut": "Finalizado",
 *         "type": "Especial",
 *         "rating": "4.6",
 *         "genres": [
 *           "accion",
 *           "fantasia",
 *           "magia",
 *           "sobrenatural"
 *         ],
 *         "episodes": [
 *           {
 *             "nextEpisodeDate": null
 *           },
 *           {
 *             "episode": 0,
 *             "id": "52745/fategrand-order-zettai-majuu-sensen-babylonia-initium-iter-0",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/3181/0/th_3.jpg"
 *           }
 *         ]
 *       },
 *       //.....
 *     ]
 */

router.get('/Special/:order/:page' , (req , res) =>{
  let order = req.params.order;
  let page = req.params.page;
  api.special(order , page)
    .then(special =>{
      res.status(200).json({
        special
      });
    }).catch((err) =>{
      console.error(err);
    });
});

/**
 *  @api {get} /Ova/:sortBy/:page Get list of Ovas
 *  @apiSampleRequest https://animeflv.chrismichael.now.sh/api/v1/Ova/:sortBy/:page
 *  @apiVersion 1.0.5
 *  @apiName GetOva
 *  @apiGroup Ova
 * 
 *  @apiSuccess {String} id           Anime id
 *  @apiSuccess {String} title        Anime title
 *  @apiSuccess {String} poster       Poster (img) on base64
 *  @apiSuccess {String} banner       Background image
 *  @apiSuccess {String} synopsis     Summary information about the story
 *  @apiSuccess {String} debut        Current status of the anime
 *  @apiSuccess {String} type         Type of content
 *  @apiSuccess {String} rating       Overall rating
 *  @apiSuccess {Object[]} genres     Genres to which he belongs
 *  @apiSuccess {Object[]} episodes   List of current episodes
 *  @apiSuccess {String} episodes.nextEpisodeDate Date of the next TV broadcast
 *  @apiSuccess {Number} episodes.episode         Episode number
 *  @apiSuccess {String} episodes.id              Episode id
 *  @apiSuccess {String} episodes.imagePreview    EpisodeDate image preview
 * 
 * 
 *  @apiParam {String="default","updated","added","rating","title"} sortBy
 *  @apiParam {Number} page Total page unknown
 *
 *  @apiSuccessExample {json} Success-Response:
 *
 * {
 *   "ova": [
 *     {
 *       "id": "anime/5714/tsugumomo-ova",
 *       "title": "Tsugumomo OVA",
 *       "poster": "UklGRo5iAABXRUJQVlA4IIJiAACQIgGdASoEAXIBPlEgjUSjoiEVmhbwOAUEo+8dvx0ytgVT4Bkq/ADQ0D74YWh9bvFdFnyL4SfWvxPDq2h50b2f/",
 *       "banner": "https://animeflv.net/uploads/animes/banners/3275.jpg",
 *       "synopsis": "Kazuya Kagami nunca va a ningún lado sin su preciada “Sakura Obi” que su madre le regaló. Un día, una hermosa chica vestida con un kimono llamada Kiriha aparece ante él. Naturalmente, ella comienza a vivir en su habitación. ¿Naturalmente? ¡Esto solo es el inicio de la embarazosa y confusa (y por supuesto feliz) nueva vida de Kazuya!",
 *      "debut": "Finalizado",
 *      "type": "OVA",
 *      "rating": "5.0",
 *      "genres": [
 *        "accion",
 *        "comedia",
 *        "ecchi",
 *        "escolares",
 *        "seinen",
 *        "sobrenatural"
 *      ],
 *      "episodes": [
 *        {
 *          "nextEpisodeDate": null
 *        },
 *        {
 *          "episode": 1,
 *          "id": "53753/tsugumomo-ova-1",
 *          "imagePreview": "https://cdn.animeflv.net/screenshots/3275/1/th_3.jpg"
 *        }
 *      ]
 *    },
 *    //.....
 *  ]
 *}
 */

router.get('/Ova/:order/:page' , (req , res) =>{
  let order = req.params.order;
  let page = req.params.page;
  api.ova(order , page)
    .then(ova =>{
      res.status(200).json({
        ova
      });
    }).catch((err) =>{
      console.error(err);
    });
});


/**
 *  @api {get} /TV/:sortBy/:page Get list of Anime in tv
 *  @apiSampleRequest https://animeflv.chrismichael.now.sh/api/v1/TV/:sortBy/:page
 *  @apiVersion 1.0.5
 *  @apiName GetTV
 *  @apiGroup TV
 * 
 *  @apiSuccess {String} id           Anime id
 *  @apiSuccess {String} title        Anime title
 *  @apiSuccess {String} poster       Poster (img) on base64
 *  @apiSuccess {String} banner       Background image
 *  @apiSuccess {String} synopsis     Summary information about the story
 *  @apiSuccess {String} debut        Current status of the anime
 *  @apiSuccess {String} type         Type of content
 *  @apiSuccess {String} rating       Overall rating
 *  @apiSuccess {Object[]} genres     Genres to which he belongs
 *  @apiSuccess {Object[]} episodes   List of current episodes
 *  @apiSuccess {String} episodes.nextEpisodeDate Date of the next TV broadcast
 *  @apiSuccess {Number} episodes.episode         Episode number
 *  @apiSuccess {String} episodes.id              Episode id
 *  @apiSuccess {String} episodes.imagePreview    EpisodeDate image preview
 * 
 * 
 *  @apiParam {String="default","updated","added","rating","title"} sortBy
 *  @apiParam {Number} page Total page unknown
 *
 *  @apiSuccessExample {json} Success-Response:
 *
 *   {
 *     "tv": [
 *       {
 *         "id": "anime/5712/isekai-quartet-2nd-season",
 *         "title": "Isekai Quartet 2nd Season",
 *         "poster": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/",
 *         "banner": "https://animeflv.net/uploads/animes/banners/3273.jpg",
 *         "synopsis": "Segunda tempo de Isekai Quartet",
 *         "debut": "En emision",
 *         "type": "Anime",
 *         "rating": "0.0",
 *         "genres": [
 *           "comedia",
 *           "fantasia",
 *           "parodia"
 *         ],
 *         "episodes": [
 *           {
 *             "nextEpisodeDate": "2020-03-03"
 *           },
 *           {
 *             "episode": 7,
 *             "id": "54002/isekai-quartet-2nd-season-7",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/3273/7/th_3.jpg"
 *           },
 *           {
 *             "episode": 6,
 *             "id": "53951/isekai-quartet-2nd-season-6",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/3273/6/th_3.jpg"
 *           },
 *           {
 *             "episode": 5,
 *             "id": "53899/isekai-quartet-2nd-season-5",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/3273/5/th_3.jpg"
 *           },
 *           {
 *             "episode": 4,
 *             "id": "53845/isekai-quartet-2nd-season-4",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/3273/4/th_3.jpg"
 *           },
 *           {
 *             "episode": 3,
 *             "id": "53798/isekai-quartet-2nd-season-3",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/3273/3/th_3.jpg"
 *           },
 *           {
 *             "episode": 2,
 *             "id": "53742/isekai-quartet-2nd-season-2",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/3273/2/th_3.jpg"
 *           },
 *           {
 *             "episode": 1,
 *             "id": "53682/isekai-quartet-2nd-season-1",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/3273/1/th_3.jpg"
 *           }
 *         ]
 *       },
 *       //.....
 *     ]
 *   }
 */

router.get('/TV/:order/:page' , (req , res) =>{
  let order = req.params.order;
  let page = req.params.page;
  api.tv(order , page)
    .then(tv =>{
      res.status(200).json({
        tv
      });
    }).catch((err) =>{
      console.error(err);
    });
});

/**
 *  @api {get} /AnimeByState/:state/:sortBy/:page Get list of Anime in tv
 *  @apiSampleRequest https://animeflv.chrismichael.now.sh/api/v1/AnimeByState/:state/:sortBy/:page
 *  @apiVersion 1.0.5
 *  @apiName GetAnimeByState
 *  @apiGroup AnimeByState
 * 
 *  @apiSuccess {String} id           Anime id
 *  @apiSuccess {String} title        Anime title
 *  @apiSuccess {String} poster       Poster (img) on base64
 *  @apiSuccess {String} banner       Background image
 *  @apiSuccess {String} synopsis     Summary information about the story
 *  @apiSuccess {String} debut        Current status of the anime
 *  @apiSuccess {String} type         Type of content
 *  @apiSuccess {String} rating       Overall rating
 *  @apiSuccess {Object[]} genres     Genres to which he belongs
 *  @apiSuccess {Object[]} episodes   List of current episodes
 *  @apiSuccess {String} episodes.nextEpisodeDate Date of the next TV broadcast
 *  @apiSuccess {Number} episodes.episode         Episode number
 *  @apiSuccess {String} episodes.id              Episode id
 *  @apiSuccess {String} episodes.imagePreview    EpisodeDate image preview
 * 
 *  
 *  @apiParam {Number=1,2,3} state
 *  @apiParam {String="default","updated","added","rating","title"} sortBy
 *  @apiParam {Number} page Total page unknown
 * 
 *  @apiDescription {state = 1} In Emission | {state = 2} Finalized | {state = 3} Coming Soon	
 *
 *  @apiSuccessExample {json} Success-Response:
 *
 *   {
 *     "animes": [
 *       {
 *         "id": "anime/5712/isekai-quartet-2nd-season",
 *         "title": "Isekai Quartet 2nd Season",
 *         "poster": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/",
 *         "banner": "https://animeflv.net/uploads/animes/banners/3273.jpg",
 *         "synopsis": "Segunda tempo de Isekai Quartet",
 *         "debut": "En emision",
 *         "type": "Anime",
 *         "rating": "0.0",
 *         "genres": [
 *           "comedia",
 *           "fantasia",
 *           "parodia"
 *         ],
 *         "episodes": [
 *           {
 *             "nextEpisodeDate": "2020-03-03"
 *           },
 *           {
 *             "episode": 7,
 *             "id": "54002/isekai-quartet-2nd-season-7",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/3273/7/th_3.jpg"
 *           },
 *           {
 *             "episode": 6,
 *             "id": "53951/isekai-quartet-2nd-season-6",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/3273/6/th_3.jpg"
 *           },
 *           {
 *             "episode": 5,
 *             "id": "53899/isekai-quartet-2nd-season-5",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/3273/5/th_3.jpg"
 *           },
 *           {
 *             "episode": 4,
 *             "id": "53845/isekai-quartet-2nd-season-4",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/3273/4/th_3.jpg"
 *           },
 *           {
 *             "episode": 3,
 *             "id": "53798/isekai-quartet-2nd-season-3",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/3273/3/th_3.jpg"
 *           },
 *           {
 *             "episode": 2,
 *             "id": "53742/isekai-quartet-2nd-season-2",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/3273/2/th_3.jpg"
 *           },
 *           {
 *             "episode": 1,
 *             "id": "53682/isekai-quartet-2nd-season-1",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/3273/1/th_3.jpg"
 *           }
 *         ]
 *       },
 *       //.....
 *     ]
 *   }
 */

router.get('/AnimeByState/:state/:order/:page' , (req , res) =>{
  let state = req.params.state;
  let order = req.params.order;
  let page = req.params.page;
  api.animeByState(state , order , page)
    .then(animes =>{
      res.status(200).json(animes);
    }).catch((err) =>{
      console.error(err);
    });
});

/**
 *  @api {get} /Search/:query Get anime list by doing a search
 *  @apiSampleRequest https://animeflv.chrismichael.now.sh/api/v1/Search/:query
 *  @apiVersion 1.0.5
 *  @apiName Search
 *  @apiGroup Search
 * 
 *  @apiSuccess {String} id           Anime id
 *  @apiSuccess {String} title        Anime title
 *  @apiSuccess {String} poster       Poster (img) on base64
 *  @apiSuccess {String} banner       Background image
 *  @apiSuccess {String} synopsis     Summary information about the story
 *  @apiSuccess {String} debut        Current status of the anime
 *  @apiSuccess {String} type         Type of content
 *  @apiSuccess {String} rating       Overall rating
 *  @apiSuccess {Object[]} genres     Genres to which he belongs
 *  @apiSuccess {Object[]} episodes   List of current episodes
 *  @apiSuccess {String} episodes.nextEpisodeDate Date of the next TV broadcast
 *  @apiSuccess {Number} episodes.episode         Episode number
 *  @apiSuccess {String} episodes.id              Episode id
 *  @apiSuccess {String} episodes.imagePreview    EpisodeDate image preview
 * 
 *  
 *  @apiParam {String} query Anime title
 *
 *  @apiSuccessExample {json} Success-Response:
 *
 *{
 * "search": [
 *   {
 *     "id": "anime/5227/tokyo-ghoul-jack",
 *     "title": "Tokyo Ghoul: Jack",
 *     "poster": "UklGRphjAABXRUJQVlA4IIxjAABQIwGdASoEAXIBPlEgjUSjoiEVKX7oOAUEsRPwimXsFebXP77/w/Ne477kfaf4D9ee0Hrq7V8uXor/0f5v8rfmV/t/Wj/Sv9h/5fcZ",
 *     "banner": "https://animeflv.net/uploads/animes/banners/2285.jpg",
 *     "synopsis": "En Tokyo Ghoul: Jack, seguimos un incidente relacionado con un Ghoul devorador de humanos en el Distrito 13 de Tokio. Para descubrir la verdad de lo ocurrido a su amigo, el estudiante de instituto Taishi Fura persigue al Ghoul conocido como Lantern acompañado del joven investigador Kisho Arima. La historia cuenta cómo Arima y Fura se ...",
 *     "debut": "Finalizado",
 *     "type": "OVA",
 *     "rating": "4.5",
 *     "genres": [
 *       "accion",
 *       "drama",
 *       "escolares",
 *       "seinen",
 *       "sobrenatural",
 *       "terror"
 *     ],
 *     "episodes": [
 *       {
 *         "nextEpisodeDate": null
 *       },
 *       {
 *         "episode": 1,
 *         "id": "37923/tokyo-ghoul-jack-1",
 *         "imagePreview": "https://cdn.animeflv.net/screenshots/2285/1/th_3.jpg"
 *       }
 *     ]
 *   },
 *   {
 *     "id": "anime/5226/tokyo-ghoul",
 *     "title": "Tokyo Ghoul",
 *     "poster": "UklGRlxiAABXRUJQVlA4IFBiAABwOgGdASoEAXIBPlEgjUSjoiErLPQtoWAKCWIAyBfoz0ff/ml7OXH/cH7o+8frT2t9xXZvl/dFf97/Gf5j9vflj/zP/J7Yv1p/6/cQ",
 *     "banner": "https://animeflv.net/uploads/animes/banners/1415.jpg",
 *     "synopsis": "Extraños asesinatos se están sucediendo uno tras otro en Tokyo. Debido a las pruebas encontradas en las escenas, la policía concluye que los ataques son obra de ghouls que se comen a las personas. Kaneki y Hide, dos compañeros de clase, llegan a la conclusión de que si nadie ha visto nunca a esos necrófagos...",
 *     "debut": "Finalizado",
 *     "type": "Anime",
 *     "rating": "4.5",
 *     "genres": [
 *       "accion",
 *       "drama",
 *       "misterio",
 *       "psicologico",
 *       "seinen",
 *       "sobrenatural",
 *       "terror"
 *     ],
 *     "episodes": [
 *       {
 *         "nextEpisodeDate": null
 *       },
 *       {
 *         "episode": 12,
 *         "id": "28800/tokyo-ghoul-12",
 *         "imagePreview": "https://cdn.animeflv.net/screenshots/1415/12/th_3.jpg"
 *       },
 *       {
 *         "episode": 11,
 *         "id": "28459/tokyo-ghoul-11",
 *         "imagePreview": "https://cdn.animeflv.net/screenshots/1415/11/th_3.jpg"
 *       },
 *       {
 *         "episode": 10,
 *         "id": "28001/tokyo-ghoul-10",
 *         "imagePreview": "https://cdn.animeflv.net/screenshots/1415/10/th_3.jpg"
 *       },
 *       {
 *         "episode": 9,
 *         "id": "27741/tokyo-ghoul-9",
 *         "imagePreview": "https://cdn.animeflv.net/screenshots/1415/9/th_3.jpg"
 *       },
 *       {
 *         "episode": 8,
 *         "id": "27092/tokyo-ghoul-8",
 *         "imagePreview": "https://cdn.animeflv.net/screenshots/1415/8/th_3.jpg"
 *       },
 *       {
 *         "episode": 7,
 *         "id": "26689/tokyo-ghoul-7",
 *         "imagePreview": "https://cdn.animeflv.net/screenshots/1415/7/th_3.jpg"
 *       },
 *       {
 *         "episode": 6,
 *         "id": "26529/tokyo-ghoul-6",
 *         "imagePreview": "https://cdn.animeflv.net/screenshots/1415/6/th_3.jpg"
 *       },
 *       {
 *         "episode": 5,
 *         "id": "26431/tokyo-ghoul-5",
 *         "imagePreview": "https://cdn.animeflv.net/screenshots/1415/5/th_3.jpg"
 *       },
 *       {
 *         "episode": 4,
 *         "id": "26373/tokyo-ghoul-4",
 *         "imagePreview": "https://cdn.animeflv.net/screenshots/1415/4/th_3.jpg"
 *       },
 *       {
 *         "episode": 3,
 *         "id": "26278/tokyo-ghoul-3",
 *         "imagePreview": "https://cdn.animeflv.net/screenshots/1415/3/th_3.jpg"
 *       },
 *       {
 *         "episode": 2,
 *         "id": "26188/tokyo-ghoul-2",
 *         "imagePreview": "https://cdn.animeflv.net/screenshots/1415/2/th_3.jpg"
 *       },
 *       {
 *         "episode": 1,
 *         "id": "26103/tokyo-ghoul-1",
 *         "imagePreview": "https://cdn.animeflv.net/screenshots/1415/1/th_3.jpg"
 *       }
 *     ]
 *   },
 *    //.....
 *  ]
 * }
 */

router.get('/Search/:query' , (req , res) =>{
  let query = req.params.query;
  
  api.search(query)
    .then(search =>{
      res.status(200).json({
        search
      });
    }).catch((err) =>{
      console.error(err);
    });
});


/**
 *  @api {get} /AnimeCharacters/:title Get list of characters from a particular anime
 *  @apiSampleRequest https://animeflv.chrismichael.now.sh/api/v1/AnimeCharacters/:title 
 *  @apiVersion 1.0.5
 *  @apiName GetAnimeCharacters
 *  @apiGroup AnimeCharacters
 * 
 *  @apiSuccess {String[]} characters     List of Characters
 *  @apiSuccess {String} characters.id    Character id
 *  @apiSuccess {String} characters.name  Character name 
 *  @apiSuccess {String} characters.role  Character specific role
 * 
 *  @apiParam {String} title Anime title
 * 
 *  @apiParamExample {json} You should use the `title` property of the anime.
 *  {
 *    "title": "Tokyo Ghoul",
 *  }
 * 
 *  @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *   {
 *     "characters": [
 *       {
 *         "character": {
 *           "id": 87275,
 *           "name": "Kaneki, Ken",
 *           "image": "https://cdn.myanimelist.net/images/characters/9/251339.jpg?s=788e4d76ff697c9ee67b65b68b6e8157",
 *           "role": "Main"
 *         }
 *       },
 *       {
 *         "character": {
 *           "id": 87277,
 *           "name": "Kirishima, Touka",
 *           "image": "https://cdn.myanimelist.net/images/characters/16/234699.jpg?s=10ef474344779135236911013b0925fc",
 *           "role": "Main"
 *         }
 *       },
 *       {
 *         "character": {
 *           "id": 113779,
 *           "name": "Abe, Maiko",
 *           "image": "https://cdn.myanimelist.net/images/characters/16/259779.jpg?s=67ed4d2dfb07359d050eb3a0ec91ca8d",
 *           "role": "Supporting"
 *         }
 *       },
 *       {
 *         "character": {
 *           "id": 99671,
 *           "name": "Amon, Koutarou",
 *           "image": "https://cdn.myanimelist.net/images/characters/13/251453.jpg?s=cf7bdc7cb409357d69720b0aee488ff6",
 *           "role": "Supporting"
 *         }
 *       },
 *       {
 *         "character": {
 *           "id": 111767,
 *           "name": "Arima, Kishou ",
 *           "image": "https://cdn.myanimelist.net/images/characters/5/257935.jpg?s=774409608456392dcaca31f53234bb53",
 *           "role": "Supporting"
 *         }
 *       },
 *       {
 *         "character": {
 *           "id": 112687,
 *           "name": "Banjou, Kazuichi",
 *           "image": "https://cdn.myanimelist.net/images/characters/8/258499.jpg?s=f4c8bd78f37677f38a47a8e28b8e7056",
 *           "role": "Supporting"
 *         }
 *       },
 *       {
 *         "character": {
 *           "id": 110241,
 *           "name": "Enji, Koma",
 *           "image": "https://cdn.myanimelist.net/images/characters/15/257941.jpg?s=f6702db6de1a2f2829577a566d3e43ce",
 *           "role": "Supporting"
 *         }
 *       },
 *     ]
 *   }
 */

router.get('/AnimeCharacters/:title' , (req , res) =>{
  let title = req.params.title.toString();
  api.getAnimeCharacters(title)
    .then(characters =>{
      res.status(200).json({
        characters,
      });
    }).catch((err) =>{
      console.error(err);
    });
});


/**
 *  @api {get} /AnimeTrailers/:title Get ist of promotional videos
 *  @apiSampleRequest https://animeflv.chrismichael.now.sh/api/v1/AnimeTrailers/:title 
 *  @apiVersion 1.0.5
 *  @apiName GetAnimeTrailers
 *  @apiGroup AnimeTrailers
 * 
 *  @apiSuccess {String[]} trailers             List of promo
 *  @apiSuccess {String} trailers.title         Promo title
 *  @apiSuccess {String} trailers.previewImage  Preview image  
 *  @apiSuccess {String} trailers.videoURL      Promotional video from youtube.
 * 
 *  @apiParam {String} title Anime title
 * 
 *  @apiParamExample {json} You should use the `title` property of the anime.
 *  {
 *    "title": "Tokyo Ghoul",
 *  }
 * 
 *  @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *   {
 *     "trailers": [
 *       {
 *         "title": "PV Madman ver.",
 *         "previewImage": "https://i.ytimg.com/vi/vGuQeQsoRgU/mqdefault.jpg",
 *         "videoURL": "https://www.youtube.com/embed/vGuQeQsoRgU?enablejsapi=1&wmode=opaque&autoplay=1"
 *       },
 *       {
 *         "title": "PV AnimeLab ver.",
 *         "previewImage": "https://i.ytimg.com/vi/ETHpMMV8rJU/mqdefault.jpg",
 *         "videoURL": "https://www.youtube.com/embed/ETHpMMV8rJU?enablejsapi=1&wmode=opaque&autoplay=1"
 *       }
 *     ]
 *   }
 */

router.get('/AnimeTrailers/:title' , (req , res) =>{
  let title = req.params.title.toString();
  api.getAnimeVideoPromo(title)
    .then(trailers =>{
      res.status(200).json({
        trailers,
      });
    }).catch((err) =>{
      console.error(err);
    });
});


/**
 *  @api {get} /GetAnimeInfo/:id/:title Get list of promotional videos
 *  @apiVersion 1.0.5
 *  @apiName GetAnimeInfo
 *  @apiGroup GetAnimeInfo
 * 
*   @apiSuccess {String} id           Anime id
 *  @apiSuccess {String} title        Anime title
 *  @apiSuccess {String} poster       Poster (img) on base64
 *  @apiSuccess {String} banner       Background image
 *  @apiSuccess {String} synopsis     Summary information about the story
 *  @apiSuccess {String} debut        Current status of the anime
 *  @apiSuccess {String} type         Type of content
 *  @apiSuccess {String} rating       Overall rating
 *  @apiSuccess {Object[]} genres     Genres to which he belongs
 *  @apiSuccess {Object[]} episodes   List of current episodes
 *  @apiSuccess {String} episodes.nextEpisodeDate Date of the next TV broadcast
 *  @apiSuccess {Number} episodes.episode         Episode number
 *  @apiSuccess {String} episodes.id              Episode id
 *  @apiSuccess {String} episodes.imagePreview    EpisodeDate image preview
 *  @apiSuccess {Object[]} moreInfo               Extra Information
 *  @apiSuccess {String} moreInfo.titleJapanese   Alternative title in Japanese
 *  @apiSuccess {String} moreInfo.source          anime source
 *  @apiSuccess {Number} moreInfo.totalEpisodes   Total anime episodes
 *  @apiSuccess {String} moreInfo.status          Current Transmission Status
 *  @apiSuccess {String[]} moreInfo.aired         Start and end date of the anime
 *  @apiSuccess {Number} moreInfo.duration        Average duration by episodes
 *  @apiSuccess {Number} moreInfo.rank            Actual ranking position
 *  @apiSuccess {Number} moreInfo.popularity      Popularity value
 *  @apiSuccess {Number} moreInfo.members         Number of Members who support the anime
 *  @apiSuccess {String} moreInfo.premiered       Release date
 *  @apiSuccess {String} moreInfo.broadcast       Broadcast day
 *  @apiSuccess {String[]} moreInfo.producers     Anime Propuctures
 *  @apiSuccess {String[]} moreInfo.licensors     Anime licensors
 *  @apiSuccess {String[]} moreInfo.studios       Anime studios
 *  @apiSuccess {String[]} moreInfo.openingThemes title of the beginning anime song 
 *  @apiSuccess {String[]} moreInfo.endingThemes  song title at the end of the anime
 *  @apiSuccess {String[]} moreInfo.promoList     List of promotional videos
 *  @apiSuccess {String[]} moreInfo.charactersList characters List
 * 
 *  @apiParam {String} id Anime id
 *  @apiParam {String} title Anime title
 * 
 *  @apiParamExample {json} You should use the `title` and the 'id' property of the anime.
 *  {
 *    "id": "anime/5226/tokyo-ghoul",
 *    "title": "Tokyo Ghoul"
 *  }
 * 
 *  @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *
 *   {
 *     "info": [
 *       {
 *         "id": "anime/5226/tokyo-ghoul",
 *         "title": "Tokyo Ghoul",
 *         "poster": "UklGRlxiAABXRUJQVlA4IFBiAABwOgGdASoEAXIBPlEgjUSjoiErLPQtoWAKCWIAyBfoz0ff/ml7OXH/cH7o+8frT2t9xXZvl/",
 *         "banner": "https://animeflv.net/uploads/animes/banners/1415.jpg",
 *         "synopsis": "Extraños asesinatos se están sucediendo uno tras otro en Tokyo. Debido a las pruebas encontradas en las escenas, la policía concluye que los ataques son obra de ghouls que se comen a las personas. Kaneki y Hide, dos compañeros de clase, llegan a la conclusión de que si nadie ha visto nunca a esos necrófagos es porque toman la apariencia de seres humanos para ocultarse.\nPoco sabían entonces de que su teoría sería más cierta de lo que pensaban cuando Kaneki es herido de gravedad por un monstruo y comienza a atraerle cada vez más la carne humana…",
 *         "debut": "Finalizado",
 *         "type": "Anime",
 *         "rating": "4.5",
 *         "genres": [
 *           "accion",
 *           "drama",
 *           "misterio",
 *           "psicologico",
 *           "seinen",
 *           "sobrenatural",
 *           "terror"
 *         ],
 *         "episodes": [
 *           {
 *             "nextEpisodeDate": null
 *           },
 *           {
 *             "episode": 12,
 *             "id": "28800/tokyo-ghoul-12",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/1415/12/th_3.jpg"
 *           },
 *           {
 *             "episode": 11,
 *             "id": "28459/tokyo-ghoul-11",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/1415/11/th_3.jpg"
 *           },
 *           {
 *             "episode": 10,
 *             "id": "28001/tokyo-ghoul-10",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/1415/10/th_3.jpg"
 *           },
 *           {
 *             "episode": 9,
 *             "id": "27741/tokyo-ghoul-9",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/1415/9/th_3.jpg"
 *           },
 *           {
 *             "episode": 8,
 *             "id": "27092/tokyo-ghoul-8",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/1415/8/th_3.jpg"
 *           },
 *           {
 *             "episode": 7,
 *             "id": "26689/tokyo-ghoul-7",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/1415/7/th_3.jpg"
 *           },
 *           {
 *             "episode": 6,
 *             "id": "26529/tokyo-ghoul-6",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/1415/6/th_3.jpg"
 *           },
 *           {
 *             "episode": 5,
 *             "id": "26431/tokyo-ghoul-5",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/1415/5/th_3.jpg"
 *           },
 *           {
 *             "episode": 4,
 *             "id": "26373/tokyo-ghoul-4",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/1415/4/th_3.jpg"
 *           },
 *           {
 *             "episode": 3,
 *             "id": "26278/tokyo-ghoul-3",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/1415/3/th_3.jpg"
 *           },
 *           {
 *             "episode": 2,
 *             "id": "26188/tokyo-ghoul-2",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/1415/2/th_3.jpg"
 *           },
 *           {
 *             "episode": 1,
 *             "id": "26103/tokyo-ghoul-1",
 *             "imagePreview": "https://cdn.animeflv.net/screenshots/1415/1/th_3.jpg"
 *           }
 *         ],
 *         "moreInfo": [
 *           {
 *             "titleJapanese": "東京喰種-トーキョーグール-",
 *             "source": "Manga",
 *             "totalEpisodes": 12,
 *             "status": "Finished Airing",
 *             "aired": {
 *               "from": "2014-07-04T00:00:00+00:00",
 *               "to": "2014-09-19T00:00:00+00:00",
 *               "string": "Jul 4, 2014 to Sep 19, 2014"
 *             },
 *             "duration": "24 min per ep",
 *             "rank": 702,
 *             "popularity": 6,
 *             "members": 1386993,
 *             "favorites": 35890,
 *             "premiered": "Summer 2014",
 *             "broadcast": "Fridays at 00:00 (JST)",
 *             "producers": {
 *               "names": [
 *                 "Marvelous AQL",
 *                 "TC Entertainment",
 *                 "Shueisha"
 *               ]
 *             },
 *             "licensors": {
 *               "names": [
 *                 "Funimation"
 *               ]
 *             },
 *             "studios": {
 *               "names": [
 *                 "Studio Pierrot"
 *               ]
 *             },
 *             "openingThemes": [
 *               "\"unravel\" by TK from Ling Tosite Sigure (eps 2-11)"
 *             ],
 *             "endingThemes": [
 *               "\"unravel\" by TK from Ling Tosite Sigure (eps 1, 12)",
 *               "\"Seijatachi (聖者たち)\" by People In The Box (eps 2-11)"
 *             ]
 *           }
 *         ],
 *         "promoList": [
 *           {
 *             "title": "PV Madman ver.",
 *             "previewImage": "https://i.ytimg.com/vi/vGuQeQsoRgU/mqdefault.jpg",
 *             "videoURL": "https://www.youtube.com/embed/vGuQeQsoRgU?enablejsapi=1&wmode=opaque&autoplay=1"
 *           },
 *           {
 *             "title": "PV AnimeLab ver.",
 *             "previewImage": "https://i.ytimg.com/vi/ETHpMMV8rJU/mqdefault.jpg",
 *             "videoURL": "https://www.youtube.com/embed/ETHpMMV8rJU?enablejsapi=1&wmode=opaque&autoplay=1"
 *           }
 *         ],
 *         "charactersList": [
 *           {
 *             "character": {
 *               "id": 87275,
 *               "name": "Kaneki, Ken",
 *               "image": "https://cdn.myanimelist.net/images/characters/9/251339.jpg?s=788e4d76ff697c9ee67b65b68b6e8157",
 *               "role": "Main"
 *             }
 *           },
 *           {
 *             "character": {
 *               "id": 87277,
 *               "name": "Kirishima, Touka",
 *               "image": "https://cdn.myanimelist.net/images/characters/16/234699.jpg?s=10ef474344779135236911013b0925fc",
 *               "role": "Main"
 *             }
 *           },
 *           {
 *             "character": {
 *               "id": 113779,
 *               "name": "Abe, Maiko",
 *               "image": "https://cdn.myanimelist.net/images/characters/16/259779.jpg?s=67ed4d2dfb07359d050eb3a0ec91ca8d",
 *               "role": "Supporting"
 *             }
 *           },
 *           {
 *             "character": {
 *               "id": 99671,
 *               "name": "Amon, Koutarou",
 *               "image": "https://cdn.myanimelist.net/images/characters/13/251453.jpg?s=cf7bdc7cb409357d69720b0aee488ff6",
 *               "role": "Supporting"
 *             }
 *           },
 *           {
 *             "character": {
 *               "id": 111767,
 *               "name": "Arima, Kishou ",
 *               "image": "https://cdn.myanimelist.net/images/characters/5/257935.jpg?s=774409608456392dcaca31f53234bb53",
 *               "role": "Supporting"
 *             }
 *           },
 *           {
 *             "character": {
 *               "id": 112687,
 *               "name": "Banjou, Kazuichi",
 *               "image": "https://cdn.myanimelist.net/images/characters/8/258499.jpg?s=f4c8bd78f37677f38a47a8e28b8e7056",
 *               "role": "Supporting"
 *             }
 *           },
 *           {
 *             "character": {
 *               "id": 110241,
 *               "name": "Enji, Koma",
 *               "image": "https://cdn.myanimelist.net/images/characters/15/257941.jpg?s=f6702db6de1a2f2829577a566d3e43ce",
 *               "role": "Supporting"
 *             }
 *           },
 *           //.....
 *         ]
 *       }
 *     ]
 *   }
 */

router.get('/GetAnimeInfo/:id*/:title' , (req , res) =>{
  let id = req.params.id +'/'+ req.params.title;
  console.log(id);
  api.getAnimeInfo(id)
    .then(info =>{
      res.status(200).json(info);
      console.log(req.params.title)
    }).catch((err) =>{
      console.log(err);
    });
});

/**
 *  @api {get} /DownloadLinksByEpsId/:id Get Download URls list of the anime chapter.
 *  @apiVersion 1.0.5
 *  @apiName GetDownloadLinksByEpsId
 *  @apiGroup DownloadLinksByEpsId
 * 
 *  @apiSuccess {String} server     Server name
 *  @apiSuccess {String} url        Download URL
 * 
 *  @apiParam {String} id Episode id
 * 
 *  @apiParamExample {json} You will find the `id` of each chapter in the `episodes` property
 *  {
 *    "episodes": [
 *       {
 *         "nextEpisodeDate": null
 *       },
 *       {
 *         "episode": 12,
 *         "id": "28800/tokyo-ghoul-12",
 *         "imagePreview": "https://cdn.animeflv.net/screenshots/1415/12/th_3.jpg"
 *       },
 *        //......
 *     ]
 *  }
 * 
 *  @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *   "downloads": [
 *     {
 *       "server": "MEGA",
 *       "url": "https://mega.nz/#!55InSaxI!5JTxVNA29LCFNr7c1Fxg0PUBQPVQyXBo4aVF3e06jN0"
 *     },
 *     {
 *       "server": "Zippyshare",
 *       "url": "https://www61.zippyshare.com/d/4KKPr5XK/38775/1415_12.mp4"
 *     },
 *     {
 *       "server": "Openload",
 *       "url": "https://openload.co/f/sPXbBXnFikU/"
 *     }
 *   ]
 *  }
 */

router.get('/DownloadLinksByEpsId/:epsId([^/]+/[^/]+)' , (req , res) =>{
  let epsId = req.params.epsId;
  api.downloadLinksByEpsId(epsId)
    .then(downloads =>{
      res.status(200).json({
        downloads
      });
    }).catch((err) =>{
      console.log(err);
    });
});

module.exports = router;
