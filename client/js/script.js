let uploadName;
const sections = $(".upload-section");
const url = "http://localhost:3000";
const data = new FormData();
$(".detect").on("click", function(e) {
  uploadName = "detect";
  $(".upload-section-first").toggleClass("upload-section_active");
});

$(".parse").on("click", function(e) {
  uploadName = "parse";
  $(".upload-section-first").toggleClass("upload-section_active");
});

$(".convert").on("click", function(e) {
  uploadName = "convert";
  $(".upload-section-first").toggleClass("upload-section_active");
});

$(".time").on("click", function(e) {
  uploadName = "time";
  $(".upload-section-second").toggleClass("upload-section_active");
});

$(".resync").on("click", function(e) {
  uploadName = "resync";
  $(".upload-section-second").toggleClass("upload-section_active");
});

$(".convertToFormat").on("click", function(e) {
  uploadName = "convertToFormat";
  $(".upload-section-second").toggleClass("upload-section_active");
});

$(".upload-section-first__btn").on("click", function(e) {
  const files = $(".upload-section-first__input")[0].files;
  const data_inner = files[files.length - 1];
  console.log("TCL: data_inner", files);
  data.append(data_inner.name, data_inner);
  $.ajax({
    url: url + "/" + uploadName,
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    method: "POST",
    success: function(res) {
      console.log(res);
    }
  });
  data.delete(data_inner.name);

  // console.log(data_inner);
});
