import { link } from "fs";

var aws = require("aws-sdk");
var ses = new aws.SES({ region: "eu-west-1" });

export async function sendEmail(listing: string[], links: string[]) {
  var params = {
    Destination: {
      ToAddresses: ["jordane.cure@gmail.com", "alexanyan.n@gmail.com"],
    },
    Message: {
      Body: {
        Html: {
          Data: `<div>
                <h2>Searchs</h2>
                ${listing
                  .map(
                    (listing, i) =>
                      `<p><a href="${listing}">Search ${i + 1}</a></p>`
                  )
                  .join("")}
                <h2>New content</h2>
                ${links
                  .map(
                    (link) =>
                      `<p><a href="https://www.daft.ie${link}">${link}</a></p>`
                  )
                  .join("")}
            </div>`,
        },
      },

      Subject: { Data: "New daft properties" },
    },
    Source: "jordane.cure@gmail.com",
  };

  console.log('send email')
  await ses.sendEmail(params).promise();
}
