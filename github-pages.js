const fs = require('fs');

const storyText = fs.readFileSync('./output/Hiraeth.html');

const headText = 
`<title>Hiraeth by OP!T1tXaJv9os</title>
<style>
  body {
    max-width: 45em;
    margin: auto;
    font-size: large;
  }
  html {
    background-color: antiquewhite;
  }
  html.dark {
    background-color: #131110;
    color: antiquewhite;
  }
  p {
    margin: 1em 0;
  }
  footer {
    margin: 1em;
  }
</style>`

const indexText = 
`<head>
${headText}
</head>
<body>
<header>
  <p>
    Hiraeth is an original work of erotic fiction posted on 7chan's /elit/ by the nameless OP!T1tXaJv9os
  </p>
  <p>
    Download the ebook files here:
      (<a href="https://github.com/liska-is-a-good-girl/Hiraeth-ebook/raw/master/output/Hiraeth.mobi">mobi/kindle</a>,
      <a href="https://github.com/liska-is-a-good-girl/Hiraeth-ebook/raw/master/output/Hiraeth.mobi">epub</a>), 
    view the <a href="https://7chan.org/elit/res/26149.html">original thread</a>, 
    or <a href="https://github.com/liska-is-a-good-girl/Hiraeth-ebook/">view the source</a>
  </p>
</header>
${storyText}
<footer>
  <p>
    You've reached the end so far. 
    Go check out the <a href="https://7chan.org/elit/res/26149.html">source</a> 
    and tell OP that Liska is a good girl!
  </p>
</footer>
</body>`

fs.writeFileSync('index.html', indexText);