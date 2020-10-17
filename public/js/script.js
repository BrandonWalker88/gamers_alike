$(document).ready(function () {
    console.log("Hello world");
  $(".friendMe").on("submit", function (event) {
    console.log("friend me clicked");
    id = $(this).data("friend");
    const potentialFriend = {
      requesteeId: id,
    };

    $.ajax("/api/sendFriendInvite/", {
      type: "PUT",
      data: potentialFriend,
    }).then(function () {
      console.log("sent friend request to id: " + id);
      location.reload();
    });
  });
});
