var data = {};
var random = [];
var currentRaw = new Date();

/*var currentDay = currentRaw.getDay();
var currentTime = (currentRaw.getHours()*100)+currentRaw.getMinutes();*/

var currentDay = 0;
var currentTime = 0030;
console.log("Day/Time: " + currentDay + "/" + currentTime);

retrieveData();
refreshLists();


function refreshLists(){
    document.getElementById("open").innerHTML = "";
    document.getElementById("closed").innerHTML = "";
    document.getElementById("removeList").innerHTML = "";
    random = [];
    for (i=0; i<data.restaurants.length; i++) {
        checkIfOpen(data.restaurants[i]);

        // removal list
        var button = document.createElement("button");
        button.append("Remove");
        button.setAttribute("onclick", 'removeRestaurant("' + data.restaurants[i].name + '")');
        button.setAttribute("style", "margin-left:5px;");
        var item = document.createElement("li");
        item.append(data.restaurants[i].name);
        item.append(button);
        document.getElementById("removeList").append(item);
    }
}

function checkIfOpen(rest){
  for(j=0; j<rest.hours.length; j++) {
    // if open sometime today
    if(rest.hours[j].open.day == currentDay) {
        // if currently past open time
        if(rest.hours[j].open.time <= currentTime) {
            // if closes sometime today
            if(rest.hours[j].close.day == currentDay) {
                // if currently before close time
                if(rest.hours[j].close.time > currentTime) {
                    // print as open
                    var toAppend = document.createElement("li");
                    if((rest.hours[j].close.time - currentTime) <= 100){
                      // if closing soon
                      toAppend.append(rest.name);
                      var closingSoon = document.createElement("span");
                      closingSoon.innerHTML = " (Closing Soon!)";
                      toAppend.append(closingSoon);
                    }
                    else{
                      toAppend.append(rest.name);
                    }
                    document.getElementById("open").append(toAppend);
                    // add to random list
                    random.push(rest.name);
                    // exit function
                    return;
                }
            }
            // if closes tomorrow
            else if(rest.hours[j].close.day == (currentDay + 1) || (rest.hours[j].close.day == 0 && currentDay == 6)) {
              // print as open
              var toAppend = document.createElement("li");
              if(rest.hours[j].close.time <= 100 && currentTime >= 2300){
                // if closing soon
                toAppend.append(rest.name);
                var closingSoon = document.createElement("span");
                closingSoon.innerHTML = " (Closing Soon!)";
                toAppend.append(closingSoon);
              }
              else{
                toAppend.append(rest.name);
              }
              document.getElementById("open").append(toAppend);
              // add to random list
              random.push(rest.name);
              // exit function
              return;
            }
          }
        }
        // if opening soon print as closed with opening soon
        if((rest.hours[j].open.time - currentTime) <= 100 && (rest.hours[j].open.time - currentTime) >= 1){
          var toAppend = document.createElement("li");
          toAppend.append(rest.name);
          var openingSoon = document.createElement("span");
          openingSoon.innerHTML = " (Opening Soon!)";
          toAppend.append(openingSoon);
          document.getElementById("closed").append(toAppend);
          // exit function
          return;
        }
      }
  // otherwise print as closed
  var toAppend = document.createElement("li");
  toAppend.append(rest.name);
  document.getElementById("closed").append(toAppend);
}

function addRestaurant(){

    var hoursArray = [];

    function getAddTime(addId){
        return document.getElementById(addId).value.replace(":","");
    }

    function collectHours(day, num){
        if(document.getElementById("add" + day + "Open").value){
            hoursArray.push({
                "open": { "day": num, "time": getAddTime("add" + day + "Open")},
                "close": { "day": num, "time": getAddTime("add" + day + "Close") }
              });
        }
    }

    collectHours("Mon", 1);
    collectHours("Tue", 2);
    collectHours("Wed", 3);
    collectHours("Thu", 4);
    collectHours("Fri", 5);
    collectHours("Sat", 6);
    collectHours("Sun", 7);

    data.restaurants.push({
        "name": document.getElementById("addName").value,
        "hours": hoursArray
    })

    saveData();
    refreshLists();
    document.getElementById("addModal").classList.add("modal-hidden");

    console.log("Updated Data:" + JSON.stringify(data));
}

function removeRestaurant(remName){
    for(i=0; i<data.restaurants.length; i++){
        console.log("checking " + data.restaurants[i].name);
        if (data.restaurants[i].name  == remName) {
            data.restaurants.splice(i, 1);
        }
    }
    saveData();
    refreshLists();
    document.getElementById("removeModal").classList.add("modal-hidden");
}

function saveData(){
  window.localStorage.setItem("data", JSON.stringify(data));
  console.log("saved: " + JSON.stringify(data));
}

function retrieveData(){
  if(window.localStorage.getItem("data"))
  {
    data = JSON.parse(window.localStorage.getItem("data"));
    console.log("retrieved: " + JSON.stringify(data));
  }
  else{
    data = {"restaurants":[]}
  }
}

function toggleModalVisibility(modal){
  document.getElementById(modal).classList.toggle("modal-hidden");
  $("#searchStatus").hide();
  switchToAuto();
  $("#searchResults").html("");
  $("#manualSwitch").hide();
  $("#searchStatus").hide();
}

function resetData(){
  data = {"restaurants":[{"name":"Panera Bread","hours":[{"open":{"day":1,"time":"0600"},"close":{"day":1,"time":"2130"}},{"open":{"day":2,"time":"0600"},"close":{"day":2,"time":"2130"}},{"open":{"day":3,"time":"0600"},"close":{"day":3,"time":"2130"}},{"open":{"day":4,"time":"0600"},"close":{"day":4,"time":"2130"}},{"open":{"day":5,"time":"0600"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"0600"},"close":{"day":6,"time":"2200"}},{"open":{"day":7,"time":"0600"},"close":{"day":7,"time":"2100"}}]},{"name":"Col's Kitchen","hours":[{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2000"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2000"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2000"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2000"}},{"open":{"day":7,"time":"0900"},"close":{"day":7,"time":"1900"}}]},{"name":"Splendid Sushi","hours":[{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"1900"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"1900"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"1900"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"1900"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2000"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2000"}}]},{"name":"Chipotle Mexican Grill","hours":[{"close":{"day":0,"time":"2200"},"open":{"day":0,"time":"1045"}},{"close":{"day":1,"time":"2200"},"open":{"day":1,"time":"1045"}},{"close":{"day":2,"time":"2200"},"open":{"day":2,"time":"1045"}},{"close":{"day":3,"time":"2200"},"open":{"day":3,"time":"1045"}},{"close":{"day":4,"time":"2200"},"open":{"day":4,"time":"1045"}},{"close":{"day":5,"time":"2200"},"open":{"day":5,"time":"1045"}},{"close":{"day":6,"time":"2200"},"open":{"day":6,"time":"1045"}}]},{"name":"Olive Garden Italian Restaurant","hours":[{"close":{"day":0,"time":"2200"},"open":{"day":0,"time":"1100"}},{"close":{"day":1,"time":"2200"},"open":{"day":1,"time":"1100"}},{"close":{"day":2,"time":"2200"},"open":{"day":2,"time":"1100"}},{"close":{"day":3,"time":"2200"},"open":{"day":3,"time":"1100"}},{"close":{"day":4,"time":"2200"},"open":{"day":4,"time":"1100"}},{"close":{"day":5,"time":"2300"},"open":{"day":5,"time":"1100"}},{"close":{"day":6,"time":"2300"},"open":{"day":6,"time":"1100"}}]},{"name":"B.GOOD","hours":[{"close":{"day":0,"time":"1900"},"open":{"day":0,"time":"1100"}},{"close":{"day":1,"time":"2000"},"open":{"day":1,"time":"1100"}},{"close":{"day":2,"time":"2000"},"open":{"day":2,"time":"1100"}},{"close":{"day":3,"time":"2000"},"open":{"day":3,"time":"1100"}},{"close":{"day":4,"time":"2000"},"open":{"day":4,"time":"1100"}},{"close":{"day":5,"time":"2000"},"open":{"day":5,"time":"1100"}},{"close":{"day":6,"time":"2000"},"open":{"day":6,"time":"1100"}}]},{"name":"Dos Amigos Burritos","hours":[{"close":{"day":1,"time":"2100"},"open":{"day":1,"time":"1100"}},{"close":{"day":2,"time":"2100"},"open":{"day":2,"time":"1100"}},{"close":{"day":3,"time":"2000"},"open":{"day":3,"time":"1100"}},{"close":{"day":4,"time":"2000"},"open":{"day":4,"time":"1100"}},{"close":{"day":5,"time":"2100"},"open":{"day":5,"time":"1100"}},{"close":{"day":6,"time":"2000"},"open":{"day":6,"time":"1100"}}]},{"name":"The Works Café","hours":[{"close":{"day":0,"time":"2000"},"open":{"day":0,"time":"0600"}},{"close":{"day":1,"time":"2000"},"open":{"day":1,"time":"0600"}},{"close":{"day":2,"time":"2000"},"open":{"day":2,"time":"0600"}},{"close":{"day":3,"time":"2000"},"open":{"day":3,"time":"0600"}},{"close":{"day":4,"time":"2000"},"open":{"day":4,"time":"0600"}},{"close":{"day":5,"time":"2000"},"open":{"day":5,"time":"0600"}},{"close":{"day":6,"time":"2000"},"open":{"day":6,"time":"0600"}}]},{"name":"Siam Orchid Thai Bistro","hours":[{"close":{"day":0,"time":"1500"},"open":{"day":0,"time":"1100"}},{"close":{"day":0,"time":"2100"},"open":{"day":0,"time":"1600"}},{"close":{"day":2,"time":"1500"},"open":{"day":2,"time":"1100"}},{"close":{"day":2,"time":"2100"},"open":{"day":2,"time":"1600"}},{"close":{"day":3,"time":"1500"},"open":{"day":3,"time":"1100"}},{"close":{"day":3,"time":"2100"},"open":{"day":3,"time":"1600"}},{"close":{"day":4,"time":"1500"},"open":{"day":4,"time":"1100"}},{"close":{"day":4,"time":"2100"},"open":{"day":4,"time":"1600"}},{"close":{"day":5,"time":"1500"},"open":{"day":5,"time":"1100"}},{"close":{"day":5,"time":"2130"},"open":{"day":5,"time":"1600"}},{"close":{"day":6,"time":"1500"},"open":{"day":6,"time":"1100"}},{"close":{"day":6,"time":"2130"},"open":{"day":6,"time":"1600"}}]},{"name":"Man Yee Express","hours":[{"close":{"day":0,"time":"2130"},"open":{"day":0,"time":"1100"}},{"close":{"day":1,"time":"2130"},"open":{"day":1,"time":"1030"}},{"close":{"day":2,"time":"2130"},"open":{"day":2,"time":"1030"}},{"close":{"day":3,"time":"2130"},"open":{"day":3,"time":"1030"}},{"close":{"day":4,"time":"2130"},"open":{"day":4,"time":"1030"}},{"close":{"day":5,"time":"2230"},"open":{"day":5,"time":"1030"}},{"close":{"day":6,"time":"2230"},"open":{"day":6,"time":"1030"}}]},{"name":"House of India","hours":[{"close":{"day":0,"time":"2030"},"open":{"day":0,"time":"1500"}},{"close":{"day":2,"time":"2030"},"open":{"day":2,"time":"1500"}},{"close":{"day":3,"time":"2030"},"open":{"day":3,"time":"1500"}},{"close":{"day":4,"time":"2030"},"open":{"day":4,"time":"1500"}},{"close":{"day":5,"time":"2030"},"open":{"day":5,"time":"1500"}},{"close":{"day":6,"time":"2030"},"open":{"day":6,"time":"1500"}}]},{"name":"Live Juice","hours":[{"close":{"day":1,"time":"1500"},"open":{"day":1,"time":"0900"}},{"close":{"day":2,"time":"1500"},"open":{"day":2,"time":"0900"}},{"close":{"day":3,"time":"1500"},"open":{"day":3,"time":"0900"}},{"close":{"day":4,"time":"1500"},"open":{"day":4,"time":"0900"}},{"close":{"day":5,"time":"1500"},"open":{"day":5,"time":"0900"}},{"close":{"day":6,"time":"1500"},"open":{"day":6,"time":"0900"}}]},{"name":"Vibes Gourmet Burgers","hours":[{"close":{"day":0,"time":"2000"},"open":{"day":0,"time":"1200"}},{"close":{"day":3,"time":"2000"},"open":{"day":3,"time":"1130"}},{"close":{"day":4,"time":"2000"},"open":{"day":4,"time":"1130"}},{"close":{"day":5,"time":"2000"},"open":{"day":5,"time":"1130"}},{"close":{"day":6,"time":"2000"},"open":{"day":6,"time":"1200"}}]},{"name":"Tucker's","hours":[{"close":{"day":0,"time":"1400"},"open":{"day":0,"time":"0700"}},{"close":{"day":1,"time":"1400"},"open":{"day":1,"time":"0700"}},{"close":{"day":2,"time":"1400"},"open":{"day":2,"time":"0700"}},{"close":{"day":3,"time":"1400"},"open":{"day":3,"time":"0700"}},{"close":{"day":4,"time":"1400"},"open":{"day":4,"time":"0700"}},{"close":{"day":5,"time":"1400"},"open":{"day":5,"time":"0700"}},{"close":{"day":6,"time":"1400"},"open":{"day":6,"time":"0700"}}]},{"name":"The Barley House Restaurant & Tavern","hours":[{"close":{"day":0,"time":"2100"},"open":{"day":0,"time":"1130"}},{"close":{"day":1,"time":"2100"},"open":{"day":1,"time":"1130"}},{"close":{"day":2,"time":"2100"},"open":{"day":2,"time":"1130"}},{"close":{"day":4,"time":"2200"},"open":{"day":4,"time":"1130"}},{"close":{"day":5,"time":"2200"},"open":{"day":5,"time":"1130"}},{"close":{"day":6,"time":"2200"},"open":{"day":6,"time":"1130"}}]},{"name":"The Common Man Restaurant","hours":[{"close":{"day":0,"time":"2100"},"open":{"day":0,"time":"1130"}},{"close":{"day":1,"time":"2100"},"open":{"day":1,"time":"1130"}},{"close":{"day":2,"time":"2100"},"open":{"day":2,"time":"1130"}},{"close":{"day":3,"time":"2100"},"open":{"day":3,"time":"1130"}},{"close":{"day":4,"time":"2100"},"open":{"day":4,"time":"1130"}},{"close":{"day":5,"time":"2130"},"open":{"day":5,"time":"1130"}},{"close":{"day":6,"time":"2130"},"open":{"day":6,"time":"1130"}}]},{"name":"Hermanos","hours":[{"close":{"day":2,"time":"2100"},"open":{"day":2,"time":"1500"}},{"close":{"day":3,"time":"2100"},"open":{"day":3,"time":"1500"}},{"close":{"day":4,"time":"2100"},"open":{"day":4,"time":"1500"}},{"close":{"day":5,"time":"2100"},"open":{"day":5,"time":"1200"}},{"close":{"day":6,"time":"2100"},"open":{"day":6,"time":"1200"}}]}]}
  saveData();
  refreshLists();
}

function chooseRandom(){
  if(random.length > 0){
    document.getElementById("random-result").innerHTML = (random[Math.floor(Math.random()*random.length)]);
    toggleModalVisibility("randomModal");
  }
  else{
    document.getElementById("random-result").innerHTML = "No restaurants are currently open!";
    toggleModalVisibility("randomModal");
  }
}

async function searchRestaurants(){
  $("#searchResults").html("");
  $("#manualSwitch").hide();
  $("#searchStatus").text("Loading...").show();
  await $.get("https://us-central1-direct-hope-351923.cloudfunctions.net/eat-search-to-id?zip=" + encodeURIComponent($("#searchZip").val()) + "&search=" + encodeURIComponent($("#searchName").val()), function(retrievedData) {
    document.getElementById("searchResults").innerHTML = "";
    console.log("retrieved data: " + JSON.stringify(retrievedData));
    if(retrievedData.results.length == 0){
      $("#searchStatus").text("No results found!").show();
      $("#manualSwitch").show();
    }
    else{
      $("#searchStatus").hide();
      for(var i=0;i<retrievedData.results.length;i++){
        var button = document.createElement("button");
        button.append("Select");
        button.setAttribute("onclick", 'addRestaurantFromId("' + retrievedData.results[i].id + '","' + encodeURIComponent(retrievedData.results[i].name) + '")');
        button.setAttribute("style", "margin-left:5px;");
        var item = document.createElement("li");
        item.append(retrievedData.results[i].name + " (" + retrievedData.results[i].vicinity + ")");
        item.append(button);
        document.getElementById("searchResults").append(item);
      };
      $("#manualSwitch").show();
    }
  });
}

async function addRestaurantFromId(id, name){
  await $.get("https://us-central1-direct-hope-351923.cloudfunctions.net/eat-id-to-hours?id=" + id, function(retrievedData) {
    console.log("retrieved hours: " + JSON.stringify(retrievedData));

    var hoursArray = retrievedData.results;

    data.restaurants.push({
      "name": decodeURIComponent(name),
      "hours": hoursArray
    })

    saveData();
    refreshLists();
    $("#searchResults").html("");
    $("#searchStatus").text("Added!").show();
    $("#manualSwitch").hide();
    console.log("Updated Data:" + JSON.stringify(data));
  });
}

function switchToManual(){
  $("#addAuto").hide();
  $("#addManual").show();
}

function switchToAuto(){
  $("#addManual").hide();
  $("#addAuto").show();
}


/* keyboard support for forms */

function formKeyboardSupport(inputs, submitButton){
  $(inputs).keypress(function(e) {
    if(e.which == 13) {
        $(submitButton).focus().click();
    }
  });
}

function preventSubmit(form){
  $(form).submit(function(e) {
    e.preventDefault();
  });
}

formKeyboardSupport("#addAuto input", "#addAuto #searchButton");
preventSubmit("#addAuto");


