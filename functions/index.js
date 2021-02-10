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

exports.addSharedWith = functions.firestore.document('curations/{curationId}').onCreate(async (snapshot, context) => {
  const curation = snapshot.data();
  console.log('🚀 ~ file: index.js ~ line 27 ~ addSharedWith ~ curation', curation);
  const linkSnapshot = await admin.firestore().collection('links').doc(curation.linkId);
  const link = linkSnapshot.data();
  console.log('🚀 ~ file: index.js ~ line 30 ~ addSharedWith ~ link', link);

  const curatedForSnapshot = await admin
    .firestore()
    .collection('users')
    .where('phoneNumber', '==', curation.phoneNumber);
  const curatedFor = curatedForSnapshot.data();
  console.log('🚀 ~ file: index.js ~ line 37 ~ addSharedWith ~ curatedFor', curatedFor);

  if (curatedForSnapshot.id === link.curatorId) return;

  let sharedWith = link.sharedWith;
  if (!sharedWith) {
    sharedWith = [curatedFor];
  } else {
    sharedWith = [...sharedWith, curatedFor];
  }
  console.log('🚀 ~ file: index.js ~ line 42 ~ addSharedWith ~ sharedWith', sharedWith);

  await admin.firestore().collection('links').doc(linkId).update({ sharedWith });
});
