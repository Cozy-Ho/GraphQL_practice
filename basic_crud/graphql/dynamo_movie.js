import Movie from "../models/dynamo_movies";
import { v4 as uuidv4 } from "uuid";

function order(movies, orderby) {
  // order
  let movie_arr = movies.toJSON();
  let key = Object.getOwnPropertyNames(orderby);
  let order = orderby[key[0]];
  key = key[0];
  if (order == "asc") {
    movies = movie_arr.sort((a, b) => (a[key] > b[key] ? 1 : -1));
  } else {
    movies = movie_arr.sort((a, b) => (a[key] > b[key] ? -1 : 1));
  }
  return movies;
}

function page(movies, pagination) {
  // console.log(movies);
  let max;
  let movie_arr;
  const curpage = pagination.curpage;
  const perpage = pagination.perpage;

  if (movies.hasOwnProperty("toJSON")) {
    movie_arr = movies.toJSON();
    max = movies.count;
  } else {
    // json으로 변경되어 들어올 경우, movie_arr에 count속성이 없다..
    // 이거때문에 하루 날린듯? 잘하자!
    movie_arr = movies;
    max = movies.length;
  }
  let tot_page;
  if (max % perpage != 0) {
    tot_page = parseInt(max / perpage) + 1;
  } else {
    tot_page = max / perpage;
  }
  console.log(movie_arr);

  let offset = (curpage - 1) * perpage;
  // console.log(movie_arry);
  if (curpage <= tot_page) {
    movies = movie_arr.slice(offset, offset + perpage);
  } else {
    movies = [];
  }
  return movies;
}
// title, score, watched, desc, orderby, curpage, perpage, err
async function searchMovie(args) {
  try {
    let movies;
    if (args.search) {
      // 1. search
      // movies = await Movie.scan(args.search).exec();
      let key = Object.getOwnPropertyNames(args.search);
      console.log(key);

      if (args.search.andor == "and" || args.search.andor == null) {
        movies = await Movie.query("dumy").eq(1);
        if (key.includes("title")) {
          movies = movies.where("title").eq(args.search.title);
        }
        if (key.includes("score")) {
          movies = movies.and().where("score").eq(args.search.score);
        }
        if (key.includes("desc")) {
          movies = movies.and().where("desc").eq(args.search.desc);
        }
        if (key.includes("watched")) {
          movies = movies.and().where("watched").eq(args.search.watched);
        }
        if (key.includes("info")) {
          let info_key = Object.getOwnPropertyNames(args.search["info"]);
          console.log(info_key);
          if (info_key.includes("lang")) {
            movies = movies.and().where("info.lang").eq(args.search.info.lang);
          }
          if (info_key.includes("subtitle")) {
            movies = movies
              .and()
              .where("info.subtitle")
              .eq(args.search.info.subtitle);
          }
          if (info_key.includes("dubbing")) {
            movies = movies
              .and()
              .where("info.dubbing")
              .eq(args.search.info.dubbing);
          }
        }
      } else if (args.search.andor == "or") {
        movies = await Movie.query("dumy")
          .eq(1)
          .and()
          .parenthesis((condition) => {
            if (key.includes("title")) {
              condition = condition.or().where("title").eq(args.search.title);
            }
            if (key.includes("score")) {
              condition = condition.or().where("score").eq(args.search.score);
            }
            if (key.includes("desc")) {
              condition = condition.or().where("desc").eq(args.search.desc);
            }
            if (key.includes("watched")) {
              condition = condition
                .or()
                .where("watched")
                .eq(args.search.watched);
            }
            if (key.includes("info")) {
              let info_key = Object.getOwnPropertyNames(args.search["info"]);
              console.log(info_key);
              if (info_key.includes("lang")) {
                condition = condition
                  .or()
                  .where("info.lang")
                  .eq(args.search.info.lang);
              }
              if (info_key.includes("subtitle")) {
                condition = condition
                  .or()
                  .where("info.subtitle")
                  .eq(args.search.info.subtitle);
              }
              if (info_key.includes("dubbing")) {
                condition = condition
                  .or()
                  .where("info.dubbing")
                  .eq(args.search.info.dubbing);
              }
            }
            return condition;
          });
      }
      movies = await movies.exec();

      // 2. search + sort + page
      if (args.orderby != null && args.pagination != null) {
        movies = await order(movies, args.orderby);

        movies = await page(movies, args.pagination);
      } else if (args.orderby) {
        // 3. search + sort
        movies = await order(movies, args.orderby);
      } else if (args.pagination) {
        // 4. search + page
        movies = await page(movies, args.pagination);
      }
    } else if (args.orderby) {
      // 5. sort
      movies = await Movie.scan({}).exec();
      movies = order(movies, args.orderby);
      // 6. sort + page
      if (args.pagination) {
        movies = page(movies, args.pagination);
      }
    } else if (args.pagination) {
      // 7. page
      movies = await Movie.scan({}).exec();
      movies = page(movies, args.pagination);
    } else {
      movies = await Movie.scan({}).exec();
      console.log(movies);
    }
    return movies;
  } catch (err) {
    console.log(err);
  }
}

async function getMovie(id) {
  let movies;
  try {
    movies = await Movie.get({ dumy: 1, id: id });
    console.log(movies);
    return movies;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function createMovie(args) {
  const info = args.info;

  try {
    const result = await Movie.create({
      dumy: 1,
      id: uuidv4(),
      title: args.title,
      desc: args.desc || "",
      score: args.score || 0,
      watched: args.watched || false,
      info: info,
    });
    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function removeMovie(id) {
  try {
    await Movie.delete({ id: id });
    return "삭제 완료";
  } catch (err) {
    console.log(err);
    return "삭제 실패! 에러가 발생했습니다.";
  }
}

async function updateMovie(args) {
  const origin = await Movie.get({ id: args.id });
  console.log(origin);
  const update_query = {
    title: args.title || origin.title,
    score: args.score || origin.score,
    desc: args.desc || origin.desc,
    watched: args.watched || origin.watched,
    info: args.info || origin.info,
  };
  try {
    const result = await Movie.update({ id: args.id }, update_query);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  getMovie,
  searchMovie,
  createMovie,
  removeMovie,
  updateMovie,
};
