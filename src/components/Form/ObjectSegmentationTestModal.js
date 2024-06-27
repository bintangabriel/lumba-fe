import { useContext, useState } from "react";
import { FormModalContext } from "../../context/FormModalContext";
import Button from "../Button/Button";
import Close from "../Icon/Close";
import Question from "../Icon/Question";
import { useRouter } from "next/router";
import useCookie from "../../hooks/useCookie";
import axios from "axios";
import Spinner from "../Spinner";
import { getCookie } from "../../helper/cookies";
import UploadImage from "./UploadImage";

export default function ObjectSegmentationTestModal({ CustomButton, features, type, modelName }) {
  const { formData, setFormData, isOpen, setIsOpen } = useContext(FormModalContext);
  const router = useRouter()
  const { workspaceName } = router.query
  const username = useCookie('username')
  const [ result, setResult ] = useState("-")
  const [ isTesting, setIsTesting ] = useState(false)
  const [previewImage, setPreviewImage] = useState(""); // Picture preview
  const [resultImage, setResultImage] = useState("");

  const handleSubmit = (formData) => {
    setIsTesting(true)
    const dataset = new FormData();
    if (type === "object_segmentation"){
      dataset.append("file", formData?.file);
    } else {
      dataset.append("file", formData?.file);
    }
    dataset.append("username", username);
    dataset.append("workspace", workspaceName);
    dataset.append("type", type);
    dataset.append("model_name", modelName);

    // Perform the axios request on submit
    axios
    .post(
      `${process.env.NEXT_PUBLIC_API_ROUTE}/modeling/predict/?modelname=${modelName}&username=${username}&workspace=${workspaceName}&type=${type}`,
      dataset,
      {
        headers: {
          Authorization: `Token ${getCookie("token")}`,
        },
      }
    )
    .then((res) => {
      const imageData = res.data.image;
      const { image } = JSON.parse(imageData)
      setResultImage(`data:image/png;base64,${image}`);
      setIsTesting(false)
    })
    .catch((error) => {
      setResult(<span className="text-pink">An error occurred.</span>);
      setIsTesting(false)
    });
  }

  return (
    <>
    <CustomButton
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(true);
      }}
    />
    <div
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(false);
      }}
      className={`${
        isOpen ? "block" : "hidden"
      } z-30 fixed inset-0 w-screen h-screen bg-gray/60 transition duration-300`}
    ></div>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${isOpen ? "block" : "hidden"} z-40 fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white p-3 rounded-lg`}
      >
      <div className="pb-2 mb-4">
        <div className="flex justify-between items-center relative">
          <h4 className="font-medium relative z-40">Test Model</h4>
          <Close
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            type="button"
          />
        </div>
        <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-5">
          <span className="font-semibold">Image tobe tested</span> <Question label="predictor variable" />
        </div>
      {previewImage ? <img src={previewImage} alt="Preview" className="max-w-full max-h-[200px] object-contain" /> : null}
        <div>
        <UploadImage setPreviewImage={setPreviewImage} handleSubmit={handleSubmit} />
        </div>
        <div className="text-center">
          <Button onClick={() => handleSubmit(formData)} disabled={isTesting} variant={isTesting ? "disabled" : "primary"}>
            Test
          </Button>
        </div>
      </div>
      <div className="mb-5 mt-2">
        <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Target Predict Result</span> <Question label="outcome variable" />
        </div>
        <div className="flex justify-center items-center h-[200px]">
          {isTesting ? (
            <Spinner />
          ) : resultImage ? (
            <img src={resultImage} alt="Result" className="max-w-full max-h-full" />
          ) : result}
        </div>
      </div>
    </div>
  </>
  );
}
