import fs from "fs";
import * as path from "path";

const unsync = (_file: string) => {
  try {
    if (fs.existsSync(_file)) {
      console.log("unsync")
      fs.unlinkSync(_file);
      return true;
    }
    console.log("false")
    return false;
  } catch (error) {
    throw error;
  }
};
export const unsyncFromPublic = (_file: string) => {
console.log(path.join(__dirname, "../../public/" + _file));
  return unsync(path.join(__dirname, "../../public/" + _file));
};

export default unsync;
