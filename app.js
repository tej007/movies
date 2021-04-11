const express = require("express");
const app = express();
const { open } = require("sqlite");

const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
app.use = express.json();
module.exports = app;
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`Db Error:${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

const convertMovieDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

const convertDirectorDbObjectToResponseObject = (dbObject) => {
  return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  };
};

app.get("/movies/", async (request, response) => {
  const movieQuery = `
    SELECT * FROM movie;
    `;
  const movieArray = await db.all(movieQuery);
  respond.send(
    movieArray.map((eachMovie) => {
      movieName: eachMovie.movie_name,
    })
  );
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const addMovieQuery = `
    INSERT INTO movie (director_id, movie_name, lead_actor)
    VALUES (
        ${directorId},${movieName},${leadActor}
    );
    `;
  await db.run(addMovieQuery);
  respond.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT *
    FROM movie
    WHERE movie_id=${movieId}
    `;
  const getMovieArray = await db.run(getMovieQuery);
  response.send(convertDirectorDbObjectToResponseObject(getMovieArray));
});

app.put("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const updateMovieQuery = `
    UPDATE movie 
    SET 
    director_id = ${directorId},
    movie_name = '${movieName}',
    lead_actor = '${leadActor}'
    WHERE
    movie_id = ${movieId}
        

    `;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    DELETE 
    FROM movie
    WHERE
    movie_id = ${movieId}
    `;
  await db.run(deleteMovieQuery);
  respond.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const getDirectorQuery = `
    SELECT
    * FROM
    director;
    `;
  const directorArray = await db.all(getDirectorQuery);
  response.send(
    directorArray.map((eacDirector) =>
      convertDirectorDbObjectToResponseObject(eachDirector)
    )
  );
});

app.get("/directors/:directorId/movies/", (request, response) => {
    const {directorId} = request.body 
    const getDirectorMovies=`
    SELECT movie_name
    FROM movie 
    WHERE director_id = ${directorId}

    `;
    const directorMovie = await db.all(getDirectorMovies)
    respond.send(directorMovie.map((eachDirector)=>{
        movieName:eachDirector.movie_name
    }))
});

module.exports=app