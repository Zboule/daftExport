
import https from 'https'
import pkg from 'node-html-parser';
const { parse } = pkg;


function getPageContent() {

    return new Promise((resolve, reject) => {
        let position = 'top=53.35578644270558&left=-6.329613427557632&right=-6.162544664685186&bottom=53.31583018438815'
        https.get(`https://www.daft.ie/property-for-rent/mapArea?geoSearchType=BBOX&${position}&mapView=true&showMap=false&rentalPrice_from=2200&rentalPrice_to=3000&sort=publishDateDesc`,
            (resp) => {
                let data = '';

                resp.on('data', (chunk) => {
                    data += chunk;
                });

                resp.on('end', () => {
                    resolve(data)
                });

            }).on("error", (err) => {
                reject("Error: " + err.message)
                console.log("Error: " + err.message);
            });
    })

}

function extractLinks(page) {
    const root = parse(page);
    const resultList = root.querySelector('.SearchPage__SearchResults-gg133s-3')

    let links = []
    resultList.childNodes.forEach(result => {
        if (result.rawTagName === 'li') {
            let ref = result.childNodes[0].rawAttrs
            links.push(ref.split('"')[1])
        }
    });
    return links
}


getPageContent()
    .then(extractLinks)
    .then((links) => {
        console.log(links.map((url) => 'https://www.daft.ie' + url))
        console.log(links.length)
    })
