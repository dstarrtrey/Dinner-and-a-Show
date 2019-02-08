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
  let venueLocation = "";
  let tmKeyword = "";
  let tmCity = "";
  let tmState = "";
  let tmZipCode = "";
  let tmRange = 1000000;
  let tmStartDate = "";
  let tmEndDate = "";
  let tmGenre;
  let currentArr = [];
  let tmAPIKey = "";
  let mqAPIKey = "";
  let currentMQ = [];
  let concertCity = "San Francisco";
  let venueRadius = 100; //miles
  let listAmount = 10;
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
  $(".carousel.carousel-slider").carousel({
    fullWidth: true,
    indicators: true
  });
  const ifDate = date => {
    if (date) {
      return date + "T00:00:00Z";
    } else {
      return "";
    }
  };
  const TMASTER = async key => {
    currentMQ = [];
    $("#concertInfo").empty().append(`<tr>
      <th>Name</th>
      <th>Venue</th>
      <th>City</th>
      <th>Price</th>
    </tr>`);
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
    console.log("result", result["_embedded"].events);
    currentArr = await result["_embedded"].events;
    currentArr.forEach((concert, index) => {
      const newRow = $("<tr>")
        .attr("id", index)
        .addClass("concert");
      newRow.append($("<td>").text(concert.name));
      newRow.append($("<td>").text(concert._embedded.venues[0].name));
      newRow.append(
        $("<td>").text(
          concert._embedded.venues[0].city.name +
            ", " +
            concert._embedded.venues[0].state.stateCode
        )
      );
      newRow.append(
        $("<td>").text(
          `${concert.priceRanges[0].min}—${concert.priceRanges[0].max} ${
            concert.priceRanges[0].currency
          }`
        )
      );
      $("#concertInfo").append(newRow);
    });
    console.log(await currentMQ);
  };
  const SELECTCONCERT = async index => {
    venueLocation = `${currentArr[index]._embedded.venues[0].address.line1}
        ${currentArr[index]._embedded.venues[0].city.name}`;
    console.log(venueLocation);
    console.log("currentArr: ", currentArr);
    let restaurants = await MQUEST(mqAPIKey);
    $(".selected").removeClass("selected");
    $("#restaurantInfo")
      .empty()
      .append("<tr><th>Resturant</th><th>Distance</th></tr>");
    $(`#${index}`).addClass("selected");
    if (!restaurants) {
      $("#restaurantInfo").append(
        "<tr><td>No restaurants found! (Sorry)</td></tr>"
      );
    } else {
      restaurants.forEach(restaurant => {
        console.log("restaurant: ", restaurant);
        const link = $("<a>")
          .attr(
            "href",
            `https://www.google.com/maps/search/${restaurant.name} ${
              restaurant.fields.address
            } ${restaurant.fields.city} ${restaurant.fields.country}`
          )
          .attr("target", "_blank");
        const row = $("<tr>");
        row.append(link.append($("<td>").text(restaurant.name)));
        row.append($("<td>").text(`${restaurant.distance} mi.`));
        $("#restaurantInfo").append(row);
      });
    }
  };
  const MQUEST = async key => {
    let mapquestUrl = `https://www.mapquestapi.com/search/v2/radius?origin=${venueLocation}&radius=1&maxMatches=10&ambiguities=ignore&hostedData=mqap.ntpois|group_sic_code=?|581208&outFormat=json&key=${key}`;
    let request = $.ajax({
      url: mapquestUrl,
      method: "GET"
    });
    let result = await request;
    return result.searchResults;
  };
  //Firebase API Keys ref
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
    TMASTER(tmAPIKey).then(SELECTCONCERT(0));
  });
  $(document).on("click", ".concert", function() {
    SELECTCONCERT(parseInt($(this).attr("id")));
  });
});
