interface Employee {
  empNumber: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  terminationId: null | string;
}

interface Post {
  id: number;
}

interface CreatePostResponse {
  data: {
    employee: Employee;
    post: Post;
    createdAt: string;
    meta: any[];
    rels: any[];
  }
}

export { Employee, Post, CreatePostResponse };