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
| GET      | ```/api/my/info```                         | N/A                                   | Gets the users' information               |
| GET      | ```/api/users```                           |  __*IsAdmin!*__                       | Gets ALL users                            |
| GET      | ```/api/movie/:id```                       | N/A                                   | Gets a specific movie                     |
| GET      | ```/api/movies```                          | N/A                                   | Gets a ALL movies                         |
| GET      | ```/api/my/favourites```                   | N/A                                   | Gets the users' favourites                |
| POST     | ```/api/my/favourites/:id```               | Movie id                              | Adds the object to the users' favourites  |
| POST     | ```/api/signup```                          | A User object                         | Creates a new user                        |
| POST     | ```/api/login```                           | A User object                         | Logs a user in                            |
| POST     | ```/api/logout```                          | N/A                                   | Logs a user out                           |
| PUT      | ```/api/my/update```                       | A User object                         | Updates a user                            |
| PUT      | ```/api/movie/:id```                       | A modified full movie object to update| Updates the given movie                   |
