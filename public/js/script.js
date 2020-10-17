$(document).ready(function () {
  $("#steamBtn").on("click", function (event) {
    $.get("/signin/auth/steam", function (data) {
      console.log(data);
    });
  });
});
