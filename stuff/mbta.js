$.ajax({
  url: "https://api-v3.mbta.com/alerts?filter[activity]=USING_ESCALATOR,BOARD,EXIT,RIDE",
  type: "GET",
  success: function(result) {
    console.log(result);
  }
});
