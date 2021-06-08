import { extractLinks, getPageContent } from "./helper/extract";
import { getSavedContent, uploadContent } from "./helper/storage";
import { sendEmail } from "./helper/emailSender";

let searchs = [
  `https://www.daft.ie/property-for-rent/mapArea?geoSearchType=BBOX
                &top=53.3652
                &left=-6.2695
                &right=-6.2538
                &bottom=53.3484
                &mapView=true
                &showMap=false
                &rentalPrice_from=2000
                &rentalPrice_to=3000
                &sort=publishDateDesc
                &numBeds_to=2`,
  `https://www.daft.ie/property-for-rent/mapArea?geoSearchType=BBOX
                &top=53.34629133972456
                &left=-6.269738042692097
                &right=-6.259335595173894
                &bottom=53.33856932792074
                &mapView=true
                &showMap=false
                &rentalPrice_from=2000
                &rentalPrice_to=3000
                &sort=publishDateDesc
                &numBeds_to=2`,
  `https://www.daft.ie/property-for-rent/mapArea?geoSearchType=BBOX
                &top=53.33213698795032
                &left=-6.273544399312044
                &right=-6.2618233673758255
                &bottom=53.32778151417952
                &mapView=true
                &showMap=false
                &rentalPrice_from=2000
                &rentalPrice_to=3000
                &sort=publishDateDesc
                &numBeds_to=2`,
].map((url) =>
  url
    .replace(/(\r\n|\n|\r)/gm, "")
    .replace(/\t/g, "")
    .replace(/\s/g, "")
);

export const handler = async (event: any = {}): Promise<any> => {
  let savedContent = await getSavedContent();
  let newAddedContent: string[] = [];

  for (let search of searchs) {
    let pageContent = await getPageContent(search).then(extractLinks);
    pageContent.forEach((url) => {
      if (savedContent[url] === undefined) {
        newAddedContent.push(url);
        console.log("New content:", url);
        savedContent[url] = new Date().toISOString().split("T")[0];
      }
    });
  }

  await uploadContent(savedContent);

  if (newAddedContent.length > 0 ) {
    console.log("Send an email");
    await sendEmail(searchs, newAddedContent);
  }

  return newAddedContent;
};
