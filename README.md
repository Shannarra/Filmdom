# Filmdom
University Web API development exam project.

# What?
It's an API backend for a movie database.

# Why?
It was the simples project we could think of.

# Endpoints
> Subject to change in the process of development.  

| Method   | Endpoint                                   | Requirements                          | Description                               |
|----------|--------------------------------------------|---------------------------------------|-----------------------                    |
| `GET   `   | ```/api/my/info```                     * | N/A                                   | Gets the users' information               |
| `GET   `   | ```/api/users```                       * |  __*IsAdmin!*__                       | Gets ALL users                            |
| `GET   `   | ```/api/movie/:id```                     | N/A                                   | Gets a specific movie                     |
| `GET   `   | ```/api/movies```                        | N/A                                   | Gets a ALL movies                         |
| `GET   `   | ```/api/my/favourites```               * | N/A                                   | Gets the users' favourites                |
| `PUT   `   | ```/api/my/update```                   * | A User object                         | Updates a user                            |
| `PUT   `   | ```/api/movie/update/:id```            * | A modified full movie object to update| Updates the given movie                   |
| `POST  `   | ```/api/login```                         | A User object                         | Logs a user in                            |
| `POST  `   | ```/api/signup```                        | A User object                         | Creates a new user                        |
| `POST  `   | ```/api/logout```                        | N/A                                   | Logs a user out                           |
| `POST  `   | ```/api/my/favourites/add/:id```       * | Movie id                              | Adds the object to the users' favourites  |
| `POST  `   | ```/api/movie/create```                * | Movie id                              | Adds the object to the users' favourites  |
| `DELETE`   | ```/api/my/favouites/delete/:id```     * | Movie id                              | Removes the movie from favourites 	    |
| `DELETE`   | ```/api/my/favouites/```               * | N/A                                   | Removes ALL user's favourites      	    |
| `DELETE`   | ```/api/movie/:id```                   * | Movie id && __*IsAdmin!*__            | Deletes the movie from the database  	    |

> ## The routes marked with * require a used to be signed in!