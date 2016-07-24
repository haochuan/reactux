var Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs-extra'));

var root = __dirname.replace(/reactux\/lib/,'reactux/')


function generateStructure(project){
  return fs.copyAsync(root + 'template', project, {clobber: true})
    .then(function(err){
      console.log("Starting initial " + project + " ...");
      if (err) {
            return console.error(err);
        } else {
            console.log('Successfully generated "' + project + '" in current directory.');
        }

    })
}
module.exports = generateStructure;