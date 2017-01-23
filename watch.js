var watchr = require('watchr');


exports.watch = function() {
  var path = process.cwd() + '/dropbox';
  function listener (changeType, fullPath, currentStat, previousStat) {
    switch (changeType) {
      case 'update':
        console.log('the file', fullPath, 'was updated', currentStat, previousStat)
        break
      case 'create':
        console.log('the file', fullPath, 'was created', currentStat)
        break
      case 'delete':
        console.log('the file', fullPath, 'was deleted', previousStat)
        break
    }
  }

  function next (err) {
    if ( err )  return console.log('watch failed on', path, 'with error', err)
    console.log('watch successful on', path)
  }

  var stalker = watchr.open(path, listener, next);
}
