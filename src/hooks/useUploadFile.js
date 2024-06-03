import axios from "axios";
import useFetch from "./useFetch";
import { getCookie } from "../helper/cookies";
import * as React from "react";
import { DetailsModalContext } from "../context/DetailsModalContext";

const API_ROUTE = process.env.NEXT_PUBLIC_API_ROUTE;

const UPLOAD_IMAGE = API_ROUTE + "/modeling/predict/object-segmentation";

export const getAllDatasets = async (url, token) => {
  const response = await axios.get(url, {
    headers: {
      Authorization: `Token ${token || getCookie("token")}`,
    },
  });

  const { data } = response;

  return data.reverse();
};

const useUploadFile = (workspace, username, type) => {
  const { setIsLoading, setVariant, setCustomMessage } = React.useContext(DetailsModalContext);

  const uploadFile = async (dataset) => {
    try {
      setIsLoading(true);
      const response = await axios.post(UPLOAD_IMAGE, dataset, {
        headers: {
          Authorization: `Token ${getCookie("token")}`,
        },
      });
      const { data } = response;

    } catch (err) {
      setCustomMessage("An error occurred while uploading image");
      setVariant("error");
    } finally {
      setIsLoading(false);
    }
  };
  return { uploadFile };
}

export default useUploadFile;
