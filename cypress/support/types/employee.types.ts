import { GENDER } from '../page-objects/pim-page'

export interface IEmployeeInfo {
  firstName: string
  middleName: string
  lastName: string
  employeeId: string
  userName: string
  password: string
  otherId: string
  licenseNum: string
  expDate: string
  nationality: string
  nationalityId: number
  maritalState: string
  dateOfBirth: string
  gender: GENDER
  bloodType: string
  testField: string
  status: true
  newNationality: string
}
