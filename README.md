# VK Promo Application

Simple project based on VK Mini Apps platform, fueled by Typescript.
In this project I tried myself in complete development of web application, front/back/db. Of course it's not ideal,
but mostly I would say that this is how my code looks like at the moment (end of 2019 year). Of course, I'll use this
repository to track my progress in future.

I've fully configured Webpack/Typescript/TSLint/Prettier, developed Docker images and Docker compose configurations for it, and,
of course, I've written all the code

## Built with

* React.js
* Express.js
* Typescript
* Webpack
* Docker, Docker Compose
* Prettier, TSLint
* Sqlite3

## Contributing

Please, don't hesitate to take a look at my code, especially if you are qualified software engineer, I would really appreciate if you tell me
which of my design solutions was not optimal, what should be changed, and what could be done better.

So please **do ping me**, you can raise an issue with recommendations, so I can track all the progress directly here.

## Decision making

- Tried to use webpack from scratch to find out how it works and how to configure it by my needs
- Typescipt is chosen as flexible extension of Javascript, with sophisticated typing, which I'm interested in
- React as one of most popular web frameworks, and also it's required by VK Mini Apps platform (Vk-Ui framework),
  also I used hooks, as new approach for me.
- Docker I tried to investiate, learn and experiement, I have yet to check on how it will go on deployment ;)
- Serverside is stateless, and authenticates user using custom headers, that are taken from clientside (some parameters
  are passed via query to application from Vk itself, some of them are received using Vk Api). This is where I did few
  experiments with Express and wrote custom middlewares to restrict access to some areas and extract this parameters
  from headers.
- Database - Sqlite3, I have not much experience with databases, so I took some tiny solution, tried to bound it inside
  an interface so I will be able to easilly switch to another implementation if something will be need to be changed.
- Not exactly RESTfull API -- API endpoints should match some other patterns, but because of custom HTTP headers I use,
  I've came up with splitting into user/admin sections, and taking some parameters from headers itself.
- Security - As I understand all things that are stored on Client can be faked by attackers, so if user have no valid
  sign with parameters received from Vk he will not get access to admin endpoints, besides all validation of requirement
  (repost and membership in community) are validated on server. Oh and I believe I've eliminated the possibility of SQL injection

## Getting Started

First of all `.env` file is required. There you should specify VK secret key of application, and some other options,
check `.env.template` for more information.

The repository has Makefile, that already contains commands to bringup Docker images for development and production.

```bash
#!/bin/bash

make dev # start development server
make prod # builds and starts production image
make clean # teardowns dev and prod Docker instances

```

## Tests

Tests are not yet implemented (but I hope they will be...).

## Authors

* **Egor Blagov** - *All work* - [github](https://github.com/EgorBlagov), [mail](mailto:e.m.blagov@gmail.com)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
