import mongo_movie from "./movie";
import dynamo_movie from "./dynamo_movie";
import config from "../config/config";

function insertTestDB() {
  try {
    if (config.select == "mongo") {
      return mongo_movie.insertTestDB();
    } else if (config.select == "dynamo") {
      return dynamo_movie.insertTestDB();
    } else {
      throw err;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function deleteAll() {
  try {
    if (config.select == "mongo") {
      return await mongo_movie.deleteAll();
    } else if (config.select == "dynamo") {
      return await dynamo_movie.deleteAll();
    } else {
      throw err;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function setDatabase(flag) {
  try {
    if (flag == 0) {
      config.select = "mongo";
      return "Set Database as MongoDB";
    } else if (flag == 1) {
      config.select = "dynamo";
      return "Set Database as DynamoDB";
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function searchMovie(id, title, score, orderby, curpage, perpage, err) {
  try {
    if (config.select == "mongo") {
      return await mongo_movie.searchMovie(
        id,
        title,
        score,
        orderby,
        curpage,
        perpage,
        err
      );
    } else if (config.select == "dynamo") {
      return await dynamo_movie.searchMovie(
        id,
        title,
        score,
        orderby,
        curpage,
        perpage,
        err
      );
    } else {
      throw err;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function addMovie(title, score) {
  try {
    if (config.select == "mongo") {
      return await mongo_movie.addMovie(title, score);
    } else if (config.select == "dynamo") {
      return await dynamo_movie.addMovie(title, score);
    } else {
      throw err;
    }
  } catch (err) {
    console.log(err);
  }
}

async function updateMovie(title, score) {
  try {
    if (config.select == "mongo") {
      return await mongo_movie.updateMovie(title, score);
    } else if (config.select == "dynamo") {
      return await dynamo_movie.updateMovie(title, score);
    } else {
      throw err;
    }
  } catch (err) {
    console.log(err);
  }
}

async function deleteMovie(title) {
  try {
    if (config.select == "mongo") {
      return await mongo_movie.deleteMovie(title);
    } else if (config.select == "dynamo") {
      return await dynamo_movie.deleteMovie(title);
    } else {
      throw err;
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  insertTestDB,
  deleteAll,
  setDatabase,
  searchMovie,
  addMovie,
  updateMovie,
  deleteMovie,
};
