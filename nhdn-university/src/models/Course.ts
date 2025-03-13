export interface ICourse {
  _id: string;
  name: string;
  code: string;
  semesters: {
    semesterNumber: number;
    modules: IModule[];
  }[];
}

export interface IModule {
  _id?: string;
  name: string;
  code?: string;
  description?: string;
  semester: number;
}