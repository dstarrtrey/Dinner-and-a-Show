$(document).ready(function () {

  const mapquestAPIKey = "WZGGE434H2CvVdqnZEQXHxQxmHlxzxGw"; //We'll end up putting this in Firebase
  const mapquestSecret = "";
  let venueLocation = "1290, Sutter Street, San Francisco, CA 94109"; //Address for the Regency theater taken from Bandsintown
  let myUrl = `https://www.mapquestapi.com/search/v2/radius?origin=${venueLocation}&radius=0.15&maxMatches=10&ambiguities=ignore&hostedData=mqap.ntpois|group_sic_code=?|581208&outFormat=json&key=${mapquestAPIKey}`
  $.ajax({
    url: myUrl,
    method: "GET"
  }).then(function (data) {
    console.log(data.searchResults); //Returns all restaurants in 0.15 mile radius of venueLocation
  })
});
