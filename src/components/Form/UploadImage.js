// import { useContext } from "react";
// import { FormModalContext } from "../../context/FormModalContext";
// import Close from "../Icon/Close";
// import FileInput from "./FileInput";
// import { csvFileToArray } from "../../helper/csvFileReader";

// export default function UploadImage({ buttonLabel, formLabel, CustomButton, handleSubmit, customButtonClass, workspaceType, setPreviewImage}) {
//   const { formData, setFormData, isOpen, setIsOpen } = useContext(FormModalContext);

//     const readImageFile = (file) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
 
//     reader.onload = (e) => {
//       setPreviewImage(e.target.result);
//     }  
//   }

//   // Inside changeHandler function
//   const changeHandler = (e) => {
//     const file = e.target.files[0];

//     readImageFile(file); // Call readImageFile when file is selected

//     if (workspaceType !== "object_segmentation"){
//       setFileName(file.name);
//       setFormData({ file: file });
//     } else {
//       setFileName(file.name);
//       setFormData({ file: file });
//     }
//   }

//   return (
//     <>
//       {isOpen && (
//         <form
//           action=""
//           className="rounded-md shadow px-4 py-3 w-[450px] mx-auto flex flex-col transition duration-300 overflow-x-hidden relative bg-white z-40"
//           onSubmit={(e) => {
//             e.preventDefault();
//             const fileReader = new FileReader();
//             if (formData?.file) {
//               fileReader.onload = function (event) {
//                 const text = event.target.result;
//                 csvFileToArray(text);
//               };

//             fileReader.readAsText(formData?.file);
//             }
//             handleSubmit(formData);
//           }}
//         >
//           <div className="pb-2 mb-4">
//             <div className="flex justify-between items-center relative">
//               <h4 className="font-medium relative z-40">{formLabel}</h4>
//             </div>
//             <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
//           </div>
//           <FileInput workspaceType={workspaceType} setFormData={setFormData} setIsOpen={setIsOpen} />
//         </form>
//       )}
//     </>
//   );
// }


import React, { useContext } from "react";
import { FormModalContext } from "../../context/FormModalContext";
import Close from "../Icon/Close";
import Button from "../Button/Button";

export default function UploadImage({ buttonLabel, formLabel, CustomButton, setPreviewImage, handleSubmit, customButtonClass }) {
  const { formData, setFormData, isOpen, setIsOpen } = useContext(FormModalContext);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ file: file });
    
    // Preview the uploaded file
    const fileReader = new FileReader();
    fileReader.onload = (e) => setPreviewImage(e.target.result);
    fileReader.readAsDataURL(file);
  }

  return (
    <>
      {isOpen && (
        <form
          action=""
          className="rounded-md shadow px-4 py-3 w-[450px] mx-auto flex flex-col transition duration-300 overflow-x-hidden relative bg-white z-40"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(formData);
          }}
        >
          <div className="pb-2 mb-4">
            <div className="flex justify-between items-center relative">
              <h4 className="font-medium relative z-40">{formLabel}</h4>
            </div>
            <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
          </div>
          <input type="file" onChange={handleFileChange} />
        </form>
      )}
    </>
  );
}
