const supabaseUrl = "https://piuwjiifsluzggzojhuz.supabase.co";
const supabaseKey = "sb_publishable_mfss4b_IaFPV7gB9OPXp-A_rIwnB6hW";
const { createClient } = supabase;
const client = createClient(supabaseUrl, supabaseKey);

// ========== UPLOAD IMAGE  ==========

const uploadBtn = document.querySelector("#upload");
const file = document.querySelector("#picture");
const deleteBtn = document.querySelector("#delete");
const updateBtn = document.querySelector("#update");
let uiImage = document.querySelector("#uiImage");
let cameraImgText = document.querySelector("#cameraImgText");
let heading = document.querySelector("h5");
let text = document.querySelector("p");

let currentImg = "";

uploadBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  let uploadedFile = file.files[0];

  if (!uploadedFile) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please Choose Image",
    });
    return;
  }
  currentImg = `${Date.now()}-${uploadedFile.name}`;

  // UPLOAD

  const { data, error } = await client.storage
    .from("images")
    .upload(currentImg, uploadedFile, {
      cacheControl: "3600",
      contentType: uploadedFile.type,
      upsert: false,
    });

  if (error) {
    console.log(error);
  }

  // GET PUBLIC URL

  const { data: uploadData } = client.storage
    .from("images")
    .getPublicUrl(currentImg);

  if (uploadData) {
    console.log(uploadData.publicUrl);

    uiImage.src = uploadData.publicUrl;
  } else {
    console.log(error);
  }

  cameraImgText.innerHTML = "";
  heading.innerHTML = "Your Image";
  text.innerHTML = "Image has been succesfully uploaded";
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

  const { data: updateData, error: updateError } = client.storage
    .from("images")
    .getPublicUrl(currentImg);

  if (updateError) {
    console.log("Update failed:", updateError.message);
    return;
  }

  let updateUiImg = `${updateData.publicUrl}?t=${Date.now()}`;
  console.log(updateUiImg);

  uiImage.src = updateUiImg;

  heading.innerHTML = "Your Updated Image";
  text.innerHTML = "Image has been successfully updated";
});

// ========== DELETE IMAGE  ==========

deleteBtn.addEventListener("click", async () => {
  let uploadedFile = file.files[0];

  if (!uploadedFile) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No image found to delete",
    });
    return;
  }
  const { data, error } = await client.storage
    .from("images")
    .remove([currentImg]);

  uiImage.remove();

  Swal.fire({
    title: "Image Deleted Successfully!",
    icon: "success",
    draggable: true,
  });
  if (error) {
    console.log(error.message);
    return;
  }
  cameraImgText.innerHTML = "📸";
  heading.innerHTML = "Select Image";
  text.innerHTML = "Choose an image from your device";
});
