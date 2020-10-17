$(document).ready(function () {
  $("#steamBtn").on("click", function (data) {
    $.get("/auth/steam", function (data) {
      console.log(data);
    });
  });
});
