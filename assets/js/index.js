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
  let venueLocation = "1290, Sutter Street, San Francisco, CA 94109"; //Address for the Regency theater taken from Bandsintown
  let tmKeyword = "";
  let tmCity = "";
  let tmState = "";
  let tmZipCode = "";
  let tmRange = 50;
  let tmStartDate = "";
  let tmEndDate = "";
  let tmGenre;
  let tmAPIKey = "";
  let mqAPIKey = "";
  let concertCity = "San Francisco";
  let venueRadius = 100; //miles
  let listAmount = 15;
  let genreId = "KnvZfZ7vAeA";
  const GENREIDS = {
    danceElectronic: "KnvZfZ7vAvF",
    rock: "KnvZfZ7vAeA",
    hipHopRap: "KnvZfZ7vAv1",
    pop: "KnvZfZ7vAev",
    misc: "KnvZfZ7v7le",
    country: "KnvZfZ7vAv6",
    classical: "KnvZfZ7vAeJ",
    alternative: "KnvZfZ7vAvv",
    bluesJazz: "KnvZfZ7vAvd",
    rhythmAndBlues: "KnvZfZ7vAee"
  };
  const ifDate = date => {
    if (date) {
      return date + "T00:00:00Z";
    } else {
      return "";
    }
  };
  const TMASTER = async key => {
    let ticketmasterUrl = `https://app.ticketmaster.com/discovery/v2/events.json?size=${listAmount}&apikey=${key}&radius=${tmRange}&city=${tmCity}&stateCode=${tmState}&startDateTime=${ifDate(
      tmStartDate
    )}&endDateTime=${ifDate(
      tmEndDate
    )}&segmentName=Music&keyword=${tmKeyword}&genreId=${genreId}`;
    console.log(ticketmasterUrl);
    let request = $.ajax({
      url: ticketmasterUrl,
      method: "GET"
    });
    let result = await request;
    console.log(result["_embedded"].events);
    result["_embedded"].events.forEach(concert => {
      console.log(mqAPIKey);
      venueLocation = `${concert._embedded.venues[0].address.line1}
        ${concert._embedded.venues[0].city.name}`;
      console.log(venueLocation);
      MQUEST(mqAPIKey);
    });
  };
  const MQUEST = async key => {
    let mapquestUrl = `https://www.mapquestapi.com/search/v2/radius?origin=${venueLocation}&radius=0.15&maxMatches=10&ambiguities=ignore&hostedData=mqap.ntpois|group_sic_code=?|581208&outFormat=json&key=${key}`;
    let request = $.ajax({
      url: mapquestUrl,
      method: "GET"
    });
    let result = await request;
    console.log(result.searchResults);
  };
  keysRef.on("value", async function(snapshot) {
    tmAPIKey = snapshot.val().tmKey;
    mqAPIKey = snapshot.val().mqKey;
    console.log(tmAPIKey);
  });
  $(document).on("submit", "#filter", function(event) {
    event.preventDefault();
    tmKeyword = $("#keyword")
      .val()
      .trim()
      .split(" ")
      .join("-");
    tmCity = $("#city")
      .val()
      .trim()
      .split(" ")
      .join("-");
    tmState = $("#state-picker").val();
    if ($("#zip-code").val() !== null) {
      tmZipCode = $("#zip-code").val();
    }
    tmRange = $("#range").val();
    if ($("#start-date").val()) {
      tmStartDate = moment($("#start-date").val()).format("YYYY-MM-DD");
    }
    if ($("#end-date").val()) {
      tmEndDate = moment($("#end-date").val()).format("YYYY-MM-DD");
    }
    tmGenre = GENREIDS[$("#genre").val()];
    console.log("Keyword: ", tmKeyword);
    console.log("City: ", tmCity);
    console.log("State: ", tmState);
    console.log("Zip Code: ", tmZipCode);
    console.log("Range: ", tmRange);
    console.log("Start Date: ", tmStartDate);
    console.log("End Date: ", tmEndDate);
    console.log("Genre(s): ", tmGenre);
    TMASTER(tmAPIKey);
  });
});
