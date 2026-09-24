var floorHeight = 100;
var totalFloors = 8;
var totalLifts = 3;

var lifts = [];
var floorsContainer = document.getElementById("floors-container");
var shaftsContainer = document.getElementById("shafts-container");

function init() {
  createFloors();
  for (var i = 1; i <= totalLifts; i++) {
    createLift(i);
  }
}

function createFloors() {
  floorsContainer.innerHTML = "";
  for (var f = totalFloors; f >= 1; f--) {
    var row = document.createElement("div");
    row.className = "floor-row";
    row.innerHTML = 
      "<span class='floor-label'>Floor " + f + "</span>" +
      "<div class='floor-buttons'>" +
        "<button class='call-btn' onclick='callLift(" + f + ")'>▲</button>" +
        "<button class='call-btn' onclick='callLift(" + f + ")'>▼</button>" +
      "</div>";
    floorsContainer.appendChild(row);
  }
}

function createLift(id) {
  var shaft = document.createElement("div");
  shaft.className = "shaft";
  shaft.innerHTML = 
    "<div class='lift' id='lift-" + id + "'>" +
      "<div class='doors'>" +
        "<div class='door-left'></div>" +
        "<div class='door-right'></div>" +
      "</div>" +
      "<div class='lift-info'>L" + id + " (FL 1)</div>" +
    "</div>";
  shaftsContainer.appendChild(shaft);

  lifts.push({
    id: id,
    floor: 1,
    moving: false,
    el: shaft.querySelector(".lift"),
    info: shaft.querySelector(".lift-info"),
    target: null
  });
}

function callLift(floor) {
  var selectedLift = null;
  var minDistance = 999;

  for (var i = 0; i < lifts.length; i++) {
    var l = lifts[i];
    if (l.moving && l.target > l.floor && floor > l.floor && floor < l.target) {
      selectedLift = l;
      break;
    }
  }

  if (!selectedLift) {
    for (var i = 0; i < lifts.length; i++) {
      var l = lifts[i];
      if (!l.moving) {
        var dist = Math.abs(l.floor - floor);
        if (dist < minDistance) {
          minDistance = dist;
          selectedLift = l;
        }
      }
    }
  }

  if (!selectedLift) {
    selectedLift = lifts[0];
  }

  if (selectedLift.moving && selectedLift.target > floor) {
    var originalTarget = selectedLift.target;
    moveLift(selectedLift, floor, function() {
      moveLift(selectedLift, originalTarget, null);
    });
  } else {
    moveLift(selectedLift, floor, null);
  }
}

function moveLift(lift, targetFloor, callback) {
  lift.moving = true;
  lift.target = targetFloor;
  
  var diff = Math.abs(lift.floor - targetFloor);
  var duration = diff * 1;
  if (duration === 0) duration = 0.5;

  lift.el.style.transition = "transform " + duration + "s linear";
  lift.el.style.transform = "translateY(-" + ((targetFloor - 1) * floorHeight) + "px)";

  setTimeout(function() {
    lift.floor = targetFloor;
    lift.info.innerText = "L" + lift.id + " (FL " + targetFloor + ")";
    
    lift.el.classList.add("doors-open");
    setTimeout(function() {
      lift.el.classList.remove("doors-open");
      setTimeout(function() {
        lift.moving = false;
        if (callback) {
          callback();
        }
      }, 800);
    }, 1500);
  }, duration * 1000);
}

function addFloor() {
  totalFloors++;
  createFloors();
}

function addLift() {
  totalLifts++;
  createLift(totalLifts);
}

document.getElementById("add-floor-btn").onclick = addFloor;
document.getElementById("add-lift-btn").onclick = addLift;

init();