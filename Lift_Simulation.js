var floorHeight = 100;
var totalFloors = 8;
var totalLifts = 3;

var lifts = [];
var floorsContainer = document.getElementById("floors-container");
var liftsContainer = document.getElementById("lifts-container");

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
      "<span class='floor-label'>Floor " +
      f +
      "</span>" +
      "<div class='floor-buttons'>" +
      "<button class='call-btn' onclick='callLift(" +
      f +
      ")'>&#9650;</button>" +
      "<button class='call-btn' onclick='callLift(" +
      f +
      ")'>&#9660;</button>" +
      "</div>";
    floorsContainer.appendChild(row);
  }
}

function createLift(id) {
  var liftLane = document.createElement("div");
  liftLane.className = "lift-lane";
  liftLane.innerHTML =
    "<div class='lift' id='lift-" +
    id +
    "'>" +
    "<div class='doors'>" +
    "<div class='door-left'></div>" +
    "<div class='door-right'></div>" +
    "</div>" +
    "<div class='lift-info'>L" +
    id +
    " (FL 1)</div>" +
    "</div>";
  liftsContainer.appendChild(liftLane);

  lifts.push({
    id: id,
    floor: 1,
    moving: false,
    el: liftLane.querySelector(".lift"),
    info: liftLane.querySelector(".lift-info"),
    target: null,
    direction: 0,
    queue: [],
    doorsOpen: false,
  });
}

function findClosestLift(floor, matches) {
  var closestLift = null;
  var minDistance = Infinity;

  for (var i = 0; i < lifts.length; i++) {
    var lift = lifts[i];
    var distance = Math.abs(lift.floor - floor);
    if (matches(lift) && distance < minDistance) {
      closestLift = lift;
      minDistance = distance;
    }
  }

  return closestLift;
}

function callLift(floor) {

  var selectedLift =
    findClosestLift(floor, function (lift) {
      return !lift.moving;
    }) ||
    findClosestLift(floor, function () {
      return true;
    });

  if (floor === selectedLift.floor && selectedLift.doorsOpen) return;
  if (selectedLift.queue.indexOf(floor) === -1) {
    selectedLift.queue.push(floor);
  }
  processLiftQueue(selectedLift);
}

function processLiftQueue(lift) {

  var currentStopIndex = lift.queue.indexOf(lift.floor);
  if (currentStopIndex !== -1) {
    lift.queue.splice(currentStopIndex, 1);
    lift.moving = true;
    lift.target = lift.floor;
    lift.doorsOpen = true;
    lift.el.classList.add("doors-open");
    setTimeout(function () {
      lift.el.classList.remove("doors-open");
      lift.doorsOpen = false;
      setTimeout(function () {
        processLiftQueue(lift);
      }, 800);
    }, 1500);
    return;
  }

  if (lift.queue.length === 0) {
    lift.moving = false;
    lift.target = null;
    lift.direction = 0;
    return;
  }

  if (lift.direction === 0) {
    var nearestStop = lift.queue[0];
    for (var i = 1; i < lift.queue.length; i++) {
      if (
        Math.abs(lift.queue[i] - lift.floor) <
        Math.abs(nearestStop - lift.floor)
      ) {
        nearestStop = lift.queue[i];
      }
    }
    lift.direction = nearestStop > lift.floor ? 1 : -1;
  }

  var hasStopAhead = lift.queue.some(function (stop) {
    return lift.direction > 0 ? stop > lift.floor : stop < lift.floor;
  });
  if (!hasStopAhead) {
    lift.direction *= -1;
  }

  lift.moving = true;
  lift.target = lift.direction > 0 ? lift.floor + 1 : lift.floor - 1;
  lift.el.style.transition = "transform 1s linear";
  lift.el.style.transform =
    "translateY(-" + (lift.target - 1) * floorHeight + "px)";

  setTimeout(function () {
    lift.floor = lift.target;
    lift.info.innerText = "L" + lift.id + " (FL " + lift.floor + ")";
    processLiftQueue(lift);
  }, 1050);
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
