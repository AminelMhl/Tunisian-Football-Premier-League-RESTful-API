<h1 align="center">
   Tunisian Football Premier League RESTful API
</h1>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description

This project is a RESTful API for the Tunisian Football Premier League, built using the [NestJS](https://github.com/nestjs/nest) framework. It provides functionalities to manage teams, players, matches, and standings in the league. The API is designed to be efficient, scalable, and easy to use.

## Features

- **User Authentication**: Secure user registration and login using JWT and Google OAuth.
- **Team Management**: Read teams.
- **Player Management**: Check players associated with teams.
- **Match Management**: Record and retrieve match details, including scores and participating teams.
- **Standings**: Fetch and update league standings based on match results.
- **Fantasy League**: Create and manage fantasy teams, including adding/removing players and tracking points.
- **External Football Api**: Update data in realtime.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient server-side applications.
- **TypeScript**: A superset of JavaScript that compiles to plain JavaScript.
- **Prisma**: An ORM for Node.js and TypeScript that simplifies database access.
- **PostgreSQL**: A powerful, open-source relational database system.
- **JWT**: JSON Web Tokens for secure authentication.
- **Google OAuth**: For third-party authentication.
- **Axios**: For making HTTP requests to external APIs.

## Project setup

```
$ npm install
```

## Compile and run the project

```
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Mohamed Amine Soltana](https://github.com/AminelMhl)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).