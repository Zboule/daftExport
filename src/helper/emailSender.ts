import { link } from "fs";


var aws = require("aws-sdk");
var ses = new aws.SES({ region: 'eu-west-1'  });


export async function sendEmail (listing: string,links: string[]) {

    var params = {
        Destination: {
          ToAddresses: ['jordane.cure@gmail.com'],
        },
        Message: {
          Body: {
            Html: { Data: `<div>
                <h3>New content in <a href="${listing}">this</a> research</h3>
                ${links.map((link) => `<p><a href="https://www.daft.ie${link}">${link}</a></p>`).join('')}
            </div>` },
          },
    
          Subject: { Data: "New daft properties" },
        },
        Source: "jordane.cure@gmail.com",
      };
     
    await ses.sendEmail(params).promise()
}