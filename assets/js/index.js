$(document).ready(function() {
  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyCvkOVvVayLKYdleuDnuqxCBS9jHgnrzFk",
    authDomain: "dinner-and-a-show.firebaseapp.com",
    databaseURL: "https://dinner-and-a-show.firebaseio.com",
    projectId: "dinner-and-a-show",
    storageBucket: "",
    messagingSenderId: "13334029976"
  };
  firebase.initializeApp(config);
  const database = firebase.database();
  const keysRef = database.ref("/keys");
  let tmAPIKey = "";
  let mqAPIKey = "";
  keysRef.on("value", function(snapshot) {
    tmAPIKey = snapshot.val().tmKey;
    mpAPIKey = snapshot.val().mqKey;
  });
  let venueLocation = "1290, Sutter Street, San Francisco, CA 94109"; //Address for the Regency theater taken from Bandsintown
  let mapquestUrl = `https://www.mapquestapi.com/search/v2/radius?origin=${venueLocation}&radius=0.15&maxMatches=10&ambiguities=ignore&hostedData=mqap.ntpois|group_sic_code=?|581208&outFormat=json&key=${mqAPIKey}`;
  $.ajax({
    url: mapquestUrl,
    method: "GET"
  }).then(function(data) {
    console.log(data.searchResults); //Returns all restaurants in 0.15 mile radius of venueLocation
  });
  let tmKeyword = "";
  let concertCity = "San Francisco";
  let venueRadius = 100; //miles
  let listAmount = 10;
  let genreId = "KnvZfZ7vAeA";
  let ticketmasterUrl = `https://app.ticketmaster.com/discovery/v2/events.json?size=${listAmount}&apikey=${tmAPIKey}&radius=${venueRadius}&city=${concertCity}&endDateTime=2019-02-10T12:00:00Z&segmentName=Music&keyword=${tmKeyword}&genreId=${genreId}`;
  const GENREIDS = {
    danceElectronic: "KnvZfZ7vAvF",
    rock: "KnvZfZ7vAeA",
    hipHopRap: "KnvZfZ7vAv1",
    pop: "KnvZfZ7vAev",
    world: "KnvZfZ7vAeF",
    misc: "KnvZfZ7v7le",
    country: "KnvZfZ7vAv6",
    reggae: "KnvZfZ7vAed",
    classical: "KnvZfZ7vAeJ",
    musicGeneral: "Music", //classical?
    alternative: "KnvZfZ7vAvv",
    bluesJazz: "KnvZfZ7vAvd",
    folk: "KnvZfZ7vAva",
    rhythmAndBlues: "KnvZfZ7vAee"
  };
  console.log(ticketmasterUrl);
  $.ajax({
    url: ticketmasterUrl,
    method: "GET"
  }).then(function(data) {
    console.log(data["_embedded"].events);
  });
});
