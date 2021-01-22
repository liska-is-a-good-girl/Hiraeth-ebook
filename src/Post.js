class Post {
    constructor(element) {
        if (!(this instanceof Post)) return new Post(element);
        this.node = element;

        this.json = {} //4chan format json
        this.id = this.node.id
        this.json.no = this.id
        this.postername = this.get("postername")
        this.json.name = this.postername
        let postertrip = this.get("postertrip")
        if (postertrip) {
            this.postertrip = postertrip;
            this.json.trip = postertrip;
        }
        let subject = this.get("subject")
        if (subject) {
            this.subject = subject
            this.json.sub = subject;
        }
        this.message = this.getHTML("message")
        this.json.com = this.message
        this.length = this.message.length
    }

    get(attr) {
        //return this.node.getElementsByClassName(attr)[0]?.innerText
        const elem = this.node.getElementsByClassName(attr)[0]
        return elem ? elem.textContent : undefined;
    }

    getHTML(attr) {
        //return this.node.getElementsByClassName(attr)[0]?.innerHTML
        const elem = this.node.getElementsByClassName(attr)[0]
        return elem ? elem.innerHTML : undefined;
    }

    hasMidBacklinks() {
        let middlePortion = this.message.slice(this.length/5, this.length - this.length/5)
        return !!middlePortion.match(/&gt;&gt;\d\d\d+/i)
    }

    formattedMessage() {
        return (
            this.message
                .replace(/\s*<br>\s*<br>\s*/gm, `</p>\n<p>`)
                .replace(/^\n/, "<p>")
                .replace(/(<br>|\n)+$/, "</p>")
        )
    }
}

module.exports = { Post }