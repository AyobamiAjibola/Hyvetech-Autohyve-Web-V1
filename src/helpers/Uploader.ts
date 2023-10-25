import { UploadResult } from "@app-model";
import axiosClient from "../config/axiosClient";

export class Uploader {
  static uploadFile = async (payload: FormData) => {
    axiosClient.defaults.headers.post['Content-Type'] = 'multipart/form-data';
    const response = await axiosClient.post(`/api/v1/upload/file`, payload);

    return response.data as UploadResult;
  };
}
