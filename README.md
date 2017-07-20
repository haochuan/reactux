reactux
=================
Ready-to-go template for React + Redux + Express App

Installation
------------

    npm install -g reactux
    
Usage
------------

    reactux [project name]
    // this will create a folder [project name] contains the template in current directory

Template Features
------------

- CLI to generate start files
- Fully support ES6 
- Dev and Production environment setting
- Reasonable file structure for both Frontend and Backend
- React Router v4 support
- Built-in Redux dev tools and middlewares 
- Express server with customization and configuration including auth, logger, cor 
- Tests Setup with [Jest](https://facebook.github.io/jest/)
- [eslint](http://eslint.org/) built-in with customized configuration
- Option to sync Redux store with LocalStorage 
- Deploy with pm2 

Project Stucture
------------

#### Frontend
- /src/react
  - action              -> action creators in redux
  - components          -> reusable components
  - constants           -> const 
  - containers          -> parent components
  - reducers            -> redux reducers
  - configureStore.js   -> redux store setup
  - index.html          -> html template
  - index.js            -> entry point
  - localStorage.js     -> setup sync between redux store and localStorage
  


#### Backend
- /src/server
  - config              -> server config like environment and database
  - middleware          -> custom express middleware
  - models              -> model used in database
  - routes              -> routes setup
  - app.js              -> main server app
  - index.js            -> entry point
  
#### Run Dev Server
webpack will move and compile `src/react` into `dist/react` and use `babel-node` to run express server

#### Run Production Server
webpack will move and compile `src/react` and `src/server` into `build/react` and `build/server` and use `node` to run express server

Development
------------

```
cd [your project]
yarn install // or npm install
yarn dev // or npm run dev
```

Test
------------

```
yarn test // or npm run test
```

Linting
------------

```
yarn lint // or npm run lin
```

Production
------------

```
yarn install
yarn production
```

Deploy with [PM2](https://github.com/Unitech/pm2)
------------

```
yarn install
yarn production
```

## License
Copyright (c) 2017 Haochuan Licensed under the MIT license.
