export interface IJobTitle {
  id: number
  title: string
  description?: string
  note?: string
}

export interface IVacancy {
  id: number
  name: string
  jobTitleId: number
  employeeId: number
  status: boolean
  isPublished: boolean
}

export interface ICandidate {
  id: number
  firstName: string
  middleName?: string | null
  lastName: string
  email: string
  status?: string
}