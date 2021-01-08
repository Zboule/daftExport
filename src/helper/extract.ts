
import * as https from 'https'
import parse from 'node-html-parser';


export function getPageContent(search:string) {
    return new Promise((resolve, reject) => {
        https.get(search,
            (resp) => {
                let data = '';

                resp.on('data', (chunk) => {
                    data += chunk;
                });

                resp.on('end', () => {
                    resolve(data)
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
                reject("Error: " + err.message)
            });
    })

}

export function extractLinks(page: any) {
    const root = parse(page);
    const resultList = root.querySelector('.SearchPage__SearchResults-gg133s-3')

    let links: any [] = []
    resultList.childNodes.forEach((result: any )=> {
        if (result['rawTagName'] === 'li') {
            let ref = result.childNodes[0]['rawAttrs']
            links.push(ref.split('"')[1])
        }
    });
    return links
}





