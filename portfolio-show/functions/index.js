const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.generateThumbnail = functions.region('asia-northeast1').storage.object().onFinalize(async (object) => {

    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
    // [END eventAttributes]

    await admin.firestore().collection('posts').doc(object.name.slice(0,-4)).update({
        thumbnail:`https://firebasestorage.googleapis.com/v0/b/${fileBucket}/o/${encodeURIComponent(filePath)}?alt=media&token=${object.metadata.firebaseStorageDownloadTokens}`
    })
})

exports.deletePosts = functions.region('asia-northeast1').firestore.document('posts/{postId}').onDelete(async (change,context) => {
    // postId = context.params
    // const postRef = admin.firestore().collection('posts').doc(context.params)
    const postRef = change.ref
    
    var batch = admin.firestore().batch()
    await admin.firestore().collectionGroup('favorites').where('postRef', '==' , postRef)
        .get()
        .then(qs => {
            qs.forEach(doc => {
                batch.delete(doc.ref)
            })
        return batch.commit()
        }).catch(err => {
            return console.error(err)
        })
})