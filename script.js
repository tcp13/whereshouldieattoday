var data = {};
var random = [];
var currentRaw = new Date();

var currentDay = currentRaw.getDay();
var currentTime = (currentRaw.getHours()*100)+currentRaw.getMinutes();

/*
var currentDay = 6;
var currentTime = 2230;
$("body").prepend("<p style='color:#a91c17;'>Day/Time: " + currentDay + "/" + currentTime + "</p>");
*/


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
        var item = document.createElement("li");
        button.append(data.restaurants[i].name);
        button.setAttribute("onclick", 'removeRestaurant("' + data.restaurants[i].name + '")');
        item.append(button);
        document.getElementById("removeList").append(item);



        /*
        $("#removeList").append("<li><button onclick=\"removeRestaurant(" + data.restaurants[i].name + "\");'>" + data.restaurants[i].name + "</button></li>");
        */

        /*
        var button = document.createElement("button");
        button.append("Remove");
        button.setAttribute("onclick", 'removeRestaurant("' + data.restaurants[i].name + '")');
        button.setAttribute("style", "margin-left:5px;");
        var item = document.createElement("li");
        item.append(data.restaurants[i].name);
        item.append(button);
        document.getElementById("removeList").append(item);
        */
    }
    alphabetize("#open");
    alphabetize("#closed");
    alphabetize("#removeList");

    // hide closed heading if nothing is closed
    if($("#closed").children().length > 0){
      $("#closedHeading").show();
    }
    else{
      $("#closedHeading").hide();
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
                      closingSoon.innerHTML = " <img class='closing-icon red-filter' src='icons/clock.svg' title='Closing Soon!'>";
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
                closingSoon.innerHTML = " <img class='closing-icon red-filter' src='icons/clock.svg' title='Closing Soon!'>";
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
          openingSoon.innerHTML = " <img class='closing-icon green-filter' src='icons/clock.svg' title='Opening Soon!'>";
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
  /* input validation */

  function validateTimes(day){
    if($("#add" + day + "Open").val()){
      if($("#add" + day + "Open").val() >= $("#add" + day + "Close").val()){
        console.log("%c" + day + ": error. Open is after close.", "color:orange");
        return true; //error
      }
      else{
        console.log("%c" + day + ": valid. Close is after open.", "color:orange");
        return false //no error
      }
    }
    else{
      console.log("%c" + day + ": valid. Not open at all.", "color:orange");
      return false; //no error
    }
  }

  $(".error-alert").remove();
  if(document.getElementById("addName").value == ""){
    $("#addManual").append("<p class='error-alert'>Error: Missing restaurant name.</p>");
  }
  else if(validateTimes("Mon")){
    $("#addManual").append("<p class='error-alert'>Error: Opening times must be before closing times.</p>");
  }
  else if(validateTimes("Tue")){
    $("#addManual").append("<p class='error-alert'>Error: Opening times must be before closing times.</p>");
  }
  else if(validateTimes("Wed")){
    $("#addManual").append("<p class='error-alert'>Error: Opening times must be before closing times.</p>");
  }
  else if(validateTimes("Thu")){
    $("#addManual").append("<p class='error-alert'>Error: Opening times must be before closing times.</p>");
  }
  else if(validateTimes("Fri")){
    $("#addManual").append("<p class='error-alert'>Error: Opening times must be before closing times.</p>");
  }
  else if(validateTimes("Sat")){
    $("#addManual").append("<p class='error-alert'>Error: Opening times must be before closing times.</p>");
  }
  else if(validateTimes("Sun")){
    $("#addManual").append("<p class='error-alert'>Error: Opening times must be before closing times.</p>");
  }
  else{
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
  }
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
  $(".error-alert").remove();
}

function locateZip(){
  if($("#searchZip").val() == "" && navigator.geolocation){
    navigator.geolocation.getCurrentPosition(async function(position) {
        await $.get("https://us-central1-direct-hope-351923.cloudfunctions.net/eat-coords-to-zip?lat=" + position.coords.latitude + "&lng=" + position.coords.longitude, function(retrievedData) {
          if(retrievedData.result){
            $("#searchZip").val(retrievedData.result);
          }
      });
    });
  }
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

  if($("#searchName").val() == ""){
    $("#searchName").val("McDonald's");
  }
  if($("#searchZip").val() == ""){
    $("#searchZip").val("90210");
  }

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

        var onclick = 'addRestaurantFromId("' + retrievedData.results[i].id + '","' + encodeURIComponent(retrievedData.results[i].name) + '")';
        var content = retrievedData.results[i].name + " <span style='font-weight:300;'>(" + retrievedData.results[i].vicinity + ")</span>";
        $("#searchResults").append("<li><button onclick=" + onclick + ">" + content + "</button></li>");
      };
      $("#manualSwitch").show();
    }
  });
}

async function addRestaurantFromId(id, name){
  await $.get("https://us-central1-direct-hope-351923.cloudfunctions.net/eat-id-to-hours?id=" + id, function(retrievedData) {
    console.log("retrieved hours: " + JSON.stringify(retrievedData));

    var hoursArray = retrievedData.results;

    if(retrievedData.results.length == 0){
      $("#searchStatus").text("Error: Unable to retrieve hours for " + decodeURIComponent(name) + "!").show();
    }
    else{
      data.restaurants.push({
        "name": decodeURIComponent(name),
        "hours": hoursArray
      })

      saveData();
      refreshLists();
      $("#searchResults").html("");
      $("#searchStatus").text("Added " + decodeURIComponent(name) + "!").show();
      $("#manualSwitch").hide();
      console.log("Updated Data:" + JSON.stringify(data));
    }
  });
}

function switchToManual(){
  $("#addAuto").hide();
  $("#addManual").show();

  function setDefaultValues(day){
    $("#check" + day).prop("checked", false);
    $("#add" + day + "Open").show();
    $("#add" + day + "Close").show();
    $("label[for='add" + day + "Open'").show();
    $("label[for='add" + day + "Close'").show();
    $("#add" + day + "Open").val("09:00");
    $("#add" + day + "Close").val("17:00");
    checkboxListener(day);
  }

  setDefaultValues("Mon");
  setDefaultValues("Tue");
  setDefaultValues("Wed");
  setDefaultValues("Thu");
  setDefaultValues("Fri");
  setDefaultValues("Sat");
  setDefaultValues("Sun");
}

function switchToAuto(){
  $("#addManual").hide();
  $("#addAuto").show();
}

function alphabetize(list){
  var mylist = $(list);
  var listitems = mylist.children('li').get();
  listitems.sort(function(a, b) {
    return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
  })
  $.each(listitems, function(idx, itm) { mylist.append(itm); });
}

function checkboxListener(day){
  $("#check" + day).change(function(){
    if(this.checked){
      $("#add" + day + "Open").hide();
      $("#add" + day + "Close").hide();
      $("label[for='add" + day + "Open'").hide();
      $("label[for='add" + day + "Close'").hide();
      $("#add" + day + "Open").val("");
      $("#add" + day + "Close").val("");
    }
    else{
      $("#add" + day + "Open").show();
      $("#add" + day + "Close").show();
      $("label[for='add" + day + "Open'").show();
      $("label[for='add" + day + "Close'").show();
    }
  });
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

function escapeSupport(){
  $(document).keyup(function(e) {
    if(e.which == 27) {
      $(".modal").addClass("modal-hidden");
      $("#searchStatus").hide();
      switchToAuto();
      $("#searchResults").html("");
      $("#manualSwitch").hide();
      $("#searchStatus").hide();
      $(".error-alert").remove();
    }
  });
}

formKeyboardSupport("#addAuto input", "#addAuto #searchButton");
preventSubmit("#addAuto");
escapeSupport();