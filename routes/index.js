
/*
 * GET home page.
 */

var db = require("../db");

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
  
  /*
  db.put({
      collection: "tag",
      doc: {
          name: "test" + new Date().getTime()
      },
      complete: function(err, doc) {
          if (err) {
              console.log(err.message);
              return;
          }

          console.log(doc);
      }
  });
  */

  /*
  db.post({
      collection: "tag",
      doc: {
          name: new Date().getTime()
      },
      options: {
          //multi: true
      },
      complete: function(err, numAffected) {
          if (err) {
              console.log(err.message);
              return;
          }

          console.log(numAffected);
      }
  });
  */

/*
 *  db.del({
 *      query: {
 *          name: "1364741673597"
 *      },
 *      collection: "tag",
 *      complete: function(err, numAffected) {
 *          if (err) {
 *              console.log(err.message);
 *              return;
 *          }
 *
 *          console.log(numAffected);
 *      }
 *  });
 */

  
  /*
   *db.get({
   *    collection: "tag",
   *    complete: function(err, docs) {
   *        console.log(docs);
   *    }
   *});
   */
  
};
