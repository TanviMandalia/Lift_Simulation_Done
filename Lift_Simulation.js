var floorHeight = 100;
var totalFloors = 8;
var totalLifts = 3;

var lifts = [];
var floorsContainer = document.getElementById("floors-container");
var liftsContainer = document.getElementById("lifts-container");

function init() {
  createFloor();
  for (var i = 1; i <= totalLifts; i++) {
    createLift(i);
  }
}

function createFloor() {
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
  var lane = document.createElement("div");
  lane.className = "lift-lane";
  lane.innerHTML =
    "<div class='lift'>" +
    "<div class='doors'><div class='door-left'></div><div class='door-right'></div></div>" +
    "<div class='lift-info'>L" +
    id +
    " (FL 1)</div>" +
    "</div>";
  liftsContainer.appendChild(lane);

  lifts.push({
    id: id,
    floor: 1,
    direction: 0,
    busy: false,
    queue: [],
    el: lane.querySelector(".lift"),
    info: lane.querySelector(".lift-info"),
  });
}

function isAhead(lift, floor) {
  return (floor - lift.floor) * lift.direction > 0;
}

function pickLift(floor) {
  var best = null;
  var bestDistance = Infinity;

  lifts.forEach(function (lift) {
    var distance = Math.abs(lift.floor - floor);
    var canTake = !lift.busy || isAhead(lift, floor);
    if (canTake && distance < bestDistance) {
      best = lift;
      bestDistance = distance;
    }
  });

  lifts.forEach(function (lift) {
    var distance = Math.abs(lift.floor - floor);
    if (distance < bestDistance) {
      best = lift;
      bestDistance = distance;
    }
  });
  return best;
}

function callLift(floor) {
  var lift = pickLift(floor);
  if (lift.queue.indexOf(floor) === -1) {
    lift.queue.push(floor);
  }
  if (!lift.busy) {
    moveLift(lift);
  }
}

function moveLift(lift) {
  var index = lift.queue.indexOf(lift.floor);
  if (index !== -1) {
    lift.queue.splice(index, 1);
    lift.busy = true;
    lift.el.classList.add("doors-open");
    setTimeout(function () {
      lift.el.classList.remove("doors-open");
      setTimeout(function () {
        moveLift(lift);
      }, 800);
    }, 1500);
    return;
  }

  if (lift.queue.length === 0) {
    lift.busy = false;
    lift.direction = 0;
    return;
  }

  var stopAhead = lift.queue.some(function (stop) {
    return isAhead(lift, stop);
  });
  if (!stopAhead) {
    lift.direction = lift.queue[0] > lift.floor ? 1 : -1;
  }

  var nextFloor = lift.floor + lift.direction;
  lift.busy = true;
  lift.el.style.transition = "transform 1s linear";
  lift.el.style.transform =
    "translateY(-" + (nextFloor - 1) * floorHeight + "px)";

  setTimeout(function () {
    lift.floor = nextFloor;
    lift.info.innerText = "L" + lift.id + " (FL " + lift.floor + ")";
    moveLift(lift);
  }, 1050);
}

function addFloor() {
  totalFloors++;
  createFloor();
}

function addLift() {
  totalLifts++;
  createLift(totalLifts);
}

document.getElementById("add-floor-btn").onclick = addFloor;
document.getElementById("add-lift-btn").onclick = addLift;

init();
