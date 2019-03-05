# GraphQL News
This repository serves as the monorepo codebase for the GraphQL News API & Client built in the [GraphQL in Motion](https://www.manning.com/livevideo/graphql-in-motion) video course. Every line of code written throughout the course that does not contain sensitive deployment information lives in this repository.

### Codebase 
**Full-stack JavaScript:** This repository is comprised of two main components. The API, written in Node.js, and the client, written in React. Almost all of the code you'll touch in this codebase will be JavaScript, aside from the SCSS used for styling.  

**Folder Structure**
```
graphql-news/
├── src/            # Source for the frontend SPA and server
│   ├── components  # Reusable React components for the frontend
│   ├── screens     # React component views for the frontend
│   ├── scss        # Source for component/view styles for the frontend
│   ├── server      # API server
└── public          # Public files used on the frontend
```

### First time setup
The first step to running GraphQL News locally is by downloading and cloning the repository:
```
git clone git@github.com:graphql-in-motion/graphql-news.git
```
If you recieve a `Permission denied` error using `ssh`, please refer [here](https://help.github.com/en/articles/error-permission-denied-publickey), or use the `https` link as a fallback.
```
git clonse https://github.com/graphql-in-motion/graphql-news.git
``` 
**Installation** 
1. **Install MongoDB:** See [the MongoDB documentation](https://docs.mongodb.com/manual/installation/) for instructions on installing it on your system's OS.
2. **Install yarn:** We use [yarn](https://yarnpkg.com/en/) to handle our JavaScript dependencies.
```
npm i -g yarn
```
3. **Install the dependencies:**
```
yarn install
```

### Running the app locally
**Background Services**  
Whenever you want to run the GraphQL News client locally, you'll have to have MongoDB running in the background.
```
mongod
```
**Start the server**
Depending on what you'd like to do, you have two options for running the server. You can start the server in development mode by running `yarn run dev:server`. No matter what your doing though, you'll need the API running in the background, which can be achieved by running
```
yarn start:server
```
**Develop the client UI**  
To develop the frontend and run app in development mode (see [the Create React App documentation](https://github.com/facebook/create-react-app) for more info) run
```
yarn dev:web
```
> Note: If something didn't work or you ran into troubles please submit PRs to improve this doc and keep it up to date!
