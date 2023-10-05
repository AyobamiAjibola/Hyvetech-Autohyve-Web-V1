import { UploadResult } from "@app-model";
import axiosClient from "../config/axiosClient";

export class Uploader {
  static uploadFile = async (payload: FormData) => {
    const response = await axiosClient.post(`/api/v1/upload/file`, payload);

    return response.data as UploadResult;
  };
}
