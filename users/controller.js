const {
  Model,
} = require('./model');

exports.createOrUpdate = body => 
  Model.updateOne({ chatId: body.chatId }, body, { upsert: true } );

// exports.delete = (req, res, next) => {
//   const {
//     doc,
//   } = req;

//   doc.remove()
//     .then((removed) => {
//       res.json({
//         success: true,
//         item: removed,
//       });
//     })
//     .catch((err) => {
//       next(new Error(err));
//     });
// };
