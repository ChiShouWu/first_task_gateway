import { Observable } from 'rxjs';
import { ClientStreamingHandler } from '@grpc/grpc-js/build/src/server-call';
export interface UserMicroService {
  create(UserInterface): Observable<any>;
  findById(Id): Observable<any>;
  findAll({}): Observable<any>;
  update(UserInterface): Observable<any>;
  delete(Id): Observable<any>;
  uploadFile(upstream: Observable<UploadRequest>): Observable<any>;
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
