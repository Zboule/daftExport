import { extractLinks, getPageContent } from './helper/extract'
import { getSavedContent, uploadContent } from './helper/storage'
import { sendEmail } from './helper/emailSender'

let search = "https://www.daft.ie/property-for-rent/mapArea?geoSearchType=BBOX&top=53.35916563936891&left=-6.344186027168234&right=-6.146530829248064&bottom=53.31134045103778&mapView=true&showMap=false&rentalPrice_from=2200&rentalPrice_to=3000&sort=publishDateDesc&numBeds_to=2"

export const handler = async (event: any = {}): Promise<any> => {
    let savedContent = await getSavedContent()
    let pageContent = await getPageContent(search).then(extractLinks)

    let newAddedContent: string [] = []
    pageContent.forEach(url => {
        if (savedContent[url] === undefined) {
            newAddedContent.push(url)
            console.log('New content:', url)
            savedContent[url] = new Date().toISOString().split('T')[0]
        }
    });

    await uploadContent(savedContent)

    if (newAddedContent.length > 0){
        console.log('Send an email')
        await sendEmail(search,newAddedContent)
    }
    else {
        await sendEmail(search, [])
    }
    return newAddedContent
}

