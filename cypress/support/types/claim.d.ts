export interface IClaimRequest {
  eventTypeName: string
  eventTypeDescription: string
  eventTypeStatus: boolean
  expenseTypeName: string
  expenseTypeDescription: string
  expenseTypeStatus: boolean
  currencyType: string
  claimRequestStatus: string
  expenseDate: string
  expenseAmount: string
}
