import * as AWS from 'aws-sdk';

AWS.config.update({ region: 'eu-west-1' });
const s3 = new AWS.S3();
let Bucket = 'daft-export'
let fileName = 'daft-dublin-search'

export function uploadContent(obj: any) {

    return new Promise((resolve, reject) => {
        s3.upload(
            {
                Bucket: Bucket,
                Key: fileName,
                Body: Buffer.from(JSON.stringify(obj)),
                ContentEncoding: 'base64',
                ContentType: 'application/json',
            },
            function (err, data) {
                if (err) {
                    reject("Error" + err);
                } else {
                    resolve(data.Bucket);
                }
            }
        )
    })

}

export async function getSavedContent() {
    
    let savedContent: {[key: string] : string} = {}

    try {
        const response = await s3.getObject({
            Bucket: Bucket,
            Key: fileName,
        }).promise()
    
        savedContent = JSON.parse(response.Body.toString());
    }
    catch (err){
        console.error('Error: ', err.code)
    }

    return savedContent
}


function getFileName(dayOffset: any) {
    var dt = new Date();
    dt.setDate( dt.getDate() - dayOffset );
    return dt.toISOString().split('T')[0]
}