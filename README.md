# Video Transfer App
Scenario:
`Client A` uploads video file into 1 mb chunks to `Server A`, via XMLHttpRequest.  
`Server A` sends the chunks to `Server B`, via websocket connection.  
`Server B` sends the chunks to `Client B` and `Client C`, also via websocket connection.  
`Client B` and `Client C` can now watch the video.

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

After both servers are running, we can visit `localhost:4001/upload.html` to upload a video and we can have two users visit `localhost:4002/viewer.html` to watch the uploaded video.  
Note: you can always set more users to join the socket room. For now, I set it to maximum 2 users.  

Thank you.
