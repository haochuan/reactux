reactux
=================
Ready-to-go template for React + Redux application
BY _haochuan(haochuan.liu@gmail.com)

Installation
------------

    npm install -g reactux
    
Usage
------------

    reactux [project name]
    // this will create a folder [project name] contains the template in current directory

About the Template
------------

- CLI to generate start files
- Fully support ES6 
- Reasonable file structure for React and Redux
- React Router support
- Built-in Redux dev tools and middlewares 
- Full webpack setup for dev and production environment, including compiling JSX, eslint, different loaders, CSS module, Hot Module Reload, copying dependencies, building and deploying
- Express server with customization and configuration including auth, logger, cor 
- Components and Reducer tests Setup with ava, enzyme and sinon
- App store sync with LocalStorage 
- Nested React Router Setting
- Deploy with pm2 

Development
------------

```
npm install
npm run dev
```

- run test: `npm run test`
- lint: `npm run lint`

Production
------------

```
npm install --production
npm run build
npm run production
```