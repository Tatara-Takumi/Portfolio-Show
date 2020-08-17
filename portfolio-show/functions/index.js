const os = require('os')
const path = require('path')
// const Storage = require('@google-cloud/storage')
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sharp = require('sharp')
admin.initializeApp()

const finalize = (tmpFilePath, destFilePath, image_height, image_width) => {
    console.log('start'+tmpFilePath)
    console.log('はいはいあ'+destFilePath)
    if(image_height > image_width){
        return new Promise((resolve, reject) => {
            sharp(tmpFilePath)
            .resize(null, 650,{
                fit:'contain'
            })
            .toFile(destFilePath, (err, _) => {
                if(!err){
                    resolve();
                }else{
                    reject(err);
                }
            });
        });
    }
    if(image_height < image_width){
        return new Promise((resolve, reject) => {
            sharp(tmpFilePath)
            .resize(1000, null,{
                fit:'contain'
            })
            .toFile(destFilePath, (err, _) => {
                if(!err){
                    resolve();
                }else{
                    reject(err);
                }
            });
        });
    }
}


// sharpで最大幅のみを指定してリサイズ
const resizeImage = (tmpFilePath, destFilePath, Towidth, ToHeight) => {
    return new Promise((resolve, reject) => {
      sharp(tmpFilePath)
      .metadata()
        .then((metadata) => {
            var image_height = metadata.height
            var image_width = metadata.width 
            console.log('幅'+image_width)
            console.log('高さ'+image_height)
            return finalize(tmpFilePath, destFilePath, image_height, image_width)
        }).catch((err) => {
            console.error(err)
        });
    });

  };

exports.generateThumbnail = functions.region('asia-northeast1').storage.object().onFinalize(async (object) => {

    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
    // const downloadToken = object.metadata
    // [END eventAttributes]
    console.log('meta'+metageneration)

    if(filePath.startsWith(THUMB_PREFIX)){
        return updateImage(filePath,fileBucket)
    }else{
        return resizeTHUMBnail(fileBucket,filePath,contentType)
    }

    

    // await admin.firestore().collection('posts').doc(object.name.slice(0,-4)).update({
    //     thumbnail:`https://firebasestorage.googleapis.com/v0/b/${fileBucket}/o/${encodeURIComponent(filePath)}?alt=media&token=${object.metadata.firebaseStorageDownloadTokens}`
    // })
})

const updateImage = async(filePath,fileBucket) => {
    console.log('BeforeCut'+filePath)
    console.log("AfterCut"+filePath.slice(6,-4))
    await admin.firestore().collection('posts').doc(filePath.slice(6,-4)).update({
        thumbnail:`https://firebasestorage.googleapis.com/v0/b/${fileBucket}/o/${encodeURIComponent(filePath)}?alt=media`
    })
}

const THUMB_MAX_WIDTH = 1000;
const THUMB_MAX_HEIGHT = 650;
const THUMB_PREFIX = 'thumb_';

const resizeTHUMBnail = (fileBucket,filePath,contentType) => {
    // ディレクトを取得
    const fileDir = path.dirname(filePath);
    // ファイル名を取得する
    const fileName = path.basename(filePath);

    
    const bucket = admin.storage().bucket(fileBucket)
    const file = bucket.file(filePath);
    const metadata = { contentType: contentType };
    //一時的な保存場所
    const tempLocalFile = path.join(os.tmpdir(), filePath.split('/').pop()); //.pop()は配列の最後の要素を抜き出す
    //リサイズ後の一時ファイル保存場所
    const thumbFilePath = path.normalize(path.join(fileDir,`${THUMB_PREFIX}${fileName}`));
    const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath.split('/').pop());
    (async () => {
        console.log('一時ローカルファイルは:' + tempLocalFile);
        console.log('ディレクトリは:'+fileDir)
        await file.download({destination:tempLocalFile});
        console.log('tempLocaiFileは'+tempLocalFile)
        console.log('thumfile'+tempLocalThumbFile)
        await resizeImage(tempLocalFile,tempLocalThumbFile,THUMB_MAX_WIDTH,THUMB_MAX_HEIGHT);
        console.log('関数終わり')
        await bucket.upload(tempLocalThumbFile,{destination:path.join(fileDir, `${THUMB_PREFIX}${fileName}`), metadata:metadata});
        console.log('upload終わり')
    })()
    .then(() => console.log('success'))
    .catch(err => console.error(err))
}

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

exports.deleteThumbnail = functions.region('asia-northeast1').firestore.document(`posts/{postId}`).onDelete(async (change,context) => {
    const {postId} = context.params
    console.log('params'+postId)
    const path = `${postId}.png`
    var bucket = admin.storage().bucket()
    return bucket.deleteFiles({
        prefix:`${postId}.png`
    });
})



exports.deleteUser = functions.region('asia-northeast1').firestore.document(`users/{userId}`).onDelete(async (change,context) => {
    const {userId} = context.params
    admin.auth().deleteUser(userId)
        .then(() => {
            return console.log('sucesses')
        })
        .catch(err => {
            return console.error(err)
        })

} )

exports.changeUserName = functions.region('asia-northeast1').firestore.document(`users/{userId}`).onUpdate(async (change,context) => {
    var uid = change.before.data().uid
    var oldUserName = change.before.data().UserName
    var newUserName = change.after.data().UserName
    if(oldUserName === newUserName){
        return console.log(oldUserName + '==' + newUserName)
    }else{
        var batch = admin.firestore().batch()
        await admin.firestore().collection('posts').where('uid','==',uid).get()
            .then(qs => {
                qs.forEach(doc => {
                    batch.update(doc.ref,{
                        UserName:newUserName
                    })
                })
            return batch.commit()
            }).catch(err => {
                console.log(err)
            })
    }
})