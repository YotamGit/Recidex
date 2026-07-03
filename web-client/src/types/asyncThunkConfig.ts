import { AppDispatch, RootState } from "../store";

export interface AsyncThunkError {
  statusCode: number;
  data: any;
  message: string;
}

export type AsyncThunkConfig = {
  /** return type for `thunkApi.getState` */
  state?: RootState;
  /** type for `thunkApi.dispatch` */
  dispatch?: AppDispatch;

  /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
  rejectValue?: AsyncThunkError;
};
