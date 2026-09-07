const supabaseUrl = "https://piuwjiifsluzggzojhuz.supabase.co";
const supabaseKey = "sb_publishable_mfss4b_IaFPV7gB9OPXp-A_rIwnB6hW";
const { createClient } = supabase;
const client = createClient(supabaseUrl, supabaseKey);
console.log(client);

// ========== UPLOAD IMAGE  ==========

const uploadBtn = document.querySelector("#upload");
const file = document.querySelector("#picture");
let uiImage = document.querySelector("#uiImage");
let cameraImgText = document.querySelector("#cameraImgText");
let updateBtn = document.querySelector("#update");
let heading = document.querySelector("h5");
let text = document.querySelector("p");
let deleteBtn = document.querySelector("#delete");

let currentImg = "";

uploadBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  console.log("upload image");

  cameraImgText.innerHTML = "";
  heading.innerHTML = "Your Image";
  text.innerHTML = "Image has been succesfully uploaded";

  let uploadedFile = file.files[0];

  if (!uploadedFile) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please Choose Image",
    });
    return;
  }

  console.log(file.files[0]);

  currentImg = `${Date.now()}-${uploadedFile.name}`;

  // UPLOAD

  const { data, error } = await client.storage
    .from("images")
    .upload(currentImg, uploadedFile, {
      cacheControl: "3600",
      contentType: uploadedFile.type,
      upsert: false,
    });
  if (data) {
    console.log(data);
  } else {
    console.log(error);
  }

  // GET PUBLIC URL

  const { data: uploadData } = client.storage
    .from("images")
    .getPublicUrl(currentImg);

  console.log(uploadData);

  if (uploadData) {
    uiImage.src = uploadData.publicUrl;
  } else {
    console.log(error);
  }
});

// ========== UPDATE IMAGE  ==========

updateBtn.addEventListener("click", async () => {
  let uploadedFile = file.files[0];

  if (!uploadedFile) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please Upload Image",
    });
    return;
  }

  // UPDATE

  const { data, error } = await client.storage
    .from("images")
    .update(currentImg, uploadedFile, {
      contentType: uploadedFile.type,
      cacheControl: "3600",
    });

  // Check update error
  if (error) {
    console.log("Update failed:", error.message);
    return;
  }

  // GET UPDATED IMAGE URL

  const { data: updateData } = client.storage
    .from("images")
    .getPublicUrl(currentImg);

  if (error) {
    console.log("Update failed:", error.message);
    return;
  }

  let updateUiImg = `${updateData.publicUrl}?t=${Date.now()}`;

  uiImage.src = updateUiImg;
});

// ========== DELETE IMAGE  ==========

deleteBtn.addEventListener("click", async () => {
  const { data, error } = await client.storage
    .from("images")
    .remove(currentImg);

  uiImage.remove();

  cameraImgText.innerHTML = "📸";
  heading.innerHTML = "Select Image";
  text.innerHTML = "Choose an image from your device";

  Swal.fire({
    title: "Image Deleted Successfully!",
    icon: "success",
    draggable: true,
  });
  if (error) {
    console.log(error.message);
    return;
  }
});
