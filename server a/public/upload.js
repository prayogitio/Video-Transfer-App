const input = document.querySelector('#video-file');
const url = 'http://localhost:4001/upload';
var chunkCounter = 0;
const chunkSize = 1000000;
var videoId = '';

input.addEventListener('change', () => {
    const file = input.files[0];
    const filename = input.files[0].name;
    var numberOfChunks = Math.ceil(file.size/chunkSize);
    document.getElementById("video-information").innerHTML = "There will be " + numberOfChunks + " chunks uploaded.";
    var start = 0;
    chunkCounter = 0;
    videoId = '';
    var chunkEnd = start + chunkSize;
    createChunk(videoId, start, chunkEnd);

    function createChunk(videoId, start, chunkEnd) {
        chunkCounter++;
        chunkEnd = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, chunkEnd);
        const chunkForm = new FormData();
        if (videoId.length > 0) {
            chunkForm.append('videoId', videoId);
        }
        chunkForm.append('file', chunk, filename);
        uploadChunk(chunkForm, start, chunkEnd);
    }
    
    function uploadChunk(chunkForm, start, chunkEnd) {
        var oReq = new XMLHttpRequest();
        oReq.upload.addEventListener("progress", updateProgress);
        oReq.open("POST", url, true);
        var blobEnd = chunkEnd-1;
        var contentRange = "bytes "+ start+"-"+ blobEnd+"/"+file.size;
        oReq.setRequestHeader("Content-Range",contentRange);
        console.log("Content-Range", contentRange);
        function updateProgress (oEvent) {
            if (oEvent.lengthComputable) {  
                var percentComplete = Math.round(oEvent.loaded / oEvent.total * 100);
                var totalPercentComplete = Math.round((chunkCounter -1)/numberOfChunks*100 +percentComplete/numberOfChunks);
                document.getElementById("chunk-information").innerHTML = "Chunk # " + chunkCounter + " is " + percentComplete + "% uploaded. Total uploaded: " + totalPercentComplete +"%";
            } else {
                console.log ("not computable");
            }
        }
        oReq.onload = function (oEvent) {
            console.log("uploaded chunk");
            console.log("oReq.response", oReq.response);
            var resp = JSON.parse(oReq.response)
            videoId = resp.videoId;
            console.log("videoId", videoId);
            start += chunkSize;
            if (start<file.size) {
                createChunk(videoId, start);
            } else {
                console.log("all video segments uploaded!") ;
                document.getElementById("video-information").innerHTML = "all uploaded! client b should be able to watch the video!";
            }       
        };
        oReq.send(chunkForm);
    }
});
