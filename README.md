<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

# Transaction Api

This project was made to transfer money to someone registered in the database


## Routes
    
## Users route ->
#### description
- You can register your own account giving your username and a valid password!
Note: your username is unique in our database.

-   ### POST: localhost:5000/users/create
    - access this endpoint givin your infos to create your account
    Note: when created, we'll automatically create your account with balance = 100
-   ### GET: localhost:5000/users
    - access this endpoint to see all users registered in our database 
    Note: this route is authenticated you have to login first and give us your token

-   ### GET: localhost:5000/users/<id>
    - access this endpoint to see an especific user registered in our database 
    Note: this route is authenticated you have to login first and give us your token

-   ### DELETE: localhost:5000/users/<id>
    - access this endpoint to DELETE YOUR USER registered in our database 
    Note: this route is authenticated you have to login first and give us your token

-   ### PATCH: localhost:5000/users/<id>
    - access this endpoint to UPDATE YOUR USER registered in our database 
    Note: this route is authenticated you have to login first and give us your token
## Account route ->
#### description
- You can made transactions with your account, it started with balance = 100!
Note: All routes are protected with authentication, you must login and give us your token 

-   ### POST: localhost:5000/account/create
    - #### this endpoint are no implemented yet, once your account are automatically created

-   ### GET: localhost:5000/account
    - access this endpoint to see all users registered in our database 
    Note: this route is private you can't access with a normal token

-   ### GET: localhost:5000/account/balance
    - access this endpoint to see the account balance from your token 
    Note: this route is authenticated you have to login first and give us your token

-   ### GET: localhost:5000/account/<id>
    - access this endpoint to see the account from your token 
    Note: this route is authenticated you have to login first and give us your token

## Transactions route ->
#### description
- You can made transfers and see them with this route!
Note: All routes are protected with authentication, you must login and give us your token 

-   ### POST: localhost:5000/transactions
    - #### access this endpoint to transfer to someone, you have to give a body containing the username of account you want to transfer and how much money you want to transfer
    Note: this route is authenticated you have to login first and give us your token
    ###
    Example: 
    ####
        {
            "value": 50,
            "usernameToCredit": "username3"
        }
    ###
-   ### GET: localhost:5000/transactions
    - Access this endpoint to see all transactions made that you have access(your cash-in and cash-out transactions)
    - This route accept some query params like ->
        - cash-out ex: true
        - cash-in ex: true
        - date ex: mm/dd/yyyy 
        - examples 
            - localhost:5000/transactions?cash-in=true&date=11-21-2022
            - localhost:5000/transactions?date=11-21-2022
            - localhost:5000/transactions?cash-in=true&cash-out=true&date=11-21-2022

    Note: this route is authenticated you have to login first and give us your token

## Installation 

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
### You also can do this with docker
```bash
$ docker-compopose up --build
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
