const fs = require('fs');
const got = require('got');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const postclass = require("./src/Post.js");
const Post = postclass.Post;
const calibre_lib = require("node-calibre");

const threadURL = "https://7chan.org/elit/res/26149.html";
const authorTrip = "!T1tXaJv9os";
const useUnofficialTitles = true;

console.log(`Downloading ${threadURL}...`);
got(threadURL).then(async response => {
    console.log("Processing response...");
    //create the JSDOM object; this part takes a moment
    const document = (new JSDOM(response.body)).window.document;

    //Separate into individual posts and begin processing
    const postNodes = document.getElementsByClassName("post");
    const posts = [...postNodes].map(p => new Post(p));
    console.log(`Found ${posts.length} posts...`);
    
    //Get posts by OP by checking for tripcode
    OP = posts.filter(p => p.postertrip == authorTrip);
    console.log(`Found ${OP.length} posts by OP${authorTrip}...`);

    //Filter out posts which are too short or have backlinks (eg >>42777) in the middle
    const chapters = OP.filter(p => p.length > 10000 && !p.hasMidBacklinks());
    console.log(`Found ${chapters.length} chapters...`);

    //Load unofficial titles
    let titles = null;
    if (useUnofficialTitles) {
        titles = JSON.parse(fs.readFileSync('./src/chapter-titles.json'));
    }

    //Lay out full story html and join it to a string
    const fullStory = ["<h1>Hiraeth</h1>"];
    for (i = 0; i < chapters.length; i++) {
        const title = useUnofficialTitles  && titles[i+1] ? 
            `Chapter ${i+1}: ${titles[i+1]}` :
            `Chapter ${i+1}`
        fullStory.push(`\n<div class="chapter"><h2>${title}</h2>`);
        fullStory.push(chapters[i].formattedMessage());
        fullStory.push(`</div>`)
    }
    const storyHTML = fullStory.join("\n");

    //Write the HTML file
    console.log("Writing story to ./output/Hiraeth.html");
    fs.writeFileSync("./output/Hiraeth.html", storyHTML);

    //Creating ebook
    console.log("Creating ebook with Calibre at ./output/Hiraeth.mobi");
    const calibre = new calibre_lib.Calibre();
    await calibre.ebookConvert("./output/Hiraeth.html", "mobi", {
        "max-levels": 0
    }).then(()=>    
        console.log("done.")
    ).catch(err => {
        console.log(err);
        console.warn("Error during ebook generation. If the file was not generated, " + 
            "you may have to run the command manually:")
        console.warn("ebook-convert ./output/Hiraeth.html ./output/Hiraeth.mobi")
        console.warn("(or use calibre's gui)")
    })

    console.log("Creating ebook with Calibre at ./output/Hiraeth.epub");
    await calibre.ebookConvert("./output/Hiraeth.html", "epub", {
        "max-levels": 0
    }).then(()=>    
        console.log("done.")
    ).catch(err => {
        console.log(err);
        console.warn("Error during ebook generation. If the file was not generated, " + 
            "you may have to run the command manually:")
        console.warn("ebook-convert ./output/Hiraeth.html ./output/Hiraeth.epub")
        console.warn("(or use calibre's gui)")
    })

    //Function to grab post from array by post id
    getID = id => posts.filter(p => p.id == id)[0];
}).catch(err => {
    console.log(err);
});

