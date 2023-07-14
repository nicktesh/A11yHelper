//Sub-menu height fix
$(document).ready(function () {
  // Check window width
  if ($(window).width() > 1200) {
    // Get all elements with class .sub-menu
    let subMenus = $(".sub-menu");

    // Loop through each .sub-menu element and check its height
    subMenus.each(function () {
      // get height of the element
      let height = $(this).height();
      if (height > 500) {
        // if height is greater than 500px
        $(this).css("max-height", "500px");
        $(this).css("overflow-y", "scroll");
        $(this).css("overflow-x", "hidden");
      }
    });
  }
});
// Mobile Menu
if (document.querySelector(".mobile-menu")) {
  const menu = document.querySelector(".mobile-menu");
  const menuToggleButton = document.querySelector(".mobile-menu-toggle");
  const body = document.querySelector("body");
  const overlay = document.querySelector(".mob-overlay");

  menuToggleButton.addEventListener("click", function () {
    menu.classList.toggle("open");
    overlay.classList.toggle("open");
    menuToggleButton.classList.toggle("close");
    body.classList.toggle("scroll");
  });
}
// Image Converter
var compressedImages = [];

function compressImages(files, compressionLevel) {
  var totalFiles = files.length;
  var compressedCount = 0;
  compressedImages = [];

  function compressImage(file) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          function (blob) {
            var originalFileName = file.name;
            var compressedFileName = originalFileName.replace(/\.[^.]+$/, "") + "_min.jpg";
            var compressedImage = new File([blob], compressedFileName, { type: "image/jpeg" });
            compressedImages.push(compressedImage);
            compressedCount++;
            if (compressedCount === totalFiles) {
              showDownloadButton();
            }
          },
          "image/jpeg",
          compressionLevel
        );
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  for (var i = 0; i < totalFiles; i++) {
    compressImage(files[i]);
  }
}

function handleFileInputChange(event) {
  var files = event.target.files;
  var compressionLevel = document.getElementById("compressionRange").value;
  compressImages(files, compressionLevel);
}

function showDownloadButton() {
  var downloadButton = document.getElementById("downloadButton");
  downloadButton.style.display = "block";
}

function downloadImages() {
  if (compressedImages.length === 1) {
    var downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(compressedImages[0]);
    downloadLink.download = compressedImages[0].name;
    downloadLink.click();
  } else if (compressedImages.length > 1) {
    var zip = new JSZip();
    var zipFilename = "compressed_images.zip";
    compressedImages.forEach(function (image) {
      var originalFileName = image.name;
      zip.file(originalFileName + ".jpg", image);
    });
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, zipFilename);
    });
  }
}
