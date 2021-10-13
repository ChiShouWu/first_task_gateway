import { Observable } from 'rxjs';

export interface UserMicroService {
  create(UserInterface): Observable<any>;
  findById({ id: string }): Observable<any>;
  findAll({}): Observable<any>;
  update(UserInterface): Observable<any>;
  delete({ id: string }): Observable<any>;
}

export interface UserInterface {
  id?: string;
  username: string;
  account: string;
  password: string;
}
