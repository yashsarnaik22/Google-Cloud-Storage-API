function getImageUniqueId(){
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => 
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
}

document.getElementById("submitBtn").addEventListener("click", () => {
    
    let postid = getImageUniqueId();
    let inputElem = document.getElementById('imgfile');
    let file = inputElem.files[0];


    let blob = file.slice(0, file.size, "image/jpeg")
    newFile = new File([blob], postid + ".jpeg", { type : "image/jpeg"});
    console.log(newFile);
    let formData = new FormData();
    formData.append("imgfile", newFile);


    fetch("/upload",{
        method : "POST",
        body : formData,
    })
    .then(res => res.text())
    .then(loadPosts());
    document.getElementById("publicurl").innerHTML = "https://storage.googleapis.com/gccp_bucket_1/" + postid + ".jpeg";
});

    function loadPosts(){
        fetch("/upload")
            .then((res) => res.json())
            .then((x) =>{
                for(y = 0; y < x[0].length; y++){
                    console.log(x[0][y]);
                    const newimg = document.createElement("img");
                    newimg.setAttribute(
                        "src",
                        "https://storage.googleapis.com/gccp_bucket_1/" + x[0][y].id
                    );
                    newimg.setAttribute("widht", 50);
                    newimg.setAttribute("height", 50);
                    // document.getElementById("publicurl").innerHTML = 
                            // "https://storage.googleapis.com/gccp_bucket_1/" + x[0][y].id;
                    // document.getElementById("images").appendChild(newimg);
                    // document.getElementById("publicurl").innerHTML = "https://storage.googleapis.com/gccp_bucket_1/" 
                    // + postid;
                }
            });
    }

    