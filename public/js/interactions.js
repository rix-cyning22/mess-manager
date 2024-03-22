const postAnnouncement = (ev) => {
    ev.preventDefault();
    const announce = document.querySelector("textarea");
    const announceText = announce.value;
    announce.value = "";
    if (announceText != "") {
        fetch("/admin/post-announcement", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({announcement: announceText})
        })
        .then(res => {
            if (res.ok)
                return res.json();
            else
                console.log("error receiving data");
        })
        .then(data => {
            const post = document.createElement("div")
            post.innerHTML = `<div class="post-action post-meta" id="post-meta"><p>${data.posterName}</p><p id="post-timestamp">${data.timestamp}</p></div><p id="post-content">${data.description}</p><div class="post-action post-meta"><button onclick="editAnnouncement(this)">EDIT</button></div>`;
            post.classList.add("post");
            const postContainer = document.querySelector("#post-container");
            postContainer.appendChild(post);
        })
        .catch(err => console.log(err)) 
    }
}
const announceForm = document.querySelector("form");
announceForm.addEventListener("submit", postAnnouncement);

const editAnnouncement = (postButton) => {
    const post = postButton.parentElement.parentElement;
    const postText = post.querySelector("#post-content");
    const postTime = post.querySelector("#post-timestamp");
    const textEditor = announceForm.querySelector("textarea");
    textEditor.value = postText.innerText;
    const postSaver = announceForm.querySelector("button");
    postSaver.innerText = "SAVE";
    post.style = "border: 3px solid #000363;";

    announceForm.removeEventListener("submit", postAnnouncement);
    const editAnnouncementHandler =  ev => {
        ev.preventDefault();
        if (textEditor.value.trim() != postText.innerText)
            fetch("/admin/edit-announcement", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    editText: textEditor.value,
                    timestamp: postTime.innerText
                })
            })
            .then(res => {
                if (res.ok)
                    return res.json();
                else 
                    throw new Error("Error editting!")
            })
            .then(resData => {
                postText.innerText = resData.postText;
                var edition = post.querySelector("#editted");
                if (!edition)
                    edition = document.createElement("div");
                edition.innerText = `(editted at ${resData.editTime})`; 
                edition.id = "editted";
                post.querySelector("#post-meta").appendChild(edition);
                post.style = "border: none";
                textEditor.value = "";
            })
            .then(() => {
                announceForm.removeEventListener("submit", editAnnouncementHandler);
                announceForm.addEventListener("submit", postAnnouncement);
                postSaver.innerText = "POST";
            })
            .catch(err => console.log(err));
        }
    announceForm.addEventListener("submit", editAnnouncementHandler);
}

