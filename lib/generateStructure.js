var Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs-extra'));

var root = __dirname.replace(/reactux\/lib/,'reactux/')


function generateStructure(project){
  return fs.copyAsync(root + 'template', project, {clobber: true})
    .then(function(err){
      if (err) {
            return console.error(err);
        } else {
            console.log('Successfully generated a React project "' + project + '" in current directory.');
        }

    })
}
module.exports = generateStructure;