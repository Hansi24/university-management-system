export interface ICourse {
  _id: string;
  name: string;
  code: string;
  semesters: {
    semesterNumber: number;
    modules: {
      name: string;
      code: string;
    }[];
  }[];
}