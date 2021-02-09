const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const metascraper = require('metascraper')([
  require('metascraper-image')(),
  require('metascraper-title')(),
  require('metascraper-url')(),
]);
const got = require('got');

exports.performWebScrape = functions.firestore.document('links/{linkId}').onCreate(async (snapshot, context) => {
  const link = snapshot.data();
  const linkId = context.params.linkId;
  console.log('TCL: link', link, linkId);

  const { body: html, url } = await got(link.url);
  const { image, title } = await metascraper({ html, url });
  console.log('image: ', image, 'title: ', title);

  await admin.firestore().collection('links').doc(linkId).update({ image, title });
});
