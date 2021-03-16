# Video Transfer App
Scenario:
`Client A` uploads video file into 1 mb chunks to `Server A`, via XMLHttpRequest.
`Server A` sends the chunks to `Server B`, via websocket connection.
`Server B` sends the chunks to `Client B`, also via websocket connection.
`Client B` can now watch the video.

## Steps to run this project:
### Run `Server A`
```
cd server\ a
npm install
node server.js
```

### Run `Server B`
```
cd server\ b
npm install
node server.js
```

After both servers are running, we can visit `localhost:4001/upload.html` to upload video file and visit `localhost:4002/viewer.html` to watch the video uploaded by `Client A`