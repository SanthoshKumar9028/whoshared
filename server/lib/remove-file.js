import fs from "fs";

export function removeProfileImg(id) {
  let dir = "./uploads/profile-img/";
  fs.readdir(dir, (err, files) => {
    if (err) return;
    let imgName = null;
    for (let file of files) {
      if (file.indexOf(id) != -1) {
        imgName = file;
        break;
      }
    }
    if (imgName == null) return;
    fs.unlink(dir + imgName, (err) => console.log(err));
  });
}
