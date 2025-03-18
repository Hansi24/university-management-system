export enum ModuleMaterialType {
    LECTURE = "LECTURE",
    ASSIGNMENT = "ASSIGNMENT",
    QUIZ = "QUIZ",
    RESOURCE = "RESOURCE",
  }
  
  export interface IModuleMaterial {
    _id?: string;
    title: string;
    description?: string;
    type: ModuleMaterialType;
    moduleId: string;
    fileUrl?: string; 
    dueDate?: Date; 
    createdAt: Date;
    updatedAt: Date;
  }