import AsyncStorage from "@react-native-async-storage/async-storage";

import { FeedSnipProp } from "../components/FeedSnip";
import { XMLParser } from "fast-xml-parser";
import { Alert } from "react-native";
import { FeedObjectStore } from "../views/AddRssFeed";

function isInToday(inputDate: Date) {
  var today = new Date();
  if (today.setHours(0, 0, 0, 0) == inputDate.setHours(0, 0, 0, 0)) {
    return true;
  }
  else { return false; }
}
async function fetchFeedForUrl(feedObject: FeedObjectStore): Promise<FeedSnipProp[]> {
  let feeds: FeedSnipProp[] = [];
  const parser = new XMLParser();
  let rssXmlResponse: Response | undefined = undefined;
  if (feedObject.headers != undefined) {
    let headersVar = new Headers();
    for (let [key, value] of Object.entries(feedObject.headers)) {
      try {
        headersVar.set(key, value);
      } catch {
        console.log("Skipping header [invalid]:", key, ':', value);
      }
      try {
        rssXmlResponse = await fetch(feedObject.remoteUrl, { method: 'GET', headers: headersVar });

      } catch {
        console.log("Unable to fetch data.");
      }
    }
  } else {
    try {
      rssXmlResponse = await fetch(feedObject.remoteUrl);
    } catch {
      console.log("Unable to fetch data.");
    }
  }
  if (rssXmlResponse == undefined) {
    return [];
  }
  if (rssXmlResponse.ok != true) {
    return [];
  }
  let rssXmlContent: string = await rssXmlResponse.text();

  let channel = await parser.parse(rssXmlContent).rss.channel;
  channel.item.forEach((element: any) => {
    try {
      let parsed: number = Date.parse(element.pubDate);
      let pubDate = new Date(parsed);
      if (isInToday(pubDate)) {
        feeds.push({
          feedSourceName: channel.title,
          feedSourceIconUri: '../assets/logo.png',
          headline: element.title,
          timestamp: parsed,
          summary: element.description ? element.description.replace(/(<([^>]+)>)/gi, "") : 'No data.',
          unread: true,
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message)
    }
  });


  return feeds;
}

async function getMyRSSFeeds(): Promise<FeedSnipProp[]> {
  let newFeeds: FeedSnipProp[] = [];
  const myFeeds = await AsyncStorage.getItem('myFeeds');
  if (myFeeds == null || myFeeds === '') {
    await AsyncStorage.setItem('myFeeds', '[]');

    return newFeeds;
  } else {
    const feedObjects: FeedObjectStore[] = JSON.parse(myFeeds);
    for (const feedObject of feedObjects) {
      const feedData = await fetchFeedForUrl(feedObject);
      newFeeds = newFeeds.concat(feedData);
    }
    newFeeds.sort((a, b) => b.timestamp - a.timestamp);
    return newFeeds;
  }
}

export default getMyRSSFeeds;