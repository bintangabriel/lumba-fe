import useFetch from "./useFetch";
import axios from "axios";
import { getCookie } from "../helper/cookies";
import toast from "react-hot-toast";

const API_ROUTE = process.env.NEXT_PUBLIC_API_ROUTE;

// export const MODELS = API_ROUTE + "/modeling/listmodel/";

export const getAllModels = async ({ token, username, workspace, type }) => {
  let { data: models } = await axios.get(
    `${
      process.env.NEXT_PUBLIC_API_ROUTE + `/modeling/listmodel/`
    }?username=${username}&workspace=${workspace}&type=${type}`,
    {
      headers: {
        Authorization: `Token ${token || getCookie("token")}`,
      },
    }
  );

  if (type === 'object_segmentation') {
    models = models.map((model) => {
      const isDuplicate = models.some((m, i) => m.name === model.name && i !== model.id);
      return {
        id: model.id,
        modelName: model.name,
        file: model.file_name,
        // metrics: model.metrics,
        // score: model.score,
        metrics_scores: model.metrics_scores,
        method: model.method,
        algorithm: model.algorithm,
        trainDate: model.updated_time,
        isDuplicate,
      };
    });
  } else {
      models = models.map((model) => {
        const isDuplicate = models.some((m, i) => m.name === model.name && i !== model.id);
        return {
          id: model.id,
          modelName: model.name,
          file: model.file_name,
          // metrics: model.metrics,
          // score: model.score,
          metrics_scores: model.metrics_scores,
          method: model.method,
          algorithm: model.algorithm,
          trainDate: model.updated_time,
          features: model.feature.split(",").map((f) => ({ label: f, isNumeric: true })),
          predict: model.target,
          isDuplicate,
        };
      });
    }

  return models.reverse();
};

export const addModel = async (model) => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_ROUTE}/modeling/initiate/`, model, {
    headers: {
      Authorization: `Token ${getCookie("token")}`,
    },
  });


  // const checkStatusInterval = setInterval(async () => {
  //   const { data: modelStatus } = await axios.get(
  //     `${process.env.NEXT_PUBLIC_API_ROUTE}/modeling/getrecord/?id=${data.id}`,
  //     {
  //       headers: {
  //         Authorization: `Token ${getCookie("token")}`,
  //       },
  //     }
  //   );

  //   if (modelStatus.status === "completed") {
  //     clearInterval(checkStatusInterval);
  //   } else if (modelStatus.status === "in progress") {
  //     // Optionally show a toast notification every 5 minutes
  //     toast.info("Model creation still in progress.");
  //   }
  // }, 60000); // 300000 milliseconds = 5 minutes


  // setTimeout(async () => {
  //   const { data: modelStatus } = await axios.get(
  //     `${process.env.NEXT_PUBLIC_API_ROUTE}/modeling/getrecord/?id=${data.id}`,
  //     {
  //       headers: {
  //         Authorization: `Token ${getCookie("token")}`,
  //       },
  //     }
  //   );

  //   if (modelStatus.status === "in progress") {
  //     toast.error("Failed to create model.");
  //   }
  // }, 2000);

  // return data;
  return new Promise((resolve, reject) => {
    const checkStatusInterval = setInterval(async () => {
      try {
        const { data: modelStatus } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/modeling/getrecord/?id=${data.id}`,
          {
            headers: {
              Authorization: `Token ${getCookie("token")}`,
            },
          }
        );

        if (modelStatus.status === "completed") {
          clearInterval(checkStatusInterval);
          resolve(data); // Resolve the promise when status is completed
        } else if (modelStatus.status === "in progress") {
          toast("Model creation still in progress.");
        } else if (modelStatus.status === "accepted") {
          toast("Server accept the model creation");
        } else {
          clearInterval(checkStatusInterval);
          console.log(modelStatus.status)
          reject(new Error("Model creation failed."));
        }
      } catch (error) {
        clearInterval(checkStatusInterval);
        reject(error); // Reject the promise if an error occurs
      }
    }, 60000); // Check every 5 minutes (300000 milliseconds)

    // Initial check immediately
    (async () => {
      try {
        const { data: modelStatus } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/modeling/getrecord/?id=${data.id}`,
          {
            headers: {
              Authorization: `Token ${getCookie("token")}`,
            },
          }
        );

        if (modelStatus.status === "completed") {
          clearInterval(checkStatusInterval);
          resolve(data); // Resolve the promise if already completed
        } else if (modelStatus.status === "in progress") {
          toast("Model creation still in progress.");
        } else if (modelStatus.status === "accepted") {
          toast("Server accept the model creation");
        } else {
          clearInterval(checkStatusInterval);
          reject(new Error("Model creation failed."));
        }
      } catch (error) {
        clearInterval(checkStatusInterval);
        reject(error); // Reject the promise if an error occurs
      }
    })();
  });
};

const useModels = ({ username, workspace, type }) => {
  const MODELS =
    process.env.NEXT_PUBLIC_API_ROUTE + `/modeling/listmodel/?username=${username}&workspace=${workspace}&type=${type}`;
  const { data: models, mutate } = useFetch(MODELS, () => getAllModels({ url: MODELS, username, workspace, type }), {
    fallbackData: [],
  });

  const deleteModel = async (model) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_ROUTE}/modeling/deletemodel/`, model, {
        headers: {
          Authorization: `Token ${getCookie("token")}`,
        },
      })
      .then(() => mutate(() => models.filter((model) => model.modelName !== modelName)))
      .catch(() => toast.error("Failed to delete model."));
  };

  return { models, deleteModel, mutate };
};

export default useModels;
