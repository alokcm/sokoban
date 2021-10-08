const express = require("express");
const path = require('path');

distPath = __dirname + "/";
const app = express();

// Serve only the static files form the dist directory
app.use(express.static(distPath));
//rewrite path
app.get('/*', function(req,res) {
    res.sendFile(path.join(distPath+'/index.html'));
});
app.listen(process.env.PORT || 5001, function(err) {
console.log(err, "running on port 5001");
});