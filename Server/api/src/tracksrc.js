// זאת היא פונקציה שמפעילה את עצמה ברגע שצג לקוח מקבל אותה דרך תגית הסקריפט
(function(){
  let XCoordinates = [];
  let YCoordinates = [];
  let currentWebsite = window.location.href;

  document.addEventListener("mousemove", function(event) {

    setTimeout(function(){
      XCoordinates.push(event.clientX);
      YCoordinates.push(event.clientY);
    },1000/5);

  });

  window.addEventListener("visibilitychange", function() {

    fetch('http://localhost:3001/mousetracker/savetrack', {
      method: "POST",
      body: JSON.stringify({ArrX: XCoordinates, ArrY: YCoordinates, CurrentWebsite: currentWebsite}),
      headers: {
        "Content-Type": "application/json"
      }
    });

  });
})();