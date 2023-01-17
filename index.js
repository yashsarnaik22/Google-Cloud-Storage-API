const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const src = path.join(__dirname,"views")
app.use(express.static(src));

const multer = Multer({
    storage : Multer.memoryStorage(),
    limits : {
        fileSize : 10 * 1024 * 1024, //file size limit 10MB
    },
});

let projectId = 'gccp-project-372105' //ffff
let keyFilename = 'gccpserviceaccount.json' //ffdd
const storage = new Storage({
    projectId,
    keyFilename,
});
const bucket = storage.bucket('gccp_bucket_1') //to be defined


app.get('/upload',async(req,res) => {
    try{
        const [files] = await bucket.getFiles();
        res.send([files]);
        console.log("success");
    }catch (error){
        res.send("Error:" + error);
    }
    
});

app.post('/upload', multer.single('imgfile'), (req,res) => {
        console.log('Made it /upload')
    try {
        if(req.file){
            console.log("File found, trying to upload...")
            const blob = bucket.file(req.file.originalname);
            // document.getElementById("publicurl").innerHTML = "https://storage.googleapis.com/gccp_bucket_1/" 
            //             +file.originalname + "%5Bobject%20HTMLInputElement%5D"
                
            const blobStream = blob.createWriteStream();

            blobStream.on('finish', () => {
                res.status(200).send('Success');
                console.log('Success');
            });
            blobStream.end(req.file.buffer);
        } else throw "error with img";
    } catch(error){
      res.status(500).send(error)  
    }
} );

app.get("/", (req, res) => {
    res.sendFile(src + "/index.html");
});

app.listen(port, () => {
    console.log('Server started on port', port );
});