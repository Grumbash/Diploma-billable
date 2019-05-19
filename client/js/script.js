$("#upload").on("click", function() {
  var file_data = $("#file").prop("files")[0];
  var form_data = new FormData();
  form_data.append("file", file_data);
  alert(form_data);
  $.ajax({
    url: "/upload",
    dataType: "text",
    cache: false,
    contentType: false,
    processData: false,
    data: form_data,
    type: "post",
    success: function(response) {
      console.log(response);
    }
  });
});

$(".detecting-btn").on("click", function(e) {});
