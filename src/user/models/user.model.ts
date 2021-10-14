import { Observable } from 'rxjs';
export interface UserMicroService {
  create(UserInterface): UserInterface;
  findById(Id): UserInterface;
  findAll({}): UserInterface[];
  update(UserInterface): UserInterface;
  delete(Id): Observable<DeleteResponse>;
  uploadFile(upstream: Observable<UploadRequest>): Observable<UploadStatus>;
}

export interface UserInterface {
  id?: string;
  username: string;
  account: string;
  password: string;
}
export interface Id {
  id: string;
}

export interface DeleteResponse {
  success: boolean;
}
export interface UploadRequest {
  filename: string;
  chunk: Uint8Array;
}

export enum UploadStage {
  uploading,
  complete,
  failed,
}
export interface UploadStatus {
  stage: UploadStage;
  filename: string;
}
