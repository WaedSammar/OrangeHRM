export interface IEmployee {
  empNumber: number
  employeeId: string
  firstName: string
  lastName: string
  middleName: string
  terminationId: null | string
}

export interface IPost {
  id: number
}

export interface ICreatePostResponse {
  data: {
    employee: IEmployee
    post: IPost
    createdAt: string
    meta: any[]
    rels: any[]
  }
}