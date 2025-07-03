import { IEmployee, IPost } from '../../types/employeePost.types'

export interface ICreatePostResponse {
  data: {
    employee: IEmployee
    post: IPost
    createdAt: string
    meta: any[]
    rels: any[]
  }
}
