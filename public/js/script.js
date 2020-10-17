$(document).ready(function () {
  $("#steamBtn").on("click", function (event) {
    $.get("/auth/steam", function (data) {
      console.log(data);
    });
  });
});
