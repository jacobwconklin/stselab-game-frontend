# Front-End Demo Deployment to Azure
Currently deployed and available at:
https://stselab-games.azurewebsites.net/

# How to Deploy Changes to Live URL:

0) Make sure Git versioning is up to date. First pull any changes from other contributors using the command:
```
git pull
```
Then use VS Code to save all of your changes to github after testing everything still works locally. Even if you are the sole contributor on the project saving to GitHub is important to back up the code and be able to revert to a working version if anything breaks. 

1) Update build by running:
```
npm run build
```

2) Then compress all of the files int the 'build' folder into a zip file,

3) Then navigating to https://stselab-games.scm.azurewebsites.net/DebugConsole,

4) Then navigate into site, and then wwwroot, and then drag and drop the zip file onto the screen where the message, unzip appears.

5) Push all changes to github so that the github code will match the deployed code. Can use VS code or terminal commands.

Viola. Visit the deployed url to see the changes (May take a few minutes and you may have the old version cached, hold shift and click refresh to do a hard refresh)

# Running project locally:

Pull any changes from the repository first to avoid merge conflicts (unless you are the sole contributor, but even then it is best practice)
```
git pull
```

To run locally for the first time you must have node installed. first run: 
```
npm i
```

Then you can run the following to run the server locally in development mode. All subsequent times that
you would like to run the code you do not need to npm i again, unless new packages have been added. Running npm i is harmless so
you may run it each time, or you can simply run this command:
```
npm run start
```

You will NEED to run the backend locally as well, or go into Api.ts and change the value returned in the 
function 'getBackendUrl' to be the hosted backend if you do not wish to run the backend locally too. 

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
