# Archifiltre statistics

Archifiltre statistics provides statistics about several Archifiltre metrics. The data comes from our app and website (via Matomo), GitHub and YouTube. We rely on Node.js, Express and TypeScript.

## Launch the app

First, create a `.env` file based on `.env.example`. You will need API keys for YouTube, GitHub and Matomo.

Then, to install the project's dependencies, run the following command:
```
yarn
```

Finally, use the following command to run the app:
```
yarn start
```

By default, the server will run on `localhost:3000`

## Run tests

To run the tests, use the following command:
```
yarn test
```

## Run linter

To run the linter, use the following command:
```
yarn lint
```
