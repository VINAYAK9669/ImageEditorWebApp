fileInput = document.querySelector(".file-input");
previewImg = document.querySelector(".preview-img img");
chooseImgBtn = document.querySelector(".choose-img");
filterOptions = document.querySelectorAll(".filter button");
filterName = document.querySelector(".filter-info .name");
filterValue = document.querySelector(".filter-info .value");
filterSlider = document.querySelector(".slider input");
rotateOptions = document.querySelectorAll(".rotate button");
resetFilterBtn = document.querySelector(".reset-filter");
saveBtn = document.querySelector(".save-img");
resizeImgBtn = document.querySelector(".resizeImage");
imgResizerElm = document.querySelector(".imageResizer");
widthInput = document.querySelector(".width input");
heightInput = document.querySelector(".height input");
ratioInput = document.querySelector(".ratio input");
qualityInput = document.querySelector(".quality input");

let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0;

let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

const applyFilters = () => {
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
};

// Error Handling- if user do not select the file
const loadImage = () => {
  let file = fileInput.files[0];

  if (!file) {
    return;
  }
  // passing the file url as prview img src
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    resetFilterBtn.click(); // clicking reset Btn, so the filter value reset if the user select new img
    // Initially will set the original Sizes to the input
    widthInput.value = previewImg.naturalWidth;
    heightInput.value = previewImg.naturalHeight;
    // Oriignal Image ratio will help to fix the sizes late with aspect ratio
    ogImgRatio = previewImg.naturalWidth / previewImg.naturalHeight;
    document.querySelector(".container").classList.remove("disable");
    resizeImgBtn.classList.add("active");
  });
};

filterOptions.forEach((option) => {
  //   console.log(option);
  option.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;

    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .active"); // getting selected filter btn

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilters();
};

rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    // Adding click event listener to all rotate/buttons
    if (option.id === "left") {
      rotate -= 90; // if clicked btn is left rotate, decrment rotate value by -90
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilters();
  });
});
const resetFilter = () => {
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;

  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  applyFilters();
};

const saveImg = () => {
  const canvas = document.createElement("canvas"); // creating a canvas element
  const ctx = canvas.getContext("2d"); // canvas.getContext return a drawing context on the canvas
  canvas.width = widthInput.value;
  canvas.height = heightInput.value;
  const imgQuality = qualityInput.checked ? 0.7 : 1.0;
  // Applying user selected filters to canvas filter
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotate !== 0) {
    ctx.rotate(rotate * (Math.PI / 180));
  }
  ctx.scale(flipHorizontal, flipVertical); // flip canvas vertically or horizontally
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const link = document.createElement("a"); // create an <a> element
  link.download = "EditedImage.jpg"; //passing <a> tag download value to EditedImage.jpg
  link.href = canvas.toDataURL("image/jpeg", imgQuality); // [passing <a> tag href value to canvas data url]
  link.click(); // clicking <a> tag so the image will download
};

const resizeHandler = () => {
  imgResizerElm.classList.toggle("active");
};

widthInput.addEventListener("keyup", () => {
  const height = ratioInput.checked
    ? widthInput.value * ogImgRatio
    : heightInput.value;
  heightInput.value = Math.floor(height);
});

heightInput.addEventListener("keyup", () => {
  const width = ratioInput.checked
    ? heightInput.value / ogImgRatio
    : widthInput.value;
  widthInput.value = Math.floor(width);
});

// ===============        EVENT LISTENER         =======================

// If user clicks on choose Image then open a local folder
chooseImgBtn.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveBtn.addEventListener("click", saveImg);
resizeImgBtn.addEventListener("click", resizeHandler);
