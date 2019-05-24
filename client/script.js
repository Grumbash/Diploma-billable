let uploadName;
const sections = $(".upload-section");
const url = "http://localhost:3000";

function download(fileName) {
  var element = document.createElement("a");
  const path = fileName;
  console.log(path);
  element.setAttribute("href", path);
  element.setAttribute("download", fileName);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  $.ajax({
    url: url + "/deleteFile",
    data: JSON.stringify({ fileName }),
    type: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    success: function(res) {
      console.log(res);
    }
  });
  document.body.removeChild(element);
}

$(".detect").on("click", function(e) {
  uploadName = "detect";
  $(".upload-section").removeClass("upload-section_active");
  $(".upload-section-detect").toggleClass("upload-section_active");
});

$(".parse").on("click", function(e) {
  uploadName = "parse";
  $(".upload-section").removeClass("upload-section_active");
  $(".upload-section-parse").toggleClass("upload-section_active");
});

$(".convert").on("click", function(e) {
  uploadName = "convert";
  $(".upload-section").removeClass("upload-section_active");
  $(".upload-section-convert").toggleClass("upload-section_active");
});

$(".time").on("click", function(e) {
  uploadName = "time";
  $(".upload-section").removeClass("upload-section_active");
  $(".upload-section-time").toggleClass("upload-section_active");
});

$(".resync").on("click", function(e) {
  uploadName = "resync";
  $(".upload-section").removeClass("upload-section_active");
  $(".upload-section-resync").toggleClass("upload-section_active");
});

$(".convertToFormat").on("click", function(e) {
  uploadName = "convertToFormat";
  $(".upload-section").removeClass("upload-section_active");
  $(".upload-section-convertToFormat").toggleClass("upload-section_active");
});

$(".upload-section-detect__btn").on("click", function(e) {
  const data = new FormData();
  e.preventDefault();
  const files = $(".upload-section-detect__input")[0].files;
  const data_inner = files[files.length - 1];
  console.log("TCL: data_inner", files);
  data.set(data_inner.name, data_inner);
  $.ajax({
    url: url + "/" + uploadName,
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    method: "POST",
    success: function(res) {
      alert(`Format is: ${res.format}`);
    }
  });
});

$(".upload-section-parse__btn").on("click", function(e) {
  const data = new FormData();
  e.preventDefault();
  const files = $(".upload-section-parse__input")[0].files;
  const data_inner = files[files.length - 1];
  console.log("TCL: data_inner", files);
  data.set(data_inner.name, data_inner);
  $.ajax({
    url: url + "/" + uploadName,
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    method: "POST",
    success: function(res) {
      console.log(res);
      download(res);
    }
  });
});

$(".upload-section-convert__btn").on("click", function(e) {
  const data = new FormData();
  e.preventDefault();
  const files = $(".upload-section-convert__input")[0].files;
  const formatType = $("#format-select")[0].value;
  const data_inner = files[files.length - 1];

  data.set(data_inner.name, data_inner);
  data.set("formatType", formatType);
  console.log("TCL: data", data.get("formatType"));

  $.ajax({
    url: url + "/" + uploadName,
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    method: "POST",
    success: function(res) {
      console.log(res);
      download(res);
    }
  });
});

$(".upload-section-time__bnt").on("click", function(e) {
  const data = new FormData();
  e.preventDefault();
  const files = $(".upload-section-time__input")[0].files;
  const offset = $("#time-number")[0].value;
  const data_inner = files[files.length - 1];
  data.set(data_inner.name, data_inner);
  data.set("offset", offset);
  $.ajax({
    url: url + "/" + uploadName,
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    method: "POST",
    success: function(res) {
      console.log(res);
      download(res);
    }
  });
});

$(".upload-section-resync__btn").on("click", function(e) {
  const data = new FormData();
  e.preventDefault();
  const files = $(".upload-section-resync__input")[0].files;
  const data_inner = files[files.length - 1];
  console.log("TCL: data_inner", files);
  data.set(data_inner.name, data_inner);
  $.ajax({
    url: url + "/" + uploadName,
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    method: "POST",
    success: function(res) {
      console.log(res);
      download(res);
    }
  });
});

$(".upload-section-convertToFormat__btn").on("click", function(e) {
  const data = new FormData();
  e.preventDefault();
  const files = $(".upload-section-convertToFormat__input")[0].files;
  const data_inner = files[files.length - 1];
  console.log("TCL: data_inner", files);
  data.set(data_inner.name, data_inner);
  $.ajax({
    url: url + "/" + uploadName,
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    method: "POST",
    success: function(res) {
      console.log(res);
      download(res);
    }
  });
});
